import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"

// Login user
const loginUser = async (req,res) => {
    const {email,password}= req.body;
    try{
        const user= await userModel.findOne({email});

        if(!user) {
            return res.json({success:false,message:"user Doesn't exist"});
        }
        
        // Direct password comparison
        if (password !== user.password) {
            return res.json({ success: false, message: "Invalid password" });
        }


        const token = createToken(user._id); // create token is a function define in middle 
        res.json({success:true,token});
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}


const createToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET, { expiresIn: "7d" });
}

//register user
const registerUser = async(req,res)=> {
     const { name, email, password, mobile, storeName, billPasscode, totalCustomer, image } = req.body;
    try{
        // checking is user already exists
        const exists = await userModel.findOne({email});
        if(exists) {
            return res.json({success:false,message:"User already Exists"});
        }

        //validating email format & strong password
        if(!validator.isEmail(email)) {
            return res.json({success:false, message:"Please enter a valid email"});
        }
        if(password.length<8) {
            return res.json({success:false,message:"Please enter a strong password (min 8 chars)"});
        }

            const newUser = new userModel({
                name:name,
                email:email,
                password: password,
                mobile: mobile,
                storeName: storeName,
                billPasscode: billPasscode,
                totalCustomer: totalCustomer,
                image: image || ""                  // default empty string
                });

        // this is save data on mongodb
        const user = await newUser.save();
        const token = createToken(user._id);
        res.json({success:true,token});

    }
    catch(error){
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}

export {loginUser, registerUser};