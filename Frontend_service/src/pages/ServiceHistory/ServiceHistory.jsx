import React, { useEffect, useState, useContext } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import "./ServiceHistory.css";
import { assets } from "../../assets/assets";
import Loader1 from "../../components/Loader/Loader1";

const ServiceHistory = () => {
  const { url, token } = useContext(StoreContext);
  // For loading 
  const [loading, setLoading] = useState(true);

  const [date, setDate] = useState(new Date());
  const [history, setHistory] = useState([]);

  const fetchHistory = async (selectedDate) => {
    try {
      const formattedDate = selectedDate.toISOString();

      const res = await axios.get(`${url}/api/todayEarn/service-history?date=${formattedDate}`,
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
    const loadData = async () => {
      setLoading(true);
      await fetchHistory(date);
      setLoading(false);
    };

    loadData();
  }, [date, token]);

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
        {loading ? (
          <Loader1 />
        ) : history.length === 0 ? (
          <div className="no-service-container">
            <img src={assets.no_data_icon} alt="No Data" className="no-data-img" />
            <p className="no-data">No services found for this date</p>
          </div>
        ) : (
          history.map((item, index) => (
            <div key={index} className="history-card">

              <div className="top">
                <h3>{item.name} - 
                   <span className="category-badge">{item.serviceCategory}</span>
                </h3>
                <span>{item.mobile1}</span>
              </div>

              {item.serviceHistory.map((entry, i) => (
                <div key={i} className="inner-history">

                  <p>
                    <strong>Completed:</strong>{" "}
                    {new Date(entry.serviceDate).toLocaleDateString()}
                  </p>

                  <span className="price-badge">Total Price - ₹{entry.totalPrice}</span>

                  <div className="services">
                    {entry.services.map((s, j) => (
                      <div key={j} className="service-row">
                        <span>{s.description}</span>
                        <span>₹{s.price}</span>
                      </div>
                    ))}
                  </div>

                </div>
              ))}

            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default ServiceHistory;