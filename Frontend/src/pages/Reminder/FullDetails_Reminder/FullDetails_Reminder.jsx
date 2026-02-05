import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useLocation } from "react-router-dom";
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../../../assets/assets';
import './FullDetails_Reminder.css'
import { useNavigate } from "react-router-dom";
import { useRef } from 'react';

const FullDetails_Reminder = ({ url }) => {
    const navigate = useNavigate();

    const [data, setData] = useState({
        summary: "",
        extendReminder: ""
    })
    const savingRef = useRef(false);  
    const [saving, setSaving] = useState(false);

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
                toast.error("Please fill at least one field");
                return false;
            }

            payload._id = id;

            const response = await axios.post( `${url}/api/emi/extend-reminder`,payload);

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


    const location = useLocation();
    const itemId = location.state?.id; // previous state item id like props

    const [selectedNumber, setSelectedNumber] = useState("");
    const [item, setItem] = useState([]);

    // const [reminderDate, setReminderDate] = useState("");
    // const [summary, setSummary] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [audioURL, setAudioURL] = useState(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const startRecording = async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert("Audio recording is not supported in this browser.");
            return;
        }
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
            const url = URL.createObjectURL(audioBlob);
            setAudioURL(url);
        };

        mediaRecorder.start();
        setIsRecording(true);

        // Auto stop after 60 seconds
        setTimeout(() => {
            if (mediaRecorder.state === "recording") {
                mediaRecorder.stop();
                setIsRecording(false);
            }
        }, 60000);
    };

    const stopRecording = () => {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
    };



    const handleUpdate = (mobileNumber) => {
        if (!mobileNumber) {
            alert("No number selected");
            return;
        }

        window.location.href = `tel:${mobileNumber}`;
    };


    const fetchFullList = async () => {
        const response = await axios.get(`${url}/api/reminder-list/fullDetails`, { params: { id: itemId } });
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
        const isConfirmed = window.confirm("Are you sure Complete your Reminder task?");
        if (!isConfirmed) return;
        try {
            const response = await axios.post(`${url}/api/reminder-list/remove-reminder`, { id: itemId });
            await fetchFullList();
            if (response.data.success) {
                toast.success(response.data.message);
                navigate("/reminder");
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
            const response = await axios.post(`${url}/api/reminder-list/remove-reminder`, { id: itemId });
            await fetchFullList();
            if (response.data.success) {
                toast.success("Removed Customer From Reminder");
                navigate("/reminder");
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
                    <p className="remind-field-card-title">EMI Customer Data</p>
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
                            {item.mobile3 && (
                                <option value={item.mobile3}>Mobile 3 - {item.mobile3}</option>
                            )}
                            {item.mobile4 && (
                                <option value={item.mobile4}>Mobile 4 - {item.mobile4}</option>
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
                    {/* Voice recorder */}
                    <div className="field">
                        <button onClick={startRecording} disabled={isRecording}>
                            🎤 Start Recording
                        </button>

                        <button onClick={stopRecording} disabled={!isRecording}>
                            ⏹ Stop
                        </button>

                        {audioURL && (
                            <audio controls src={audioURL}></audio>
                        )}
                    </div>
                    <hr />
                    <div className="field">
                        <label>Customer Reminder:</label>
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
                                    await new Promise(resolve => setTimeout(resolve, 500));
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
                        <p onClick={() => removeCustomer(item._id)} className="cursor"> Remove Reminder </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FullDetails_Reminder
