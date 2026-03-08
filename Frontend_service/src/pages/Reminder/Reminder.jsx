import React, { useEffect, useState } from 'react'
import "./Reminder.css"
import { assets } from '../../assets/assets';
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'; 
import * as XLSX from "xlsx";
import { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';

const Reminder = () => {

  const { url, token, reminder_list, page, totalPages, fetchReminderList } = useContext(StoreContext);
  const [list, setList] = useState([]);
  // const [page, setPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const handleUpdate = (id) => {
    navigate(`/reminder/${id}`);
  };

 

  const handleDownloadExcel = () => {
    if (!reminder_list || reminder_list.length === 0) {
      alert("No data to export");
      return;
    }

    // Prepare data (only name & mobile)
    const excelData = list.map((item, index) => ({
      SL: index + 1,
      Name: item.name,
      Mobile: item.mobile1
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");

    // Download file
    XLSX.writeFile(workbook, "Reminder_Customers.xlsx");
  };



  // fix it in schedule way
  useEffect(() => {
    const cleanupAndFetch = async () => {
      try{
      //Delete old reminders
      await axios.post(`${url}/api/service-remind-list/cleanup-old`, {}, {headers: { token }});

      // await fetchList(1);

      }catch(error){
        console.log(error);
        toast.error("server Error")
      }
    };

    cleanupAndFetch();
  }, []);



  // const fetchList = async (pageNumber = 1) => {
  //   try {
  //     const response = await axios.get(`${url}/api/reminder-list/remind-list`, {
  //       params: {
  //         page: pageNumber,
  //         limit: 10,
  //       }
  //     });

  //     if (response.data.success) {
  //       setList(response.data.data);
  //       setPage(response.data.pagination.currentPage);
  //       setTotalPages(response.data.pagination.totalPages);
  //     } else {
  //       toast.error("Error");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Server error");
  //   }
  // };


  // useEffect(() => {
  //   fetchList(1)
  // }, [])

  useEffect(() => {

    async function loadData() {

      if (!reminder_list || reminder_list.length === 0) {
        await fetchReminderList(1)
      }

    }

    loadData()

  }, [])


  return (
    <div className='reminder-list add flex-col'>
      <div className="header-row">
        <p>Reminder Customers</p>
        <div className="download-box" onClick={handleDownloadExcel}>
          <b>Download Excel</b>
          <img src={assets.download_icon} alt="download" className="download_icon" />
        </div>
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
        <div className="reminder-pagination">
          <button
            disabled={page === 1}
            onClick={() => fetchReminderList(page - 1)}
          >
            Prev
          </button>

          <span>{page} / {totalPages}</span>

          <button
            disabled={page === totalPages}
            onClick={() => fetchReminderList(page + 1)}
          >
            Next
          </button>
        </div>

        {reminder_list.map((item, index) => {
          return (
            <div key={index} className="reminder-list-table-format">
              <p>{new Date(item.create).toISOString().split("T")[0]}</p>
              <img src={assets.user_icon} alt="" />
              <p>{item.name}</p>
              <img src={assets.user_details} alt="edit" className="user_details" onClick={() => handleUpdate(item._id)} />
              <p>{new Date(item.serviceDate).toISOString().split("T")[0]}</p>
              <p>{item.mobile1}</p>
              <p>₹{item.totalPrice}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Reminder
