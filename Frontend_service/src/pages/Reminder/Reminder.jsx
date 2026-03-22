import React, { useEffect, useState } from 'react'
import "./Reminder.css"
import { assets } from '../../assets/assets';
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';

const Reminder = () => {

  const { url, token, reminderList, reminderPage, setReminderPage, reminderTotalPages, reminderCategory, setReminderCategory, fetchReminderList } = useContext(StoreContext);

  const navigate = useNavigate();

  const handleUpdate = (id) => {
    navigate(`/reminder/Fullist/${id}`);
  };




  // fix it in schedule way
  useEffect(() => {
    if (!token) return;
    const cleanupAndFetch = async () => {
      try {
        //Delete old reminders
        await axios.post(`${url}/api/service-remind-list/cleanup-old`, {}, { headers: { token } });

        // await fetchList(1);

      } catch (error) {
        console.log(error);
        toast.error("server Error")
      }
    };

    cleanupAndFetch();
  }, [token]);

      // 🔝 Scroll to top when page loads
      useEffect(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
      }, []);
  

  useEffect(() => {
    if (!token) return;
    fetchReminderList(reminderPage, reminderCategory);
  }, [token, reminderCategory, reminderPage]);

  return (
    <div className='reminder-list add flex-col'>
      <div className="header-row">
        <p>Reminder Customers</p>
      </div>
      {/* ✅ CATEGORY FILTER */}
      <div className="service-type-selector">
        {["RO", "Chimney", "AC"].map(type => (
          <button
            key={type}
            className={reminderCategory === type ? "active" : ""}
            onClick={() =>{
               setReminderCategory(type)
               setReminderPage(1);
              }}
          >
            {type}
          </button>
        ))}
      </div>
      <div className="reminder-list-table">
        <div className="reminder-list-table-format title">
          <b>Remind Date</b>
          <b>Image</b>
          <b>Name</b>
          <b>Show-Details</b>
          <b>Service Date</b>
          <b>Mobile No.</b>
          <b>Service Cost</b>
        </div>
        {/* ✅ PAGINATION */}
        <div className="reminder-pagination">
          <button
            disabled={reminderPage === 1}
            onClick={() => fetchReminderList(reminderPage - 1)}
          >
            Prev
          </button>

          <span>{reminderPage} / {reminderTotalPages}</span>

          <button
            disabled={reminderPage === reminderTotalPages}
            onClick={() => fetchReminderList(reminderPage + 1)}
          >
            Next
          </button>
        </div>
        {reminderList.length === 0 ? (
          <p className="no-data">
            No reminders for {reminderCategory}
          </p>
        ) : reminderList.map((item) => (
          <div key={item._id} className="reminder-list-table-format">

            <p>
              {item.create
                ? new Date(item.create).toISOString().split("T")[0]
                : "-"}
            </p>

            <img src={assets.user_icon} alt="customer" />

            <p>{item.name}</p>

            <img
              src={assets.user_details}
              alt="details"
              className="user_details"
              onClick={() => handleUpdate(item._id)}
            />

            <p>
              {item.serviceDate
                ? new Date(item.serviceDate).toISOString().split("T")[0]
                : "-"}
            </p>

            <p>{item.mobile1}</p>

            <p>₹{item.totalPrice}</p>

          </div>
        ))}
      </div>
    </div>
  )
}

export default Reminder
