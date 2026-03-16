import React, { useContext, useEffect, useState } from 'react'
import './Appointment.css'
import { assets } from '../../assets/assets';
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';
import * as XLSX from "xlsx";
import { StoreContext } from '../../context/StoreContext';
import { useMemo, useCallback } from "react";

const Appointment = () => {

        const { token, url } = useContext(StoreContext);
    const navigate = useNavigate();
    const handleUpdate = (id) => {
        navigate(`/list_Pending/FullList_Pending/${id}`);
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

        const response = await axios.get(`${url}/api/booking/Booking-list`, {
            params: {
                field: searchField,
                value,
                page,
                limit: 20
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
        if (!token) return;
        fetchList(1)
    }, [token])
return (
  <div className='booking-list add flex-col'>
    <div className="header-row">
      <p>Booking Customers</p>
    </div>

    <div className="booking-list-table">
      {/* Table Header */}
      <div className="booking-list-table-format title">
        <b>Booking Date</b>
        <b>Image</b>
        <b>Name</b>
        <b>Service Type</b>
        <b>Address</b>
        <b>Complete Service</b>
      </div>

       {/* Unified pagination */}
                {totalPages > 1 && (
                    <div className="pagination">
                        <button
                            disabled={page === 1}
                            onClick={() => {
                                if (searchValue.trim()) {
                                    searchCustomer(searchValue, page - 1);
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
                                    searchCustomer(searchValue, page + 1);
                                } else {
                                    fetchList(page + 1);
                                }
                            }}
                        >
                            Next
                        </button>
                    </div>
                )}
      {/* Table Rows */}
      {list.map((item, index) => (
        <div key={index} className="booking-list-table-format">
          <p>{new Date(item.create).toISOString().split("T")[0]}</p>
          <img src={assets.user_icon} alt={item.name} />
          <p>{item.name}</p>
          <p>{item.serviceType || "-"}</p>
          <p>{item.address || "-"}</p>
          <div className="action-icons">
            <img
                src={assets.done_icon}
                alt="approve"
                className="done-icon approve"
                onClick={() => navigate(`/appointment/FullList/${item._id}`)}
            />
            </div>
        </div>
      ))}
    </div>
  </div>
)
}

export default Appointment
