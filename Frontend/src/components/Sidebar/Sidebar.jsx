import React from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'


const Sidebar = () => {
    return (
        <div className='sidebar'>
            <div className="sidebar-options">
                <NavLink to='/emi' className="sidebar-option">
                    <img src={assets.add_icon} alt="" />
                    <p>Add EMI Customers</p>
                </NavLink>
                <NavLink to='/cash' className="sidebar-option">
                    <img src={assets.add_icon} alt="" />
                    <p>Add Cash Customers</p>
                </NavLink>
                <NavLink to='/list_EMI' className="sidebar-option">
                    <img src={assets.list_icon} alt="" />
                    <p>List of EMI Customers</p>
                </NavLink>
                <NavLink to='/list_Cash' className="sidebar-option">
                    <img src={assets.list_icon} alt="" />
                    <p>List of Cash Customers</p>
                </NavLink>
                <NavLink to='/dob_reminder' className="sidebar-option">
                    <img src={assets.birthday_icon} alt="" />
                    <p>Birthday Customers</p>
                </NavLink>
            </div>
        </div>
    )
}

export default Sidebar
