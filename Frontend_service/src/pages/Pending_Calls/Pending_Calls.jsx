import React, { useContext, useEffect, useRef, useState } from 'react'
import './Pending_Calls.css'
import { assets } from '../../assets/assets';
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import Loader1 from '../../components/Loader/Loader1';

const Pending_Calls = () => {

    const { token, url,
        pendingList, pendingPage, setPendingPage, pendingTotalPages, pendingCategory, setPendingCategory, fetchPendingList } = useContext(StoreContext);

    // For loading
    const [loading, setLoading] = useState(true);
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
    // 🔝 Scroll to top when page loads
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);


    useEffect(() => {
        if (!token) return;
        const loadData = async () => {
            setLoading(true);
            await fetchPendingList(pendingPage, pendingCategory);
            setLoading(false);
        };

        loadData();
    }, [token, pendingCategory, pendingPage]);

    return (
        <div className='list-cash add flex-col'>
            {/* ✅ Service Category */}
            <div className="service-type-selector">
                {["RO", "Chimney", "AC"].map(type => (
                    <button
                        key={type}
                        className={pendingCategory === type ? "active" : ""}
                        onClick={() => {
                            setPendingCategory(type);
                            setPendingPage(1);
                        }}
                    >
                        {type}
                    </button>
                ))}
            </div>
            <p>Pending Calls list</p>
            <div className="list-cash-table">

                {/* Pagination */}
                {pendingTotalPages > 1 && (
                    <div className="pagination">
                        <button
                            disabled={pendingPage === 1}
                            onClick={() => {
                                const newPage = pendingPage - 1;
                                setPendingPage(newPage); // 🔥 FIX
                            }}
                        >
                            Prev
                        </button>

                        <span>{pendingPage} / {pendingTotalPages}</span>

                        <button
                            disabled={pendingPage === pendingTotalPages}
                            onClick={() => {
                                const newPage = pendingPage + 1;
                                setPendingPage(newPage); // 🔥 FIX
                            }}
                        >
                            Next
                        </button>
                    </div>
                )}



                {/* Data */}
                {loading ? (
                    <Loader1 />
                ) : pendingList.length === 0 ? (
                    <div className="no-data-container">
                        <img src={assets.no_data_icon} alt="No Data" className="no-data-img" />
                        <p className="no-data">No pending calls for {pendingCategory}</p>
                    </div>
                ) : pendingList.map((item, index) => (
                    <div key={index} className="list-cash-table-format" onClick={() => handleUpdate(item._id)} // ✅ HERE
                        style={{ cursor: "pointer" }}>
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
                            <div className="list-remind">
                            <p>{new Date(item.create).toISOString().split("T")[0]}</p>
                            <span> Remind Date</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}


export default Pending_Calls;
