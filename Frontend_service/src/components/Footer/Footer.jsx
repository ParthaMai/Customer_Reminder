import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'

const Footer = () => {
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

            <NavLink to="/report" className="footer-item">
                <img src={assets.report_icon} alt="" />
                <span className="footer-label">Report</span>
            </NavLink>

            <NavLink to="/about" className="footer-item">
                <img src={assets.about_icon} alt="" />
                <span className="footer-label">About Us</span>
            </NavLink>
        </footer>
    );
};

export default Footer
