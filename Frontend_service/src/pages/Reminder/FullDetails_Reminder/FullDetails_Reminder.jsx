import React, { useContext } from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../../../assets/assets';
import './FullDetails_Reminder.css'
import { useNavigate } from "react-router-dom";
import { useRef } from 'react';
import { useParams } from "react-router-dom";
import { StoreContext } from '../../../context/StoreContext';

const FullDetails_Reminder = () => {

    const { token, url, fetchReminderList, setReminderCache } = useContext(StoreContext);
    const navigate = useNavigate();

    const [data, setData] = useState({
        summary: "",
        extendReminder: ""
    })
    const [bookingData, setBookingData] = useState({
        serviceType: "",
        address: "",
        bookingDate: ""
    });
    const savingRef = useRef(false);
    const [saving, setSaving] = useState(false);
    const { id: itemId } = useParams();// previous state item id like props

    const [selectedNumber, setSelectedNumber] = useState("");
    const [item, setItem] = useState({});


    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }
    const onSubmitHandler = async (id) => {
        try {
            const payload = {};

            if (data.summary) payload.summary = data.summary;
            if (data.extendReminder) payload.extendReminder = data.extendReminder;

            // If nothing is filled
            if (Object.keys(payload).length === 0) {
                toast.warning("Please select an extend reminder date.");
                return false;
            }

            payload._id = id;

            let response;
            response = await axios.post(`${url}/api/service-remind-list/extend-remind`, payload, { params: { id: itemId }, headers: { token } });


            if (response.data.success) {
                setData({
                    summary: "",
                    extendReminder: ""
                });
                toast.success(response.data.message);
                return true;
            } else {
                toast.error(response.data.message);
                return false;
            }
        } catch (error) {
            toast.error("Something went wrong");
            return false;
        }
    };

    const onChangeBookingHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        setBookingData(data => ({ ...data, [name]: value }));
    };
    const onSubmitBookingHandler = async (id) => {
        try {

            if (!bookingData.bookingDate) {
                toast.warning("Please Select the booking date");
                return false;
            }

            const payload = {
                _id: id,
                serviceType: bookingData.serviceType,
                address: bookingData.address,
                bookingDate: bookingData.bookingDate,
                serviceCategory: item.serviceCategory
            };

            const response = await axios.post(`${url}/api/service_Customer/booking-update`, payload, { params: { id: itemId }, headers: { token } });

            if (response.data.success) {

                setBookingData({
                    serviceType: "",
                    address: "",
                    bookingDate: ""
                });

                toast.success(response.data.message);
                return true;

            } else {
                toast.error(response.data.message);
                return false;
            }

        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
            return false;
        }
    };



    const handleUpdate = (mobileNumber) => {
        if (!mobileNumber) {
            alert("No number selected");
            return;
        }

        window.location.href = `tel:${mobileNumber}`;
    };

    // For whatsapp appointment
    const handleAppointmentUpdatae = (mobileNumber) => {
        if (!mobileNumber) {
            alert("No number selected");
            return;
        }

        const message = `Hello ${item.name}, 😊\nYour appointment is scheduled on ${bookingData.bookingDate}.\nWe look forward to serving you. Thank you!`;



        const encodedMessage = encodeURIComponent(message);

        // Open WhatsApp chat with pre-filled message
        window.open(
            `https://wa.me/${mobileNumber}?text=${encodedMessage}`,
            "_blank"
        );
    };

    // Submit Denied
    const handleDeniedClick = () => {
        toast.info("This feature is available in the premium plan. Please upgrade to continue.");
    };



    const fetchFullList = async () => {
        const response = await axios.get(`${url}/api/service-remind-list/Full-Details`, { params: { id: itemId }, headers: { token } });
        if (response.data.success) {
            setItem(response.data.data);
        }
        else {
            toast.error("Error");
        }
    }

    useEffect(() => {
        if (!token) return;
        fetchFullList()
    }, [token])


    const removeCustomer = async (itemId) => {
        const isConfirmed = window.confirm("Are you sure Complete your Reminder task?");
        if (!isConfirmed) return;
        try {
            const response = await axios.post(`${url}/api/service-remind-list/remove-remind`, { id: itemId }, { headers: { token } })
            if (response.data.success) {
                toast.success(response.data.message);
                setReminderCache({});
                navigate("/reminder", { replace: true });
            }
            else {
                toast.error("Error")
            }
        } catch (error) {
            toast.error("Server error");
            console.error(error);
        }
    }
    const removeReminder = async (itemId) => {
        try {
            const response = await axios.post(`${url}/api/service-remind-list/remove-remind`, { id: itemId }, { headers: { token } });
            if (response.data.success) {
                toast.success("Removed Customer From Reminder");
                setReminderCache({});
                navigate("/reminder", { replace: true });
            }
            else {
                toast.error("Error")
            }
        } catch (error) {
            toast.error("Server error");
            console.error(error);
        }
    }
    return (
        <div className="remind-full-list-container">

            <div className="remind-field-table">
                <div className="remind-field-table-format">
                    <p className="remind-field-card-title">Customer Data</p>
                    <div className="field">
                        <label>Image:</label>
                        <img src={assets.user_icon} alt="Customer" />
                    </div>
                    <hr />
                    <div className="field service-category">
                        <label>Service Category:</label>
                        <p className="highlight">{item.serviceCategory}</p>
                    </div>
                    <hr />
                    <div className="field">
                        <label>Name:</label>
                        <p>{item.name}</p>
                    </div>
                    <hr />

                    <div className="field">
                        <label>Service Date:</label>
                        <p>{item.serviceDate ? new Date(item.serviceDate).toISOString().split("T")[0] : "-"}</p>
                    </div>
                    <hr />

                    <div className="field">
                        <label>Mobile1:</label>
                        <p>{item.mobile1}</p>
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
                                <p>{item.dob ? new Date(item.dob).toISOString().split("T")[0] : "-"}</p>
                            </div>
                            <hr /></>
                    )}

                    <div className="field">
                        <label>Services:</label>
                        <p>
                            {item.services
                                ?.map(service => `${service.description} — ₹${service.price}`)
                                .join(", ")}
                        </p>
                    </div>
                    <hr />

                    <div className="field">
                        <label>Reminder Period:</label>
                        <p>{item.reminderPeriod}</p>
                    </div>
                    <hr />
                    {item.callingDate && (
                        <>
                            <div className="field">
                                <label>Last Call Date : </label>
                                <p>{new Date(item.callingDate).toISOString().split("T")[0]}</p>
                            </div>
                            <hr /></>
                    )}
                    {item.nextReminderDate && (
                        <>
                            <div className="field">
                                <label>NextRemider Date : </label>
                                <p>{new Date(item.nextReminderDate).toISOString().split("T")[0]}</p>
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
                                <label>Summary:</label>
                                <p>{item.summary}</p>
                            </div>
                            <hr /></>
                    )}
                    <div className="field">
                        <select
                            onChange={(e) => setSelectedNumber(e.target.value)}
                            defaultValue=""
                        >
                            <option value="" disabled>
                                Select number
                            </option>

                            {item.mobile1 && (
                                <option value={item.mobile1}>Mobile 1 - {item.mobile1}</option>
                            )}
                            {item.mobile2 && (
                                <option value={item.mobile2}>Mobile 2 - {item.mobile2}</option>
                            )}
                        </select>

                        <img src={assets.call_icon} alt="edit" className="edit-icon"
                            onClick={() => {
                                if (!selectedNumber) {
                                    alert("Please select a number first");
                                    return;
                                }
                                handleUpdate(selectedNumber);
                            }}
                        />
                    </div>
                    <hr />
                    {/* Summary field */}
                    <div className="field">
                        <label>Write Phone Call summary...</label>
                        <textarea rows="4" name="summary" value={data.summary} onChange={onChangeHandler} placeholder="Write Phone Call summary..." />
                    </div>
                    <hr />
                    <div className="field">
                        <label>Customer Next Reminder:</label>
                        <input type="date" name="extendReminder" value={data.extendReminder} onChange={onChangeHandler} min={new Date().toISOString().split("T")[0]} />
                    </div>
                    <hr />
                    <button
                        className="save-btn"
                        disabled={saving}
                        onClick={async () => {
                            if (savingRef.current) return; // instant block

                            savingRef.current = true; // lock immediately
                            setSaving(true);

                            try {
                                const isSuccess = await onSubmitHandler(item._id);
                                if (isSuccess) {
                                    await new Promise(resolve => setTimeout(resolve, 400));
                                    await removeReminder(item._id);
                                }
                            } finally {
                                savingRef.current = false; // unlock
                                setSaving(false);
                            }
                        }}
                    >
                        {saving ? "Saving..." : "Save & Changes"}
                    </button>
                    <hr />
                    <div className="field">
                        <label>Service Type</label>
                        <textarea rows="2" name="serviceType" value={bookingData.serviceType} onChange={onChangeBookingHandler} placeholder="Enter the type of service..."></textarea>
                    </div>

                    <hr />
                    <div className="field">
                        <label>Booking Date: (Required)</label>
                        <input type="date" name="bookingDate" value={bookingData.bookingDate} onChange={onChangeBookingHandler} min={new Date().toISOString().split("T")[0]} />
                    </div>
                    <hr />
                    <div className="field">
                        <select
                            onChange={(e) => setSelectedNumber(e.target.value)}
                            defaultValue=""
                        >
                            <option value="" disabled>
                                Select number
                            </option>

                            {item.mobile1 && (
                                <option value={item.mobile1}>Mobile 1 - {item.mobile1}</option>
                            )}
                            {item.mobile2 && (
                                <option value={item.mobile2}>Mobile 2 - {item.mobile2}</option>
                            )}
                        </select>

                        <img src={assets.whatsapp_icon} alt="whatsapp" className="whatsapp-icon"
                            onClick={() => {
                                if (!selectedNumber) {
                                    alert("Please select a number first");
                                    return;
                                }
                                handleAppointmentUpdatae(selectedNumber);
                            }}
                        />
                    </div>

                    <hr />
                    <div className="field">
                        <label>Customer Address</label>
                        <textarea rows="3" name="address" value={bookingData.address} onChange={onChangeBookingHandler} placeholder="Enter customer address..."></textarea>

                        <button className="save-service"
                            disabled={saving}
                            onClick={async () => {
                                if (savingRef.current) return;

                                savingRef.current = true;
                                setSaving(true);

                                try {
                                    const isBooking = await onSubmitBookingHandler(item._id);
                                    if (isBooking) {
                                        await new Promise(resolve => setTimeout(resolve, 400));
                                        await removeReminder(item._id);
                                    }
                                } finally {
                                    savingRef.current = false;
                                    setSaving(false);
                                }
                            }}
                        >
                            {saving ? "Booking..." : "Book Appointment"}
                        </button>
                    </div>

                    <hr />

                    <div className="field">
                        <label>Reason for Service Denial</label>
                        <textarea rows="3" placeholder="Enter reason..."></textarea>

                        <button className="service-denied" onClick={handleDeniedClick}>
                            Submit Denial
                        </button>
                    </div>

                    <hr />
                    <div className="field">
                        <p onClick={() => removeCustomer(item._id)} className="cursor"> Remove Reminder </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FullDetails_Reminder
