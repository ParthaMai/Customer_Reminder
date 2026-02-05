import React from 'react'
import './Dob_reminder.css'
import { assets } from '../../assets/assets'
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';

const Dob_reminder = ({ url }) => {

  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  const navigate = useNavigate();
  const handleUpdate = (id) => {
    navigate(`/dob/dob_wish/${id}`);
  };

    // fix it in schedule way
    useEffect(() => {
      const cleanupAndFetch = async () => {
        //Delete old reminders
        await axios.post(`${url}/api/Birthday/remove-old`);
      };
  
      cleanupAndFetch();
    }, []);

  const fetchDobList = async (pageNumber = 1) => {
    try {
      const response = await axios.get(`${url}/api/Birthday/dob-list`, {
        params: {
          page: pageNumber,
          limit: 10,
        }
      });

      if (response.data.success) {
        setList(response.data.data);
        setPage(response.data.pagination.currentPage);
        setTotalPages(response.data.pagination.totalPages);
      } else {
        toast.error("Error");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error");
    }
  };


  useEffect(() => {
    fetchDobList(1)
  }, [])




  return (
    <div className='dob-list add flex-col'>
      <div className="header-row">
        <p>Birthday of Customers</p>
      </div>
      <div className="dob-list-table">
        <div className="dob-list-table-format title">
          <b>BirthDay-Date</b>
          <b>Image</b>
          <b>Name</b>
          <b>Wish</b>
          <b>Mobile No.</b>
        </div>
        <div className="dob-pagination">
          <button
            disabled={page === 1}
            onClick={() => fetchDobList(page - 1)}
          >
            Prev
          </button>

          <span>{page} / {totalPages}</span>

          <button
            disabled={page === totalPages}
            onClick={() => fetchDobList(page + 1)}
          >
            Next
          </button>
        </div>

        {list.map((item, index) => {
          return (
            <div key={index} className="dob-list-table-format">
              <p>{new Date(item.birthday).toISOString().split("T")[0]}</p>
              <img src={item.image || assets.user_icon} alt="" />
              <p>{item.name}</p>
              <img src={assets.celebration_icon} alt="edit" className="user_details" onClick={() => handleUpdate(item._id)} />
              <p>{item.mobile1}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Dob_reminder
