import React, { useContext, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'

const navbar = () => {


  return (
    <div className='navbar'>
      <img src={assets.logo} alt="" className='logo' />
      <ul className="navbar-menu">
        <Link to='/'><a>Home</a></Link>
        <a>Reminder</a>
      </ul>
    </div>
  )
}

export default navbar
