import React, { useEffect, useState } from 'react'
import './List_Service_Customer.css'
// import '../List_Cash/List_Cash.css'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../../assets/assets'
import { useNavigate } from "react-router-dom";
import { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'
import { useMemo, useCallback } from "react";

const List_Service_Customer = () => {

  const { token, url } = useContext(StoreContext);
  const navigate = useNavigate();
  const handleUpdate = (id) => {
    navigate(`/list_Customer/FullList_Customer/${id}`);
  };


  const [list, setList] = useState([]);

  const [searchField, setSearchField] = useState("name");
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Debounce function
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };


  const searchCustomer = useCallback(async (value, pageNumber = 1) => {
    try {
      if (!value.trim()) {
        fetchList(1);
        return;
      }

      const response = await axios.get(`${url}/api/service_Customer/searchCustomer`, {
        params: {
          field: searchField,
          value,
          page: pageNumber,
          limit: Number(10),
        },
        headers: { token }
      });

      if (response.data.success) {
        setList(response.data.data);
        setPage(response.data.pagination.currentPage);
        setTotalPages(response.data.pagination.totalPages);
      } else {
        toast.error("Search error");
      }

    } catch (error) {
      console.log(error);
      toast.error("Server error");
    }
  }, [searchField, token]);

  const handleSearch = useMemo(
    () => debounce((val) => searchCustomer(val), 700),
    [searchCustomer]
  );
  const fetchList = async (page = 1, value = "") => {

    const response = await axios.get(`${url}/api/service_Customer/list`, {
      params: {
        field: searchField,
        value,
        page,
        limit: 10
      },
      headers: { token }
    });

    if (response.data.success) {
      setList(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
      setPage(response.data.pagination.currentPage);
    }
    else {
      toast.error(response.data.message);
    }
  };

  useEffect(() => {
    fetchList(1)
  }, [])


  const removeCustomer = async (itemId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this customer?");
    if (!isConfirmed) return;
    try {
      const response = await axios.post(`${url}/api/service_Customer/remove`, { id: itemId },{ headers: { token }});
      
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      }
      else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Server error");
      console.error(error);
    }
  }

  return (
    <div className='list-cash add flex-col'>
      <p>All Customer list</p>
      <div className="search-box">
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder={`Search by ${searchField}`}
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              const val = e.target.value;
              handleSearch(val);
            }}
          />
        </div>
        <select
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
        >
          <option value="name">Name</option>
          <option value="mobile1">Mobile No</option>
        </select>


      </div>
      <div className="list-cash-table">
        <div className="list-cash-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Update</b>
          <b>Service Date</b>
          <b>Mobile No.</b>
          <b>Service Cost</b>
          <b>Action</b>
        </div>

        {/* Unified pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              disabled={page === 1}
              onClick={() => {
                if (searchValue.trim()) {
                  searchEmi(searchValue, page - 1);
                } else {
                  fetchList(page - 1);
                }
              }}
            >
              Prev
            </button>

            <span>{page} / {totalPages}</span>

            <button
              disabled={page === totalPages}
              onClick={() => {
                if (searchValue.trim()) {
                  searchEmi(searchValue, page + 1);
                } else {
                  fetchList(page + 1);
                }
              }}
            >
              Next
            </button>
          </div>
        )}


        {list.map((item, index) => {
          return (
            <div key={index} className="list-cash-table-format">
              <img
                src={assets.user_icon}
                alt="customer"
              />
              <p>{item.name}</p>
              <img src={assets.edit_icon} alt="edit" className="edit-icon" onClick={() => handleUpdate(item._id)} />
              <p>{new Date(item.serviceDate).toISOString().split("T")[0]}</p>
              <p>{item.mobile1}</p>
              <p>₹{item.totalPrice}</p>
              <p onClick={() => removeCustomer(item._id)} className='cursor'>x</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default List_Service_Customer
