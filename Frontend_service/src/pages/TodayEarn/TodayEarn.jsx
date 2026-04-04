import React, { useEffect, useState, useContext } from "react";
import "./TodayEarn.css";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";

const TodayEarn = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState({});

  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

  const fetchData = async () => {
    const res = await axios.get(`${url}/api/todayEarn/weekly`, {
      headers: { token }
    });
    if (res.data.success) {
      setData(res.data.data);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchData();
  }, [token]);

  const todayIndex = new Date().getDay();

  return (
    <div className="earn-container">

      <h2 className="earn-title">💰 This Week Sales</h2>

      <div className="earn-grid">
        {days.map((day, index) => (
          <div
            key={day}
            className={`earn-card ${index === todayIndex ? "today" : ""}`}
          >
            <p className="day">{day}</p>
            <h3>₹ {data[day] || 0}</h3>
          </div>
        ))}
      </div>

    </div>
  );
};

export default TodayEarn;