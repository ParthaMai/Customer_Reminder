import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'
import { toast } from 'react-toastify'

const Footer = () => {

    const handleDeniedClick = (e) => {
  e.preventDefault(); // 🚫 stop navigation
  toast.info("This feature is available in the premium plan. Please upgrade to continue.");
};
    return (
        <footer className="footer">
            <NavLink to="/" className="footer-item">
                <img src={assets.Home_icon} alt="" />
                <span className="footer-label">Home</span>
            </NavLink>

            <NavLink to="/subscription" className="footer-item">
                <img src={assets.subscription_icon} alt="" />
                <span className="footer-label">Subscription</span>
            </NavLink>

            <NavLink to="/report" className="footer-item" onClick={(e) => handleDeniedClick(e)}>
                <img src={assets.report_icon} alt="" />
                <span className="footer-label">Report</span>
            </NavLink>

            <NavLink className="footer-item">
                <img src={assets.about_icon} alt="" />
                <span className="footer-label">About Us</span>
            </NavLink>
        </footer>
    );
};

export default Footer
