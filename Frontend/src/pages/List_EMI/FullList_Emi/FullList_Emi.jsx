import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../../../assets/assets';
import './FullList_Emi.css'
import { useNavigate, useParams } from "react-router-dom";

const FullList_Emi = ({ url }) => {

    // const url = "http://192.168.1.8:4000"
    const navigate = useNavigate();

    const { id: itemId } = useParams(); // previous state item id like props


    const [item, setItem] = useState([]);

    // For editing
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});

    const handleUpdate = (id) => {
        setEditData(item);
        setIsEditing(true);
    };

    const submitUpdate = async () => {
    try {
        const response = await axios.put(`${url}/api/emi/update`, editData);
        if(response.data.success){
            toast.success("Updated successfully");
            setIsEditing(false);
            fetchFullList();
        } else {
            toast.error("Update failed");
        }
    } catch (error) {
        toast.error("Server error");
        console.error(error);
    }
    };


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
        try {
            const response = await axios.post(`${url}/api/emi/remove`, { id: itemId });
            await fetchFullList();
            if (response.data.success) {
                toast.success(response.data.message);
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
        <div className="full-list-container">

            <div className="field-table">
                <div className="field-table-format">
                    <p className="field-card-title">EMI Customer Data</p>
                    <div className="field">
                        <label>Image:</label>
                        <img src={item.image || assets.user_icon} alt="Customer" />
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
                        <label>Form No:</label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={editData.formNo || ""}
                                onChange={e => setEditData({ ...editData, formNo: e.target.value })}
                            />
                        ) : (
                            <p>{item.formNo}</p>
                        )}
                    </div>
                    <hr />

                    <div className="field">
                        <label>Purchase Date:</label>
                        {isEditing ? (
                            <input
                                type="date"
                                value={editData.purchaseDate ? new Date(editData.purchaseDate).toISOString().split("T")[0] : ""}
                                onChange={e => setEditData({ ...editData, purchaseDate: e.target.value })}
                            />
                        ) : (
                            <p>{item.purchaseDate ? new Date(item.purchaseDate).toISOString().split("T")[0] : "-"}</p>
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
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editData.fatherName || ""}
                                        onChange={e => setEditData({ ...editData, fatherName: e.target.value })}
                                    />
                                ) : (
                                    <p>{item.fatherName}</p>
                                )}
                            </div>
                            <hr /></>
                    )}
                    {item.aadhar && (
                        <>
                            <div className="field">
                                <label>Aadhar:</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editData.aadhar || ""}
                                        onChange={e => setEditData({ ...editData, aadhar: e.target.value })}
                                    />
                                ) : (
                                    <p>{item.aadhar}</p>
                                )}
                            </div>
                            <hr /></>
                    )}
                    {item.voterId && (
                        <>
                            <div className="field">
                                <label>Voter ID:</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editData.voterId || ""}
                                        onChange={e => setEditData({ ...editData, voterId: e.target.value })}
                                    />
                                ) : (
                                    <p>{item.voterId}</p>
                                )}
                            </div>
                            <hr /></>
                    )}
                    {item.age && (
                        <>
                            <div className="field">
                                <label>Age:</label>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={editData.age || ""}
                                        onChange={e => setEditData({ ...editData, age: e.target.value })}
                                    />
                                ) : (
                                    <p>{item.age}</p>
                                )}
                            </div>
                            <hr /></>
                    )}
                    {item.pan && (
                        <>
                            <div className="field">
                                <label>PAN:</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editData.pan || ""}
                                        onChange={e => setEditData({ ...editData, pan: e.target.value })}
                                    />
                                ) : (
                                    <p>{item.pan}</p>
                                )}
                            </div>
                            <hr /></>
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
                    {item.cibil && (
                        <>
                            <div className="field">
                                <label>CIBIL:</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editData.cibil || ""}
                                        onChange={e => setEditData({ ...editData, cibil: e.target.value })}
                                    />
                                ) : (
                                    <p>{item.cibil}</p>
                                )}
                            </div>
                            <hr /></>
                    )}
                    {item.pinCode && (
                        <>
                            <div className="field">
                                <label>Pin Code:</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editData.pinCode || ""}
                                        onChange={e => setEditData({ ...editData, pinCode: e.target.value })}
                                    />
                                ) : (
                                    <p>{item.pinCode}</p>
                                )}
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
                        {isEditing ? (
                            <input
                                type="text"
                                value={editData.mobileModel || ""}
                                onChange={e => setEditData({ ...editData, mobileModel: e.target.value })}
                            />
                        ) : (
                            <p>{item.mobileModel}</p>
                        )}
                    </div>
                    <hr />
                    <div className="field">
                        <label>Price:</label>
                        {isEditing ? (
                            <input
                                type="number"
                                value={editData.price || ""}
                                onChange={e => setEditData({ ...editData, price: e.target.value })}
                            />
                        ) : (
                            <p>₹{item.price}</p>
                        )}
                    </div>
                    <hr />
                    <div className="field">
                        <label>EMI Charges:</label>
                        {isEditing ? (
                            <input
                                type="number"
                                value={editData.emiCharges || ""}
                                onChange={e => setEditData({ ...editData, emiCharges: e.target.value })}
                            />
                        ) : (
                            <p>₹{item.emiCharges}</p>
                        )}
                    </div>
                    <hr />
                    <div className="field">
                        <label>EMI Tenure:</label>
                        {isEditing ? (
                            <input
                                type="number"
                                value={editData.emiTenure || ""}
                                onChange={e => setEditData({ ...editData, emiTenure: e.target.value })}
                            />
                        ) : (
                            <p>{item.emiTenure}</p>
                        )}
                    </div>
                    <hr />
                    <div className="field">
                        <label>Failed EMI:</label>
                        {isEditing ? (
                            <input
                                type="number"
                                value={editData.failedEmi || ""}
                                onChange={e => setEditData({ ...editData, failedEmi: e.target.value })}
                            />
                        ) : (
                            <p>{item.failedEmi}</p>
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
                            <p>{item.reminderPeriod}</p>
                        )}
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