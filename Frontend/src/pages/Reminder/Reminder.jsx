import React, { useEffect, useState } from 'react'
import "./Reminder.css"
import { assets } from '../../assets/assets';
import axios from 'axios'
import { toast } from 'react-toastify'

const Reminder = ({url}) => {

    const [list, setList] = useState([]);




      const fetchList = async () => {
        const response = await axios.get(`${url}/api/reminder-list/remind-list`);
        if(response.data.success) {
          setList(response.data.data);
        }
        else{
          toast.error("Error");
        }
      }
    
      useEffect(()=>{
        fetchList()
      },[])
    



    return (
        <div className='reminder-list add flex-col'>
            <div className="header-row">
                <p>Reminder Customers</p>
                <div className="download-box">
                    <b>Download Excel</b>
                    <img src={assets.download_icon} alt="download" className="download_icon" />
                </div>
            </div>
            <div className="reminder-list-table">
                <div className="reminder-list-table-format title">
                    <b>Remove</b>
                    <b>Image</b>
                    <b>Name</b>
                    <b>Show-Details</b>
                    <b>Form No.</b>
                    <b>Purchase Date</b>
                    <b>Mobile No.</b>
                    <b>Price</b>
                    <b>Failed Emis</b>
                </div>
                {list.map((item, index) => {
                    return (
                        <div key={index} className="reminder-list-table-format">
                            <input type="checkbox" />
                            <img src={`${url}/image/` + item.image} alt="" />
                            <p>{item.name}</p>
                            <img src={assets.user_details} alt="edit" className="user_details" onClick={() => handleUpdate(item._id)} />
                            <p>{item.formNo}</p>
                            <p>{new Date(item.purchaseDate).toISOString().split("T")[0]}</p>
                            <p>{item.mobile1}</p>
                            <p>₹{item.price}</p>
                            <p>{item.failedEmi}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Reminder
