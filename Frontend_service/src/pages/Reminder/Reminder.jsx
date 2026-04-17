import React, { useEffect, useState } from 'react'
import "./Reminder.css"
import { assets } from '../../assets/assets';
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import Loader1 from '../../components/Loader/Loader1';

const Reminder = () => {

  const { url, token, reminderList, reminderPage, setReminderPage, reminderTotalPages, reminderCategory, setReminderCategory, fetchReminderList } = useContext(StoreContext);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const handleUpdate = (id) => {
    navigate(`/reminder/Fullist/${id}`);
  };


  // 🔝 Scroll to top when page loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);


  useEffect(() => {
    if (!token) return;
     if (!navigator.onLine) {
      toast.error("No Internet Connection");
      return;
    }
    const loadData = async () => {
      setLoading(true);
      await fetchReminderList(reminderPage, reminderCategory);
      setLoading(false)
    };
    loadData();
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
            onClick={() => {
              setReminderCategory(type)
              setReminderPage(1);
            }}
          >
            {type}
          </button>
        ))}
      </div>
      <div className="reminder-list-table">
        {/* ✅ PAGINATION */}
        {reminderTotalPages > 1 && (
          <div className="reminder-pagination">
            <button
              disabled={reminderPage === 1}
              onClick={() => {
                const newPage = reminderPage - 1;
                setReminderPage(newPage)
              }}
            >
              Prev
            </button>

            <span>{reminderPage} / {reminderTotalPages}</span>

            <button
              disabled={reminderPage === reminderTotalPages}
              onClick={() => {
                const newPage = reminderPage + 1;
                setReminderPage(newPage)
              }}
            >
              Next
            </button>
          </div>
        )}
        {loading ? (
          <Loader1 />
        ) : reminderList.length === 0 ? (
          <div className="no-data-container">
            <img src={assets.no_data_icon} alt="No Data" className="no-data-img" />
            <p className="no-data">No Reminders for {reminderCategory}</p>
          </div>
        ) : reminderList.map((item) => (
          <div key={item._id} className="list-cash-table-format" onClick={() => handleUpdate(item._id)} // ✅ HERE
            style={{ cursor: "pointer" }}>

            <div className="list-left">
              <img src={assets.user_icon} alt="user" />

              <div className="list-info">
                {/* TOP ROW */}
                <div className="list-top">
                  <p className="list-name">{item.name}</p>
                </div>

                {/* BOTTOM ROW */}
                <div className="list-bottom">
                  <span>{item.mobile1}</span>
                </div>
              </div>
            </div>


            <div className="list-right">
              <div className="list-price">
                ₹{item.totalPrice}
                <span>Service Cost</span>
              </div>
            </div>
            <div className="list-remind">
              <p>
                {item.create
                  ? new Date(item.create).toISOString().split("T")[0]
                  : "-"}
              </p>
              <span> Remind Date</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Reminder
