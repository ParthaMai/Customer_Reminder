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
import Loader1 from '../../components/Loader/Loader1'

const List_Service_Customer = () => {

  const {
    token, url,
    // ✅ Context states
    customerList, setCustomerList, customerPage, customerTotalPages, customerCategory, setCustomerCategory, setCustomerPage, fetchCustomerList, setCustomerCache } = useContext(StoreContext);


  // For loading
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const handleUpdate = (id) => {
    navigate(`/list_Customer/FullList_Customer/${id}`);
  };

  const [searchResults, setSearchResults] = useState(null);
  const [searchTotalPages, setSearchTotalPages] = useState(1);

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
          limit: 10
        },
        headers: { token }
      });

      if (response.data.success) {
        setSearchResults(response.data.data); // ✅ IMPORTANT
        setCustomerPage(response.data.pagination.currentPage);
        setSearchTotalPages(response.data.pagination.totalPages);
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

    const loadData = async () => {
      setLoading(true);
      await fetchCustomerList(customerPage, customerCategory);
      setLoading(false);
    };

    loadData();

  }, [token, customerCategory, customerPage, fetchCustomerList]);


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

        // ✅ create updated list FIRST
        const updatedList = customerList.filter(item => item._id !== itemId);

        // ✅ update UI instantly
        setCustomerList(updatedList);

        // ✅ update search also
        setSearchResults(prev =>
          prev ? prev.filter(item => item._id !== itemId) : null
        );

        // 🔥 clear cache
        setCustomerCache({});

        const isSearching = searchValue.trim();

        if (isSearching) {
          const updatedSearch =
            searchResults?.filter(item => item._id !== itemId) || [];
          // ✅ Stay in search mode
          const newPage =
            updatedSearch.length === 0 && customerPage > 1
              ? customerPage - 1
              : customerPage;

          setCustomerPage(newPage);
          // 🔥 force fresh search
          await searchCustomer(searchValue, newPage); // ✅ IMPORTANT
        } else {
          // ✅ Normal list mode
          const newPage =
            updatedList.length === 0 && customerPage > 1
              ? customerPage - 1
              : customerPage;

          setCustomerPage(newPage);
          await fetchCustomerList(newPage, customerCategory, true);
        }

      } else {
        toast.error(response.data.message);
      }

    } catch (error) {
      toast.error("Server error");
      console.error(error);
    }
  };
  const displayList = searchValue.trim() ? searchResults || [] : customerList;
  const totalPages = searchValue.trim() ? searchTotalPages : customerTotalPages;
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

            <span>{customerPage} / {totalPages}</span>

            <button
              disabled={customerPage === totalPages}
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

        {/* Data */}
        {loading ? (
          <Loader1 />
        ) : displayList.length === 0 ? (
          <div className="no-data-container">
            <img src={assets.no_data_icon} alt="No Data" className="no-data-img" />
            <p className="no-data">
              {searchValue.trim()
                ? "No search results found"
                : `No customers found for ${customerCategory}`}
            </p>
          </div>
        ) : (
          displayList.map((item) => (
            <div key={item._id}  className="list-cash-table-format" onClick={() => handleUpdate(item._id)} >
              {/* LEFT SIDE */}
              <div className="list-left">
                <img src={assets.user_icon} alt="user" />

                <div className="list-info">
                  {/* TOP ROW */}
                  <div className="list-top">
                    <p className="list-name">{item.name}</p>
                  </div>

                  {/* BOTTOM ROW */}
                  <div className="list-bottom">
                    <span>{item.mobile1}</span>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="list-right">
                <div className="list-price">
                  ₹{item.totalPrice}
                  <span>Service Cost</span>
                </div>

                <button
                  className="edit-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdate(item._id);
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          ))
        )}

      </div>
    </div>
  );
};

export default List_Service_Customer;
