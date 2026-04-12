import React, { useEffect, useState } from 'react'
import './Sidebars.css'
// import './Sidebar.css'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const [activeBox, setActiveBox] = useState("");
  const [activeSection, setActiveSection] = useState(() => {
  return localStorage.getItem("activeSection") || "calls";
});

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
  useEffect(() => {
  localStorage.setItem("activeSection", activeSection);
}, [activeSection]);

  // ❌ Premium blocked
  const handleDeniedClick = (e) => {
    e.preventDefault();
    toast.info("This feature is available in the premium plan. Please upgrade to continue.");
  };

  return (
    <div className="dashboard">

      {/* Row 1 */}
      <div className="rows">

        <div
          className={`boxes ${activeSection === "calls" ? "active" : ""}`}
          onClick={() => setActiveSection("calls")}
        >
          <div className="icon-wrapper">
            <img src={assets.phone_icon} alt="Calls" />
          </div>
          <p>Calls</p>
        </div>

        <div
          className={`boxes ${activeSection === "customer" ? "active" : ""}`}
          onClick={() => setActiveSection("customer")}
        >
          <div className="icon-wrapper">
            <img src={assets.customer_img} alt="Customer" />
          </div>
          <p>Customer</p>
        </div>

        <div
          className={`boxes ${activeSection === "sales" ? "active" : ""}`}
          onClick={() => setActiveSection("sales")}
        >
          <div className="icon-wrapper">
            <img src={assets.sales_img} alt="Sales" />
          </div>
          <p>Sales</p>
        </div>

        <div
          className={`boxes ${activeSection === "service" ? "active" : ""}`}
          onClick={() => setActiveSection("service")}
        >
          <div className="icon-wrapper">
            <img src={assets.service_icon} alt="Service" />
          </div>
          <p>Service</p>
        </div>

      </div>


      {activeSection === "customer" && (
        <>
          <h2 className="section-title">Customer</h2>
          {/* Row 1 */}
          <div className="row">
            <div className="box" onClick={() => go("/add-customer")}>
              <img className="card-img" src={assets.addCustomer_icon} alt="" />
              <div className="card-text">
                <h4>Add Customer</h4>
                <p>Build Your Client Base</p>
              </div>
            </div>

            <div className="box-right" onClick={() => go("/list_Service_Customer")}>
              <img className="card-right-img" src={assets.customer_list} alt="" />
              <div className="card-right-text">
                <h4>Customer List</h4>
                <p>View and manage Your Customers </p>
              </div>
            </div>
            {/* <div className="box-right" onClick={() => go("/landing-page")}>
              <img className="card-right-img" src={assets.premium_customer} alt="" />
              <h4>Service Frequently: Annual</h4>
              <div className="card-premium-text">
                <p>Customers who receive service twice every year</p>
              </div>
            </div> */}
          </div>

          {/* Row 2 */}
          <div className="row">

            <div className="box" onClick={() => go("/landing-page")}>
              <img className="card-right-img" src={assets.sell_icon} alt="" />
              <div className="card-right-text">
                <h4>Discount Clients</h4>
                <p>Clients with special pricing benefits</p>
              </div>
            </div>

            <div className="box-right empty"></div>
          </div>
        </>
      )}

      {activeSection === "calls" && (
        <>
          {/* Actions Section */}
          <h2 className="section-title">Calls</h2>

          {/* Actions Row 1 */}
          <div className="row">

            <div className="box" onClick={() => go("/list_Pending_Calls")}>
              <img className="card-img" src={assets.pending_icon} alt="" />
              <div className="card-text">
                <h4>Pending Calls</h4>
                <p>Follow up pending calls</p>
              </div>
            </div>
            <div className="box-right" onClick={() => go("/reminder")}>
              <img className="card2-row-img" src={assets.reminder_icon} alt="" />
              <div className="card-text">
                <h4>Reminder Calls</h4>
                <p>Follow up reminder list</p>
              </div>
            </div>
          </div>

          {/* Actions Row 2 */}
          <div className="row">

            <div className="box" onClick={() => go("/contact-us")}>
              <img className="card2-row-img" src={assets.support_icon} alt="" />
              <div className="card-text">
                <h4>Contact Us</h4>
                <p>Connect with support team</p>
              </div>
            </div>
            <div className="box empty"></div>
            <div className="box-right" onClick={() => go("/completed-tasks")}>
            <img className="card-right-img" src={assets.task_icon} alt="" />
            <div className="card-text">
              <h4>Task History</h4>
              <p>View all completed tasks by date</p>
            </div>
          </div>
          </div>
        </>
      )}

      {activeSection === "sales" && (
        <>
          {/* Task Section */}
          <h2 className="section-title">Sales</h2>

          <div className="row">
            <div className="box" onClick={() => go("/add-sale")}>
              <img className="card-right-img" src={assets.invoice_icon} alt="" />
              <div className="card-text">
                <h4>Add Sale</h4>
                <p>Create bills with automatic stock updates</p>
              </div>
            </div>
            <div className="box" onClick={() => go("/today-earn")}>
              <img className="card-right-img" src={assets.coin_icon} alt="" />
              <div className="card-text">
                <h4>Today Sale</h4>
                <p>Track daily and weekly sales</p>
              </div>
            </div>

            <div className="box" onClick={() => go("/total-earning")}>
              <img className="card-right-img" src={assets.Coin_Bag_icon} alt="" />
              <div className="card-text">
                <h4>Total Sales</h4>
                <p>Track overall monthly sales</p>
              </div>
            </div>

          </div>
        </>
      )}


      {activeSection === "service" && (
        <>
          <h2 className="section-title">Service</h2>

          <div className="row">
            <div className="box" onClick={() => go("/appointment")}>
              <img className='card-img' src={assets.appointment_icon} alt="" />
              <div className="card-text">
                <h4>Today's Appointments</h4>
                <p>Manage today’s scheduled service visits</p>
              </div>
            </div>
            <div className="box-right" onClick={() => go("/complete-service")}>
              <img className="card2-row-img" src={assets.complete_service} alt="" />
              <div className="card-text">
                <h4>Complete Service</h4>
                <p>View all completed service records</p>
              </div>
            </div>
            <div className="box" onClick={() => go("/booking-appointment")}>
              <img className='card-right-img' src={assets.Book_appointment_icon} alt="" />
              <div className="card-text">
                <h4>Book Appointment</h4>
                 <p>Schedule new service appointments</p>
              </div>
            </div>
            <div className="box" onClick={() => go("/service-history")}>
              <img className='card2-row-img' src={assets.history_icon} alt="" />
              <div className="card-text">
                <h4>Service History</h4>
                <p>Check customer service history</p>
              </div>
            </div>


            <div className="box empty"></div>
          </div>
        </>
      )}

    </div>

  );
}

export default Sidebar;