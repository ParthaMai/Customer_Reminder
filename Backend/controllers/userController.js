import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"
import cloudinary from "../config/cloudinary.js";
import transporter from "../config/mail.js";

// Login user
const loginUser = async (req, res) => {
  const { mobile, password } = req.body;
  try {

    // ✅ Validate mobile number
    if (!mobile || !/^[0-9]{10}$/.test(mobile)) {
      return res.json({ success: false, message: "Please enter a valid 10-digit mobile number" });
    }
    const user = await userModel.findOne({ mobile });

    if (!user) {
      return res.json({ success: false, message: "Invalid mobile or password" });
    }

    const isMatch = await bcrypt.compare(password,user.password);
    
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid mobile or password" });
    }


    const token = createToken(user._id); // create token is a function define in middle 
    res.json({ success: true, token });
  }
  catch (error) {
    console.log(error);
    res.json({ success: false, message: "Oops! Something went wrong. OR Please contact support." });
  }
}


const createToken = (id) => {
  const now = new Date();

  // 👉 Convert to IST
  const istNow = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );

  // 👉 Add 7 days
  const expiryDate = new Date(istNow);
  expiryDate.setDate(expiryDate.getDate() + 7);

  // 👉 Set to 11:59:59 PM IST
  expiryDate.setHours(23, 59, 59, 999);

  // 👉 Convert difference to seconds
  const expiresIn = Math.floor((expiryDate - istNow) / 1000);

  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn });
};

//register user
const registerUser = async (req, res) => {
  const { name, email, password, mobile, storeName, billPasscode, totalCustomer } = req.body;

  const imageUrl = req.file ? req.file.path : null;
  const publicId = req.file ? req.file.filename : null;
  try {

    if (!mobile || !/^[0-9]{10}$/.test(mobile)) {
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
      return res.json({ success: false, message: "Please enter a valid 10-digit mobile number" });
    }
    // ✅ Check if user already exists (by mobile)
    const exists = await userModel.findOne({ mobile });
    if (exists) {
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
      return res.json({ success: false, message: "User already exists with this mobile number" });
    }
    const Mailexists = await userModel.findOne({ email });
    if (Mailexists) {
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
      return res.json({ success: false, message: "This Email already Exists Try another Email" });
    }
    //validating email format & strong password 
    if (!validator.isEmail(email)) {
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
      return res.json({ success: false, message: "Please enter a valid email" });
    }

    if (password.length < 8) {
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
      return res.json({ success: false, message: "Please enter a strong password (min 8 chars)" });
    }

    //hasing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
      mobile: mobile,
      storeName: storeName,
      billPasscode: billPasscode,
      totalCustomer: totalCustomer,
      image: imageUrl || ""             // default empty string
    });

    // this is save data on mongodb
    const user = await newUser.save();
    const token = createToken(user._id);
    res.json({ success: true, token });

  }
  catch (error) {
    console.log(error);
    res.json({ success: false, message: "Oops! Something went wrong. OR Please contact support." });
  }
}


// in storeContext 
const getUserProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId).select("-password");

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });

  } catch (error) {
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }
    console.log(error);
    res.json({ success: false, message: "Error fetching profile" });
  }
};

const incrementBill = async (req, res) => {
  try {

    const user = await userModel.findByIdAndUpdate(
      req.userId,
      { $inc: { totalBill: 1 } },
      { returnDocument: "after" }
    );


    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, totalBill: user.totalBill });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error updating bill number" });
  }
};

// For send OTP on mail
const sendOtp = async (req, res) => {
  const { mobile } = req.body;

  try {
    // ✅ Validate mobile number
    if (!mobile || !/^[0-9]{10}$/.test(mobile)) {
      return res.json({ success: false, message: "Enter valid mobile number" });
    }

    // ✅ Find user using mobile
    const user = await userModel.findOne({ mobile });
    if (!user) {
      return res.json({ success: false, message: "User not found OR Invalid Mobile Number" });
    }

    // ✅ Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 min
    await user.save();

    // ✅ Send OTP to user's email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email, // 🔥 important change
      subject: "Password Reset OTP",
      text: `Your OTP is ${otp}`,
    });

    res.json({ success: true, message: "OTP sent to registered email" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error sending OTP" });
  }
};

// OTP Verifiation
const verifyOtpAndChangePassword = async (req, res) => {
  const { mobile, otp, newPassword } = req.body;

  try {
    // ✅ Validate mobile
    if (!mobile || !/^[0-9]{10}$/.test(mobile)) {
      return res.json({ success: false, message: "Enter valid mobile number" });
    }

    // ✅ Find user using mobile
    const user = await userModel.findOne({ mobile });

    if (!user) {
      return res.json({ success: false, message: "User not found OR Invalid Mobile Number" });
    }

    // ✅ Check OTP
    if (user.otp.toString() !== otp.toString() || user.otpExpiry < Date.now()) {
  return res.json({ success: false, message: "Invalid or expired OTP" });
}

    // ✅ Validate new password
    if (!newPassword || newPassword.length < 8) {
      return res.json({success: false, message: "Password must be at least 8 characters", });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // ✅ Clear OTP
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.json({ success: true, message: "Password changed successfully" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error resetting password" });
  }
};


export { loginUser, registerUser, getUserProfile, incrementBill, sendOtp, verifyOtpAndChangePassword };