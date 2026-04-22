import React, { use, useContext, useEffect } from 'react'
import './LoginPopup.css'
import { useState } from 'react'
import axios from 'axios'
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import imageCompression from "browser-image-compression";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'

const LoginPopup = ({ setShowLogin }) => {

  const navigate = useNavigate();
  const { url, setToken, fetchUser } = useContext(StoreContext);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [image, setImage] = useState(null);

  const [currState, setCurrState] = useState("Login");

  // For Forgot password 
  const [isForgot, setIsForgot] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    storeName: "",
    image: "",
    billPasscode: ""
  })

  // Timer Logic
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  //send OTP
  const handleSendOtp = async () => {
    if (!data.mobile || data.mobile.length !== 10) {
      alert("Please enter a valid mobile number");
      return;
    }
    try {
      setOtpLoading(true);
      const response = await axios.post(`${url}/api/user/send-otp`, {
        mobile: data.mobile,
      });

      if (response.data.success) {
        toast.success("OTP sent to your email");
        setOtpSent(true);
        setTimer(300); // 5 min
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Error sending OTP OR Invalid Mobile number");
    } finally {
      setOtpLoading(false);
    }
  };

  // verify OTP and change password
  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setResetLoading(true);
      const response = await axios.post(`${url}/api/user/reset-password`, {
        mobile: data.mobile,
        otp,
        newPassword,
      });

      if (response.data.success) {
        toast.success("Password changed successfully");
        setIsForgot(false);
        setOtpSent(false);
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Error resetting password");
    } finally {
      setResetLoading(false);
    }
  };
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const options = {
      maxSizeMB: 0.3,        // ~300 KB
      maxWidthOrHeight: 600,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      setImage(compressedFile);
      setData(prev => ({ ...prev, image: compressedFile }));
    } catch (error) {
      console.error(error);
    }
  };

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prev => ({ ...prev, [name]: value }));
  };
  const onlogin = async (event) => {
    event.preventDefault();

    if (data.password.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }
    setLoading(true);
    let newUrl = url;
    if (currState === "Login") {
      newUrl += '/api/user/login';
    }
    else {
      newUrl += "/api/user/register";
    }

    try {
      let payload;
      let response;

      // ✅ ONLY use FormData for SIGN UP (because image exists there)
      if (currState === "Sign Up") {
        payload = new FormData();

        payload.append("name", data.name);
        payload.append("email", data.email);
        payload.append("password", data.password);
        payload.append("mobile", data.mobile);
        payload.append("storeName", data.storeName);
        payload.append("billPasscode", data.billPasscode);

        if (image) {
          payload.append("image", image);
        }
        response = await axios.post(newUrl, payload);
      } else {
        response = await axios.post(newUrl, data);
      }

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        fetchUser();
        setShowLogin(false);
        setData({
          name: "",
          email: "",
          password: "",
          mobile: "",
          storeName: "",
          image: "",
          billPasscode: ""
        });
        setImage(null);
        navigate("/");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setLoading(false); // 🔥 stop loading
    }
  }
  // To verify the signup and login function from backend
  // useEffect(() =>{
  //   console.log(data);
  // },[data]);

  return (
    <div className='login-popup'>
      <form onSubmit={onlogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
        </div>
        <div className="login-popup-input">
          {!isForgot && (
            <>
              {currState === "Login" ? <></> : <>
                <input name="name" onChange={onChangeHandler} value={data.name} type="text" placeholder='Your name' required />
                <input name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder='Your email' required />
                <div className="add-img-upload">
                  <p>Upload Image (Optional)</p>
                  <label htmlFor="image">
                    <img src={image ? URL.createObjectURL(image) : assets.upload_icon} alt="upload" />
                  </label>
                  <input id="image" type="file" accept="image/*" onChange={handleImageChange} hidden />
                </div>
                <input name="storeName" onChange={onChangeHandler} value={data.storeName} type="text" placeholder='Store name' required />
                <input name="billPasscode" onChange={onChangeHandler} value={data.billPasscode} type="text" placeholder='Bill PassCode - A, B , C...' required />
              </>
              }
              <input name="mobile" onChange={onChangeHandler} value={data.mobile} type="tel" maxLength="10" placeholder='Mobile number' required />
              <div className="password-wrapper">
                <input className="password-input" name="password" onChange={onChangeHandler} value={data.password} type={showPassword ? "text" : "password"} placeholder="Password" required />

                <img
                  src={showPassword ? assets.visible_off : assets.visible_icon}
                  alt=""
                  className="password-icon"
                  onClick={() => setShowPassword(!showPassword)}
                />
              </div>
              {/* ✅ ADD THIS LINE ONLY */}
              {currState === "Login" && (
                <p className="forgot-link" onClick={() => setIsForgot(true)}>
                  Forgot Password?
                </p>
              )}
            </>
          )}
          {/* 🔵 FORGOT PASSWORD UI (NEW) */}
          {isForgot && (
            <>
              <input type="tel" inputMode="numeric" maxLength="10" placeholder="Enter registered mobile" value={data.mobile} onChange={(e) => setData({ ...data, mobile: e.target.value })} />

              {!otpSent ? (
                <button type="button" onClick={handleSendOtp} disabled={otpLoading}>
                  {otpLoading ? <div className="loader"></div> : "Send OTP"}
                </button>
              ) : (
                <>
                  <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />

                  <p>
                    Time left: {Math.floor(timer / 60)}:
                    {(timer % 60).toString().padStart(2, "0")}
                  </p>

                  <div className="password-wrapper">
                    <input className="password-input" type={showNewPassword ? "text" : "password"} placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />

                    <img src={showNewPassword ? assets.visible_off : assets.visible_icon} alt="" className="password-icon" onClick={() => setShowNewPassword(!showNewPassword)} />
                  </div>

                  <div className="password-wrapper">
                    <input className="password-input" type={showConfirmPassword ? "text" : "password"} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

                    <img src={showConfirmPassword ? assets.visible_off : assets.visible_icon}
                      alt="" className="password-icon"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
                  </div>

                  <button type="button" onClick={handleResetPassword} disabled={resetLoading}>
                    {resetLoading ? <div className="loader"></div> : "Reset Password"}
                  </button>
                </>
              )}

              <p onClick={() => setIsForgot(false)}>Back to Login</p>
            </>
          )}
        </div>
        {!isForgot && (
          <button type='submit' className='login-btn' disabled={loading}>
            {loading ? <div className="loader"></div> : (currState === "Sign Up" ? "Create account" : "Login")}
          </button>
        )}
        {!isForgot && (
          <>
            <div className="login-popup-condition">
              <input type="checkbox" required />
              <p>By continuing, i agree to the terms of use & privacy policy.</p>
            </div>
            {currState === "Login"
              ? <p>Create a new account? <span onClick={() => setCurrState("Sign Up")} >Click here</span></p>
              : <p> Already have an account? <span onClick={() => setCurrState("Login")}>Login here</span></p>
            }
          </>
        )}
      </form>
    </div>
  )
}

export default LoginPopup
