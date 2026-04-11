import { useContext, useEffect } from 'react';
import './FullList_Customer.css';
import { useState } from 'react';
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../../../assets/assets';
import { useNavigate, useParams } from "react-router-dom";
import React from 'react'
import { StoreContext } from '../../../context/StoreContext';
import Loader from '../../../components/Loader/Loader';

const FullList_Customer = () => {
    const { token, url, setCustomerCache, setCustomerList } = useContext(StoreContext);
    const [historyIndex, setHistoryIndex] = useState(0);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const { id: itemId } = useParams(); // previous state item id like props


    const [item, setItem] = useState({});

    // For editing
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});

    const handleUpdate = () => {
        setEditData(item);
        setIsEditing(true);
    };
    // For services
    const sortedHistory = item.serviceHistory
        ? [...item.serviceHistory].sort(
            (a, b) => new Date(b.serviceDate) - new Date(a.serviceDate)
        )
        : [];

    const currentHistory = sortedHistory[historyIndex];

    const submitUpdate = async () => {
        try {
            console.log(editData);
            const response = await axios.put(`${url}/api/service_Customer/updateCustomer`, editData, { headers: { token } });
            if (response.data.success) {
                toast.success("Updated successfully");
                setIsEditing(false);
                fetchFullList();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Server error");
            console.error(error);
        }
    };


    const fetchFullList = async () => {
        try {
            const response = await axios.get(`${url}/api/service_Customer/fullList`, { params: { id: itemId }, headers: { token } });
            if (response.data.success) {
                setItem(response.data.data);
            }
            else {
                toast.error("Error");
            }
        } catch (error) {
            toast.error("Server Error")
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!token) return;
        fetchFullList()
    }, [itemId, token])

    if (loading) {
        return <Loader />;
    }

    const removeCustomer = async (itemId) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this customer?");
        if (!isConfirmed) return;
        try {
            const response = await axios.post(`${url}/api/service_Customer/remove`, { id: itemId }, { headers: { token } });
            if (response.data.success) {
                toast.success(response.data.message);
                // If using context:
                setCustomerList(prev => prev.filter(c => c._id !== itemId));
                setCustomerCache({}); // clear cache
                navigate("/list_Service_Customer", { replace: true });
            }
            else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Server error");
            console.error(error);
        }
    }

    if (!item) {
        return (
            <div className="no-data-container">
                <img src={assets.no_data_icon} alt="No Data" className="no-data-img" />
                <h2>No Data Found</h2>
                <p>This customer record may have been removed or is unavailable.</p>

                <button onClick={() => navigate("/list_Service_Customer", { replace: true })}>
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="full-list-container">

            <div className="field-table">
                <div className="field-table-format">
                    <p className="field-card-title">Cash Customer Data</p>
                    <div className="field">
                        <label>Image:</label>
                        <img src={assets.user_icon} alt="Customer" />
                    </div>
                    <hr />

                    <div className="field">
                        <label>Name:</label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={editData.name || ""}
                                onChange={e => setEditData({ ...editData, name: e.target.value })}
                            />
                        ) : (
                            <p>{item.name}</p>
                        )}
                    </div>
                    <hr />

                    <div className="field">
                        <label>Service Date:</label>
                        {isEditing ? (
                            <input
                                type="date"
                                value={editData.serviceDate ? new Date(editData.serviceDate).toISOString().split("T")[0] : ""}
                                onChange={e => setEditData({ ...editData, serviceDate: e.target.value })}
                            />
                        ) : (
                            <p>{item.serviceDate ? new Date(item.serviceDate).toISOString().split("T")[0] : "-"}</p>
                        )}
                    </div>
                    <hr />

                    <div className="field">
                        <label>Mobile1:</label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={editData.mobile1 || ""}
                                onChange={e => setEditData({ ...editData, mobile1: e.target.value })}
                            />
                        ) : (
                            <p>{item.mobile1}</p>
                        )}
                    </div>
                    <hr />
                    {item.mobile2 && (
                        <>
                            <div className="field">
                                <label>Mobile2:</label>
                                <p>{item.mobile2}</p>
                            </div>
                            <hr />
                        </>
                    )}
                    {item.description && (
                        <>
                            <div className="field">
                                <label>Description:</label>
                                <p>{item.description}</p>
                            </div>
                            <hr />
                        </>
                    )}
                    {item.dob && (
                        <>
                            <div className="field">
                                <label>DOB:</label>
                                {isEditing ? (
                                    <input
                                        type="date"
                                        value={editData.dob ? new Date(editData.dob).toISOString().split("T")[0] : ""}
                                        onChange={e => setEditData({ ...editData, dob: e.target.value })}
                                    />
                                ) : (
                                    <p>{item.dob ? new Date(item.dob).toISOString().split("T")[0] : "-"}</p>
                                )}
                            </div>
                            <hr /></>
                    )}
                    <div className="service-history-block">
                        <label className="service-history-label">Services:</label>

                        {currentHistory ? (
                            <div className="service-history-card">

                                {/* Date */}
                                <p className="service-history-date">
                                    {new Date(currentHistory.serviceDate).toISOString().split("T")[0]}
                                </p>

                                {/* Services */}
                                <div className="service-history-list">
                                    {currentHistory.services.map((service, index) => (
                                        <div key={index} className="service-history-item">
                                            <span className="service-index">{index + 1}.</span>
                                            <span className="service-desc">{service.description}</span>
                                            <span className="service-price">₹{service.price}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Navigation */}
                                <div className="service-history-nav">
                                    <button
                                        className="nav-btn"
                                        disabled={historyIndex === 0}
                                        onClick={() => setHistoryIndex(prev => prev - 1)}
                                    >
                                        ⬅ Prev
                                    </button>

                                    <span className="history-count">
                                        {historyIndex + 1} / {sortedHistory.length}
                                    </span>

                                    <button
                                        className="nav-btn"
                                        disabled={historyIndex === sortedHistory.length - 1}
                                        onClick={() => setHistoryIndex(prev => prev + 1)}
                                    >
                                        Next ➡
                                    </button>
                                </div>

                            </div>
                        ) : (
                            <p className="no-history">No service history</p>
                        )}
                    </div>
                    <hr />
                    <div className="field">
                        <label>Reminder Period:</label>
                        {isEditing ? (
                            <input
                                type="number"
                                value={editData.reminderPeriod || ""}
                                onChange={e => setEditData({ ...editData, reminderPeriod: e.target.value })}
                            />
                        ) : (
                            <p>
                                {item.serviceCategory === "AC" && item.reminderPeriod === 3
                                    ? "Yearly"
                                    : `${item.reminderPeriod} Months`}
                            </p>
                        )}
                    </div>
                    <hr />
                    {item.nextReminderDate && (
                        <>
                            <div className="field">
                                <label>Next Reminder Date:</label>
                                {isEditing ? (
                                    <input
                                        type="date"
                                        value={editData.nextReminderDate ? new Date(editData.nextReminderDate).toISOString().split("T")[0] : ""}
                                        onChange={e => setEditData({ ...editData, nextReminderDate: e.target.value })}
                                    />
                                ) : (
                                    item.nextReminderDate && (
                                        <p>{new Date(item.nextReminderDate).toISOString().split("T")[0]}</p>
                                    )
                                )}
                            </div>
                            <hr /></>

                    )}
                    {item.extendReminder && (
                        <>
                            <div className="field">
                                <label>ExtendReminder Date : </label>
                                <p>{new Date(item.extendReminder).toISOString().split("T")[0]}</p>
                            </div>
                            <hr /></>
                    )}
                    {item.summary && (
                        <>
                            <div className="field">
                                <label>Summary :</label>
                                <p>{item.summary}</p>
                            </div>
                            <hr /></>
                    )}
                    <div className="field">
                        {isEditing && (
                            <div className="edit-buttons">
                                <button onClick={submitUpdate}>Save</button>
                                <button onClick={() => setIsEditing(false)}>Cancel</button>
                            </div>
                        )}
                    </div>
                    <div className="field">
                        <img
                            src={assets.edit_icon}
                            alt="edit"
                            className="edit-icon"
                            onClick={() => handleUpdate()}
                        />
                        <p onClick={() => removeCustomer(item._id)} className="cursor"> Delete </p>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default FullList_Customer

