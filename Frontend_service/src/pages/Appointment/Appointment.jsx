import React, { useContext, useEffect, useState } from 'react'
import './Appointment.css'
import { assets } from '../../assets/assets';
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { useMemo, useCallback } from "react";

const Appointment = () => {

    const { token, bookingList, bookingPage, setBookingPage, bookingTotalPages, bookingCategory, setBookingCategory, fetchBookingList } = useContext(StoreContext);
    const navigate = useNavigate();
    const handleUpdate = (id) => {
        navigate(`/appointment/FullList/${id}`);
    };

    useEffect(() => {
        if (!token) return;
        fetchBookingList(bookingPage, bookingCategory);

    }, [token, bookingCategory, bookingPage]);
    return (
        <div className='booking-list add flex-col'>
            <div className="header-row">
                <p>Booking Customers</p>
            </div>

            {/* ✅ CATEGORY FILTER */}
            <div className="service-type-selector">
                {["RO", "Chimney", "AC"].map(type => (
                    <button
                        key={type}
                        className={bookingCategory === type ? "active" : ""}
                        onClick={() => {
                            setBookingCategory(type);
                            setBookingPage(1);

                            }}
                    >
                        {type}
                    </button>
                ))}
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

                {/* ✅ Pagination */}
                <div className="pagination">
                    <button
                        disabled={bookingPage === 1}
                        onClick={() => fetchBookingList(bookingPage - 1, bookingCategory)}
                    >
                        Prev
                    </button>

                    <span>{bookingPage} / {bookingTotalPages}</span>

                    <button
                        disabled={bookingPage === bookingTotalPages}
                        onClick={() => fetchBookingList(bookingPage + 1, bookingCategory)}
                    >
                        Next
                    </button>
                </div>
                {/* ✅ Empty State + List */}
                {bookingList.length === 0 ? (
                    <p className="no-data">
                        No bookings for {bookingCategory}
                    </p>
                ) : bookingList.map((item) => (

                    <div key={item._id} className="booking-list-table-format" onClick={() => handleUpdate(item._id)} // ✅ HERE
                        style={{ cursor: "pointer" }}>

                        <p>
                            {item.create
                                ? new Date(item.create).toISOString().split("T")[0]
                                : "-"}
                        </p>

                        <img src={assets.user_icon} alt="customer" />

                        <p>{item.name}</p>

                        <p>{item.serviceType || "-"}</p>

                        <p>{item.address || "-"}</p>

                        <div className="action-icons">
                            <img
                                src={assets.done_icon}
                                alt="complete"
                                className="done-icon approve"
                                onClick={() => handleUpdate(item._id)}
                            />
                        </div>

                    </div>
                ))}
            </div>
        </div>
    )
}

export default Appointment
