import React from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Smart navigation
  const go = (path) => {

    // 🚫 prevent same page navigation
    if (location.pathname === path) return;

    if (location.pathname === "/") {
      // From HOME → keep history
      navigate(path);
    } else {
      // Inside pages → replace
      navigate(path, { replace: true });
    }
  };

  // ❌ Premium blocked
  const handleDeniedClick = (e) => {
    e.preventDefault();
    toast.info("This feature is available in the premium plan. Please upgrade to continue.");
  };

  return (
    <div className="dashboard">

      {/* Row 1 */}
      <div className="row">
        <div className="box" onClick={() => go("/add-customer")}>
          <img src={assets.person_add_icon} alt="" />
          Add Customer
        </div>

        <div className="box" onClick={() => go("/list_Service_Customer")}>
          <img src={assets.customer_list} alt="" />
          Customer List
        </div>

        <div className="box" onClick={() => go("/list_Pending_Calls")}>
          <img src={assets.pending_icon} alt="" />
          Pending Calls
        </div>
      </div>

      {/* Row 2 */}
      <div className="row">
        <div className="box" onClick={() => go("/today-earn")}>
          <img src={assets.Today_Earn} alt="" />
          Today Sale
        </div>

        <div className="box" onClick={() => go("/service-history")}>
          <img src={assets.history_icon} alt="" />
          Service History
        </div>

        <div className="box empty"></div>
      </div>

      {/* Actions Section */}
      <h2 className="section-title">Actions</h2>

      {/* Actions Row 1 */}
      <div className="row">
        <div className="box action-box" onClick={() => go("/complete-service")}>
          <img src={assets.complete_service} alt="" />
          Complete Service
        </div>

        <div className="box action-box" onClick={handleDeniedClick}>
          <img src={assets.reject_customer} alt="" />
          Outstanding Customers
        </div>
        <div className="box action-box"  onClick={() => go("/add-sale")}>
          <img src={assets.invoice_icon} alt="" />
          Add Sale
        </div>
      </div>

      {/* Actions Row 2 */}
      <div className="row">
        <div className="box action-box" onClick={() => go("/appointment")}>
          <img src={assets.appointment_icon} alt="" />
          Today's Appointments
        </div>

        <div className="box action-box" onClick={() => go("/total-earning")}>
          <img src={assets.wallet_icon} alt="" />
          Total Sales
        </div>

        <div className="box action-box" onClick={() => go("/contact-us")}>
          <img src={assets.contact_icon} alt="" />
          Contact Us
        </div>
      </div>

      {/* Task Section */}
      <h2 className="section-title">Tasks</h2>

      <div className="row">
        <div className="box" onClick={() => go("/landing-page")}>
          <img src={assets.premium_customer} alt="" />
          Premium Customers
        </div>

        <div className="box" onClick={handleDeniedClick}>
          <img src={assets.sell_icon} alt="" />
          Discounted Customers
        </div>

        <div className="box" onClick={() => go("/booking-appointment")}>
          <img src={assets.appointment_icon} alt="" />
          Book Appointment
        </div>

        <div className="box empty"></div>
      </div>

      <div className="row">
        <div className="box empty"></div>
      </div>

    </div>
  );
}

export default Sidebar;