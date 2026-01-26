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
                    <p>Add EMI Customer</p>
                </NavLink>
                <NavLink to='/cash' className="sidebar-option">
                    <img src={assets.add_icon} alt="" />
                    <p>Add Cash Customer</p>
                </NavLink>
                <NavLink to='/list' className="sidebar-option">
                    <img src={assets.list_icon} alt="" />
                    <p>List of Customer</p>
                </NavLink>
            </div>
        </div>
    )
}

export default Sidebar
