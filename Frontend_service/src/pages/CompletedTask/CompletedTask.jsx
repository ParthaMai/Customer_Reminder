import React, { useEffect, useState, useContext } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import "./CompletedTask.css";
import { assets } from "../../assets/assets";
import Loader1 from "../../components/Loader/Loader1";
import {useNavigate } from "react-router-dom";

const CompletedTask = () => {
  const { url, token } = useContext(StoreContext);

  const [date, setDate] = useState(new Date());
  const [completedList, setCompletedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const navigate = useNavigate();

  const fetchCompletedTasks = async (selectedDate) => {
    try {
      const formattedDate = selectedDate.toISOString();

      const res = await axios.get(`${url}/api/service_Customer/tasks-completed?date=${formattedDate}`,{ headers: { token } });

      if (res.data.success) {
        setCompletedList(res.data.data);
        setTotalCount(res.data.totalCount);
      }
    } catch (err) {
      console.error(err);
    }
  };
    const handleUpdate = (id) => {
        navigate(`/list_Customer/FullList_Customer/${id}`);
    };


  useEffect(() => {
    if (!token) return;

    const loadData = async () => {
      setLoading(true);
      await fetchCompletedTasks(date);
      setLoading(false);
    };

    loadData();
  }, [date, token]);

  return (
    <div className="completed-page">

      {/* Title */}
      <h2 className="history-title">📅 Completed Tasks</h2>

          {/* 🔥 Count (ADD HERE) */}
    {!loading && (
      <p className="task-count">
        {totalCount || 0} tasks completed
        </p>
    )}

      {/* Calendar */}
      <div className="calendar-box">
        <Calendar onChange={setDate} value={date} />
      </div>

      {/* List */}
      <div className="list-cash-table">

        {loading ? (
          <Loader1 />
        ) : completedList.length === 0 ? (
          <div className="no-data-container">
            <img src={assets.no_data_icon} alt="No Data" className="no-data-img" />
            <p className="no-data">No completed tasks for this date</p>
          </div>
        ) : (
          completedList.map((item, index) => (
            <div key={index} className="list-cash-table-format" onClick={() => handleUpdate(item._id)}>

              {/* LEFT */}
              <div className="list-left">
                <img src={assets.user_icon} alt="user" />

                <div className="list-info">
                  <div className="list-top">
                    <p className="list-name">{item.name}</p>
                  </div>

                  <div className="list-bottom">
                    <span>{item.mobile1}</span>
                  </div>
                </div>
              </div>

            </div>
          ))
        )}

      </div>
    </div>
  );
};

export default CompletedTask;