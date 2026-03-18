import React, { useEffect, useState, useContext } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import "./ServiceHistory.css";

const ServiceHistory = () => {
  const { url, token } = useContext(StoreContext);

  const [date, setDate] = useState(new Date());
  const [history, setHistory] = useState([]);

  const fetchHistory = async (selectedDate) => {
    try {
      const formattedDate = selectedDate.toISOString();

      const res = await axios.get( `${url}/api/todayEarn/service-history?date=${formattedDate}`,
        { headers: { token } }
      );

      if (res.data.success) {
        setHistory(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchHistory(date);
  }, [date,token]);

  return (
    <div className="history-page">

     <h2 class="history-title">
    📅 Service History
    </h2>

      {/* Calendar */}
      <div className="calendar-box">
        <Calendar onChange={setDate} value={date} />
      </div>

      {/* History List */}
      <div className="history-list">
        {history.length === 0 ? (
          <p>No services found for this date</p>
        ) : (
          history.map((item, index) => (
            <div key={index} className="history-card">

              <div className="top">
                <h3>{item.name}</h3>
                <span>{item.mobile1}</span>
                <span>₹{item.totalPrice}</span>
              </div>

              <p>
                <strong>Completed:</strong>{" "}
                {new Date(item.serviceDate).toLocaleDateString()}
                </p>

              <div className="services">
                {item.services.map((s, i) => (
                  <div key={i} className="service-row">
                    <span>{s.description}</span>
                    <span>₹{s.price}</span>
                  </div>
                ))}
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default ServiceHistory;