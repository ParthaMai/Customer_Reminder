import React, { useContext, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, NavLink } from 'react-router-dom'

const navbar = () => {


  return (
    <div className='navbar'>
      <Link to='/'><img src={assets.logo} alt="" className='logo' /></Link>
      <ul className="navbar-menu">
        <Link to='/'>Home</Link>
        <NavLink to='/reminder'>Reminder</NavLink>
      </ul>
    </div>
  )
}

export default navbar
