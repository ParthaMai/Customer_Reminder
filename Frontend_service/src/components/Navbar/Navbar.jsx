import React, { useContext, useEffect } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, NavLink } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import { StoreContext } from '../../context/StoreContext'

const navbar = ({setShowLogin}) => {

  const { token,setToken, reminderCount } = useContext(StoreContext);
  const navigate = useNavigate();

    // 🔥 AUTO REDIRECT IF NOT LOGGED IN
useEffect(() => {
  const timer = setTimeout(() => {
    if (!token) {
      navigate("/landing-page");
    }else{
      navigate("/")
    }
  }, 300); // wait 0.9s

  return () => clearTimeout(timer);
}, [token]);
    //For logout
    const logout = () =>{
      localStorage.removeItem("token");
      setToken("");
      navigate("/");
    }

  return (
    <div className='navbar'>
      <Link to='/'><img src={assets.logo} alt="" className='logo' /></Link>
      <ul className="navbar-menu">
        <Link to='/'>Home</Link>
          {/* 🔥 Reminder with badge */}
        <NavLink to='/reminder' className="reminder-link">
          Reminder
          {reminderCount > 0 && (
            <span className="badge-reminder">{reminderCount}</span>
          )}
        </NavLink>
        {!token?<button className='signin-btn' onClick={()=>setShowLogin(true)}>Login</button>
        :<div className='navbar-profile'>
          <img src={assets.profile_icon} alt="" />
          <ul className='nav-profile-dropdown'>
            <li onClick={logout}><img src={assets.logout_icon} alt="" /><p>Logout</p> </li>
          </ul>
        </div>}
      </ul>
    </div>
  )
}

export default navbar
