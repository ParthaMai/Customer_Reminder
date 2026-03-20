import React, { useContext, useEffect, useRef, useState } from 'react'
import './Pending_Calls.css'
import { assets } from '../../assets/assets';
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const Pending_Calls = () => {

        const { token, url,   
            pendingList, pendingPage, pendingTotalPages, pendingCategory, setPendingCategory, fetchPendingList } = useContext(StoreContext);
    const navigate = useNavigate();
    const handleUpdate = (id) => {
        navigate(`/list_Pending/FullList_Pending/${id}`);
    };

    // Debounce
    const debounceRef = useRef(null);
    const handleSearch = (val) => {
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            searchCustomer(val);
        }, 700);
    };

    useEffect(() => { 
        if (!token) return;
        fetchPendingList(1, pendingCategory);
    }, [token, pendingCategory]);

    return (
        <div className='list-cash add flex-col'>
            {/* ✅ Service Category */}
            <div className="service-type-selector">
                {["RO", "Chimney", "AC"].map(type => (
                    <button
                        key={type}
                        className={pendingCategory === type ? "active" : ""}
                        onClick={() => setPendingCategory(type)}
                    >
                        {type}
                    </button>
                ))}
            </div>
            <p>Pending Calls list</p>
            <div className="list-cash-table">
                <div className="list-cash-table-format title">
                    <b>Image</b>
                    <b>Name</b>
                    <b>Update</b>
                    <b>Service Date</b>
                    <b>Mobile No.</b>
                    <b>Service Cost</b>
                    <b>Service Date</b>
                </div>

                {/* Pagination */}
                {pendingTotalPages > 1 && (
                    <div className="pagination">
                        <button
                            disabled={pendingPage === 1}
                            onClick={() => fetchPendingList(pendingPage - 1, pendingCategory)}
                        >
                            Prev
                        </button>

                        <span>{pendingPage} / {pendingTotalPages}</span>

                        <button
                            disabled={pendingPage === pendingTotalPages}
                            onClick={() => fetchPendingList(pendingPage + 1, pendingCategory)}
                        >
                            Next
                        </button>
                    </div>
                )}



                 {/* Data */}
                {pendingList.length === 0 ? (
                    <p className="no-data">No pending calls for {pendingCategory}</p>
                ) : pendingList.map((item, index) => (
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
                        <p>{new Date(item.serviceDate).toISOString().split("T")[0]}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}


export default Pending_Calls;
