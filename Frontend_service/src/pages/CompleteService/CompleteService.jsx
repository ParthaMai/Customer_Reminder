import React, { useEffect, useState, useContext } from "react";
import "./CompleteService.css";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const MonthlyServices = () => {
  const { url, token } = useContext(StoreContext);
  const [services, setServices] = useState({}); // total services per month

  const fetchData = async () => {
    try {
      const res = await axios.get(`${url}/api/totalEarning/monthly-service`, {
        headers: { token },
      });
      if (res.data.success) {
        setServices(res.data?.data?.services || {});// only keep services
      }
    } catch (err) {
      console.error("Error fetching monthly services:", err);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchData();
  }, [token]);

  const currentMonth = new Date().getMonth();

  return (
    <div className="monthly-services-container">
      <h2 className="monthly-services-title">📊 Monthly Services Completed</h2>

      <div className="monthly-services-grid">
        {months.map((month, index) => (
          <div
            key={month}
            className={`monthly-services-card ${index === currentMonth ? "current-month" : ""}`}
          >
            <p className="monthly-services-month">{month}</p>
            <p className="monthly-services-count">
              {services[month] || 0} {services[month] === 1 ? "service" : "services"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthlyServices;