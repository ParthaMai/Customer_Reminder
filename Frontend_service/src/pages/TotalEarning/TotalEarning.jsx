import React, { useEffect, useState, useContext } from "react";
import "./TotalEarning.css";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const TotalEarning = () => {
  const { url, token } = useContext(StoreContext);
  const [earnings, setEarnings] = useState({});

  const fetchEarnings = async () => {
    try {
      const res = await axios.get(`${url}/api/totalEarning/monthly`, {
        headers: { token },
      });
      if (res.data.success) setEarnings(res.data.data);
    } catch (err) {
      console.error("Error fetching earnings:", err);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchEarnings();
  }, [token]);

  const currentMonth = new Date().getMonth(); // 0-11

  return (
    <div className="earn-container">
      <h2 className="earn-title">💰 Total Earnings Per Month</h2>

      <div className="earn-grid">
        {months.map((month, index) => (
          <div
            key={month}
            className={`earn-card ${index === currentMonth ? "current-month" : ""}`}
          >
            <p className="month">{month}</p>
            <h3>₹ {earnings[month] || 0}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TotalEarning;