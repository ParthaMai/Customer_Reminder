import React from 'react'
import './Dob_wish.css'
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../../../assets/assets';
import { useParams, useNavigate } from 'react-router-dom';

const Dob_wish = ({ url }) => {

    const navigate = useNavigate();

    const { id: itemId } = useParams();

    const [selectedNumber, setSelectedNumber] = useState("");
    const [item, setItem] = useState({});

    const handleUpdate = (mobileNumber) => {
    if (!mobileNumber) {
        alert("No number selected");
        return;
    }

   const message = "Happy birthday to you! 🎂🎉🥳\nWishing you a wonderful day! From Radhamoni Mi Store 😊";



    const encodedMessage = encodeURIComponent(message);

    // Open WhatsApp chat with pre-filled message
    window.open(
        `https://wa.me/${mobileNumber}?text=${encodedMessage}`,
        "_blank"
    );
    };


    const fetchDobFullList = async () => {
        const response = await axios.get(`${url}/api/Birthday/full-list`, { params: { id: itemId } });
        if (response.data.success) {
            setItem(response.data.data);
        }
        else {
            toast.error("Error");
        }
    }

    useEffect(() => {
        fetchDobFullList()
    }, [])

    const removeDob = async (itemId) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this customer?");
        if (!isConfirmed) return;
        try {
            const response = await axios.post(`${url}/api/Birthday/delete`, { id: itemId });
            await fetchDobFullList();
            if (response.data.success) {
                toast.success(response.data.message);
                navigate("/dob_reminder", { replace: true });
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
        <div className="dob-full-list-container">

            <div className="dob-field-table">
                <div className="dob-field-table-format">
                    <p className="dob-field-card-title">Customer Details</p>
                    <div className="field">
                        <label>Image:</label>
                        <img src={item.image || assets.user_icon} alt="Customer" />
                    </div>
                    <hr />

                    <div className="field">
                        <label>Name:</label>
                        <p>{item.name}</p>
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
                    {item.age && (
                        <>
                            <div className="field">
                                <label>Age:</label>
                                <p>{item.age}</p>
                            </div>
                            <hr /></>
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
                        <label>Mobile Model:</label>
                        <p>{item.mobileModel}</p>
                    </div>
                    <hr />
                    <div className="field">
                        <label>Price:</label>
                        <p>₹{item.price}</p>
                    </div>
                    <hr />
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

                        <img src={assets.whatsapp_icon} alt="whatsapp" className="whatsapp-icon"
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
                    <div className="field">
                        <p onClick={() => removeDob(item._id)} className="cursor"> Complete Wishing </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dob_wish
