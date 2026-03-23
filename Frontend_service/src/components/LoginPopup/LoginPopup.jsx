import React, { use, useContext, useEffect } from 'react'
import './LoginPopup.css'
import { useState } from 'react'
import axios from 'axios'
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';

const LoginPopup = ({ setShowLogin }) => {

  const { url, setToken } = useContext(StoreContext);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); 

  const [currState, setCurrState] = useState("Login");

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    storeName: ""
  })

    const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prev => ({ ...prev, [name]: value }));
  };
  const onlogin = async (event) => {
    event.preventDefault();

    setLoading(true);
    let newUrl = url;
    if (currState === "Login") {
      newUrl += '/api/user/login';
    }
    else {
      newUrl += "/api/user/register";
    }

    try {
      const response = await axios.post(newUrl, data);

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        setShowLogin(false);
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
          {currState === "Login" ? <></> : <>
          <input name="name" onChange={onChangeHandler} value={data.name} type="text" placeholder='Your name' required />
          <input name="mobile" onChange={onChangeHandler} value={data.mobile} type="tel" maxLength="10" placeholder='Mobile number' required/>
          <input  name="storeName" onChange={onChangeHandler} value={data.storeName}type="text" placeholder='Store name' />
          </>
          }
          <input name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder='Your email' required />
          <div className="password-wrapper">
            <input  className="password-input" name="password"  onChange={onChangeHandler}   value={data.password}  type={showPassword ? "text" : "password"} placeholder="Password" required />

            <img
              src={showPassword ? assets.visible_off : assets.visible_icon}
              alt=""
              className="password-icon"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
        </div>
        <button type='submit' className='login-btn' disabled={loading}>
          {loading ? <div className="loader"></div> : (currState === "Sign Up" ? "Create account" : "Login")}
        </button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, i agree to the terms of use & privacy policy.</p>
        </div>
        {currState === "Login"
          ? <p>Create a new account? <span onClick={() => setCurrState("Sign Up")} >Click here</span></p>
          : <p>Already have an account? <span onClick={() => setCurrState("Login")}>Login here</span></p>
        }
      </form>
    </div>
  )
}

export default LoginPopup
