import React, { useEffect, useState } from 'react'
import './List_Service_Customer.css'
// import '../List_Cash/List_Cash.css'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../../assets/assets'
import { useNavigate } from "react-router-dom";
import { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'
import { useCallback } from "react";
import { useRef } from 'react'

const List_Service_Customer = () => {

  const {
    token, url,
    // ✅ Context states
    customerList, customerPage, customerTotalPages, customerCategory, setCustomerCategory, setCustomerPage, fetchCustomerList, setCustomerCache } = useContext(StoreContext);


  const navigate = useNavigate();
  const handleUpdate = (id) => {
    navigate(`/list_Customer/FullList_Customer/${id}`);
  };

  const [searchResults, setSearchResults] = useState(null);

  const [searchField, setSearchField] = useState("name");
  const [searchValue, setSearchValue] = useState("");

  // Debounce function
  const debounceRef = useRef(null);




  const searchCustomer = useCallback(async (value, pageNumber = 1) => {
    try {
      if (!value.trim()) {
        setSearchResults(null); // ✅ reset
        fetchCustomerList(1);
        return;
      }

      const response = await axios.get(`${url}/api/service_Customer/searchCustomer`, {
        params: {
          field: searchField,
          value,
          page: pageNumber,
          limit: 10,
          serviceCategory: customerCategory
        },
        headers: { token }
      });

      if (response.data.success) {
        setSearchResults(response.data.data); // ✅ IMPORTANT
        setCustomerPage(response.data.pagination.currentPage);
      } else {
        toast.error("Search error");
      }

    } catch (error) {
      console.log(error);
      toast.error("Server error");
    }
  }, [searchField, token, customerCategory]);

const handleSearch = (val) => {
  clearTimeout(debounceRef.current);
  debounceRef.current = setTimeout(() => {
    searchCustomer(val);
  }, 700);
};

  useEffect(() => {
    if (!token) return;

    // if searching → skip normal fetch
    if (searchValue.trim()) return;

    fetchCustomerList(customerPage, customerCategory);

  }, [token, customerCategory, customerPage]);


  const removeCustomer = async (itemId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this customer?");
    if (!isConfirmed) return;

    try {
      const response = await axios.post(
        `${url}/api/service_Customer/remove`,
        { id: itemId },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);

        // 🔥 clear cache
        setCustomerCache({});

        const isSearching = searchValue.trim();

        if (isSearching) {
          // ✅ Stay in search mode
          const newPage =
            (searchResults?.length || 0) === 1 && customerPage > 1
              ? customerPage - 1
              : customerPage;

          setCustomerPage(newPage);
          searchCustomer(searchValue, newPage); // ✅ IMPORTANT
        } else {
          // ✅ Normal list mode
          const newPage =
            customerList.length === 1 && customerPage > 1
              ? customerPage - 1
              : customerPage;

          setCustomerPage(newPage);
          fetchCustomerList(newPage, customerCategory);
        }

      } else {
        toast.error(response.data.message);
      }

    } catch (error) {
      toast.error("Server error");
      console.error(error);
    }
  };
  const displayList = searchResults || customerList;
  return (
    <div className='list-cash add flex-col'>

      {/* ✅ Category */}
      <div className="service-type-selector">
        {["RO", "Chimney", "AC"].map((type) => (
          <button
            key={type}
            type="button"
            className={customerCategory === type ? "active" : ""}
            onClick={() => {
              setCustomerCategory(type);
              setSearchValue("");
              setSearchResults(null);
              setCustomerPage(1);
            }}
          >
            {type}
          </button>
        ))}
      </div>

      <p>All Customer list</p>

      {/* 🔍 Search */}
      <div className="search-box">
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder={`Search by ${searchField}`}
            value={searchValue}
            onChange={(e) => {
              const val = e.target.value;
              setSearchValue(val);
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

      {/* 📋 Table */}
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

        {/* 🔁 Pagination */}
        {customerTotalPages > 1 && (
          <div className="pagination">
            <button
              disabled={customerPage === 1}
              onClick={() => {
                const newPage = customerPage - 1;
                setCustomerPage(newPage);

                if (searchValue.trim()) {
                  searchCustomer(searchValue, newPage);
                } else {
                  fetchCustomerList(newPage);
                }
              }}
            >
              Prev
            </button>

            <span>{customerPage} / {customerTotalPages}</span>

            <button
              disabled={customerPage === customerTotalPages}
              onClick={() => {
                const newPage = customerPage + 1;
                setCustomerPage(newPage);

                if (searchValue.trim()) {
                  searchCustomer(searchValue, newPage);
                } else {
                  fetchCustomerList(newPage);
                }
              }}
            >
              Next
            </button>
          </div>
        )}

        {/* ❌ No Data */}
        {displayList.length === 0 && (
          <p className="no-data">
            {searchValue.trim()
              ? "No search results found"
              : `No customers found for ${customerCategory}`}
          </p>
        )}
        {/* 📄 Data */}
        {displayList.map((item, index) => (
          <div key={index} className="list-cash-table-format">
            <img src={assets.user_icon} alt="customer" />
            <p>{item.name}</p>

            <img
              src={assets.edit_icon}
              alt="edit"
              className="edit-icon"
              onClick={() => handleUpdate(item._id)}
            />

            <p>{new Date(item.serviceDate).toISOString().split("T")[0]}</p>
            <p>{item.mobile1}</p>
            <p>₹{item.totalPrice}</p>

            <p onClick={() => removeCustomer(item._id)} className='cursor'>x</p>
          </div>
        ))}

      </div>
    </div>
  );
};

export default List_Service_Customer;
