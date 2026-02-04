import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useLocation } from "react-router-dom";
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../../../assets/assets';
import './FullList_Emi.css'
import { useNavigate } from "react-router-dom";

const FullList_Emi = ({url}) => {

    // const url = "http://192.168.1.8:4000"
    const navigate = useNavigate();

    const location = useLocation();
    const itemId = location.state?.id; // previous state item id like props


    const [item, setItem] = useState([]);

    const fetchFullList = async () => {
        const response = await axios.get(`${url}/api/emi/fullList`, { params: { id: itemId } });
        if (response.data.success) {
            setItem(response.data.data);
        }
        else {
            toast.error("Error");
        }
    }

    useEffect(() => {
        fetchFullList()
    }, [])

    const removeCustomer = async (itemId) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this customer?");
        if (!isConfirmed) return;
        try{
        const response = await axios.post(`${url}/api/emi/remove`, { id: itemId });
        await fetchFullList();
        if (response.data.success) {
            toast.success(response.data.message);
            navigate("/list_EMI");
        }
        else {
            toast.error("Error")
        }
    }catch(error){
        toast.error("Server error");
        console.error(error);
    }
    }
    return (
        <div className="full-list-container">

            <div className="field-table">
                <div className="field-table-format">
                    <p className="field-card-title">EMI Customer Data</p>
                    <div className="field">
                        <label>Image:</label>
                        <img src={`${url}/image/${item.image}`} alt="Customer" />
                    </div>
                    <hr />

                    <div className="field">
                        <label>Name:</label>
                        <p>{item.name}</p>
                    </div>
                    <hr />

                    <div className="field">
                        <label>Form No:</label>
                        <p>{item.formNo}</p>
                    </div>
                    <hr />

                    <div className="field">
                        <label>Purchase Date:</label>
                        <p>{item.purchaseDate ? new Date(item.purchaseDate).toISOString().split("T")[0] : "-"}</p>
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
                    {item.mobile3 && (
                        <>
                            <div className="field">
                                <label>Mobile3:</label>
                                <p>{item.mobile3}</p>
                            </div>
                            <hr />
                        </>
                    )}
                    {item.mobile4 && (
                        <>
                            <div className="field">
                                <label>Mobile4:</label>
                                <p>{item.mobile4}</p>
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
                    {item.fatherName && (
                        <>
                            <div className="field">
                                <label>Father Name:</label>
                                <p>{item.fatherName}</p>
                            </div>
                            <hr /></>
                    )}
                    {item.aadhar && (
                        <>
                            <div className="field">
                                <label>Aadhar:</label>
                                <p>{item.aadhar}</p>
                            </div>
                            <hr /></>
                    )}
                    {item.voterId && (
                        <>
                            <div className="field">
                                <label>Voter ID:</label>
                                <p>{item.voterId}</p>
                            </div>
                            <hr /></>
                    )}
                    {item.age && (
                        <>
                            <div className="field">
                                <label>Age:</label>
                                <p>{item.age}</p>
                            </div>
                            <hr /></>
                    )}
                    {item.pan && (
                        <>
                            <div className="field">
                                <label>PAN:</label>
                                <p>{item.pan}</p>
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
                    {item.cibil && (
                        <>
                            <div className="field">
                                <label>CIBIL:</label>
                                <p>{item.cibil}</p>
                            </div>
                            <hr /></>
                    )}
                    {item.pinCode && (
                        <>
                            <div className="field">
                                <label>Pin Code:</label>
                                <p>{item.pinCode}</p>
                            </div>
                            <hr /></>
                    )}
                    {item.qualification && (
                        <>
                            <div className="field">
                                <label>Qualification:</label>
                                <p>{item.qualification}</p>
                            </div>
                            <hr /></>
                    )}
                    {item.occupation && (
                        <>
                            <div className="field">
                                <label>Occupation:</label>
                                <p>{item.occupation}</p>
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
                    <div className="field">
                        <label>EMI Charges:</label>
                        <p>₹{item.emiCharges}</p>
                    </div>
                    <hr />
                    <div className="field">
                        <label>EMI Tenure:</label>
                        <p>{item.emiTenure}</p>
                    </div>
                    <hr />
                    <div className="field">
                        <label>Failed EMI:</label>
                        <p>{item.failedEmi}</p>
                    </div>
                    <hr />
                    <div className="field">
                        <label>Reminder Period:</label>
                        <p>{item.reminderPeriod}</p>
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
                                <label>Summary :</label>
                                <p>{item.summary}</p>
                            </div>
                            <hr /></>
                    )}
                    <div className="field">
                        <img
                            src={assets.edit_icon}
                            alt="edit"
                            className="edit-icon"
                            onClick={() => handleUpdate(item._id)}
                        />
                        <p onClick={() => removeCustomer(item._id)} className="cursor"> Delete </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FullList_Emi