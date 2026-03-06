import React from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'


const Sidebar = () => {
 return (
    <div className="dashboard">

      {/* Row 1 */}
      <div className="row">
        <NavLink to="/add-customer" className="box">
        <img src={assets.person_add_icon} alt="" />
          Add Customer
        </NavLink>

        <NavLink to="/list_Service_Customer" className="box">
        <img src={assets.customer_list} alt="" />
          Customer List
        </NavLink>

        <NavLink to="/pending-calls" className="box">
        <img src={assets.pending_icon} alt="" />
          Pending Calls
        </NavLink>
      </div>

      {/* Row 2 */}
      <div className="row">
        <NavLink to="/today-earn" className="box">
        <img src={assets.Today_Earn} alt="" />
          Today Earn
        </NavLink>

        <NavLink to="/service-history" className="box">
        <img src={assets.history_icon} alt="" />
          Service History
        </NavLink>

        <div className="box empty"></div>
      </div>

      {/* Actions Section */}
      <h2 className="section-title">Actions</h2>

      {/* Actions Row 1 */}
      <div className="row">
        <NavLink to="/complete-service" className="box action-box">
        <img src={assets.complete_service} alt="" />
          Complete Service
        </NavLink>

        <NavLink to="/outstanding-customers" className="box action-box">
        <img src={assets.reject_customer} alt="" />
          Outstanding Customers
        </NavLink>

        <div className="box empty"></div>
      </div>

      {/* Actions Row 2 */}
      <div className="row">
        <NavLink to="/work-complete" className="box action-box">
        <img src={assets.work_complete} alt="" />
          Work Complete
        </NavLink>

        <NavLink to="/total-earning" className="box action-box">
        <img src={assets.wallet_icon} alt="" />
          Total Earning
        </NavLink>

        <NavLink to="/contact-us" className="box action-box">
        <img src={assets.contact_icon} alt="" />
          Contact Us
        </NavLink>
      </div>

      {/* Task Section */}
      <h2 className="section-title">Tasks</h2>

      {/* Actions Row 1 */}
      <div className="row">
        <NavLink to="/complete-service" className="box">
        <img src={assets.premium_customer} alt="" />
          Premium Customers
        </NavLink>

        <NavLink to="/outstanding-customers" className="box">
        <img src={assets.sell_icon} alt="" />
          Discounted Customers
        </NavLink>

        <div className="box empty"></div>
        <div className="box empty"></div>
      </div>
      <div className="row">
        <div className="box empty"></div>
      </div>

    </div>
  );
}

export default Sidebar
