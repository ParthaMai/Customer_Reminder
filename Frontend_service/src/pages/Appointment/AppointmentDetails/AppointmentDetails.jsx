import React, { useContext, useEffect, useRef, useState } from 'react'
import './AppointmentDetails.css'

import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom';
import { assets } from '../../../assets/assets';
import { StoreContext } from '../../../context/StoreContext';
import html2pdf from "html2pdf.js";

const AppointmentDetails = () => {
    const { token, url } = useContext(StoreContext);
    const [totalPrice, setTotalPrice] = useState(0);
    const loadingRef = useRef(false);
    const [loading, setLoading] = useState(false);
    const [selectedNumber, setSelectedNumber] = useState("");


    const [saving, setSaving] = useState(false);
    const { id: itemId } = useParams();// previous state item id like props
    const [item, setItem] = useState({});



    const sendInvoice = async () => {

        try {

            const element = document.getElementById("invoice");

            const opt = {
                margin: 10,
                html2canvas: { scale: 3 },
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
            };

            const pdfBlob = await html2pdf()
                .set(opt)
                .from(element)
                .outputPdf("blob");

            const file = new File([pdfBlob], `invoice-${item.name}.pdf`, {
                type: "application/pdf"
            });

            if (navigator.share) {

                await navigator.share({
                    title: "Service Invoice",
                    text: "Invoice for your service",
                    files: [file]
                });

            } else {

                alert("Your browser does not support file sharing.");

            }

        } catch (error) {

            console.error("Sharing failed:", error);
            alert("Sharing failed on this device.");

        }
    };
    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    const handleServiceChange = (index, field, value) => {
        const updatedServices = [...data.services];
        updatedServices[index][field] = value;

        setData(prev => ({
            ...prev,
            services: updatedServices
        }));
    };
    // Add new service row
    const addService = () => {
        setData(prev => ({
            ...prev,
            services: [...prev.services, { description: "", price: "" }]
        }));
    };
    // Remove service row (optional)
    const removeService = (index) => {
        const updatedServices = data.services.filter((_, i) => i !== index);

        setData(prev => ({
            ...prev,
            services: updatedServices
        }));
    };;

    const [data, setData] = useState({
        serviceDate: "",
        services: [
            {
                description: "",
                price: ""
            }
        ],
        totalPrice: "",
        reminderPeriod: ""
    });


    // add data to database
const onSubmitHandler = async (id) => {
    try {
        const validServices = data.services.filter(
            (s) => s.description && s.price
        );

        const payload = {
            _id: id,
            totalPrice: totalPrice
        };
    if (!data.serviceDate) {
        toast.error("Service date is required");
        return false;
    }
        // ✅ Only send if filled
        if (data.serviceDate) {
            payload.serviceDate = data.serviceDate;
        }

        if (data.reminderPeriod) {
            payload.reminderPeriod = data.reminderPeriod;
        }

        if (validServices.length > 0) {
            payload.services = validServices;
        }

        console.log("PAYLOAD:", payload);

        const response = await axios.put(
            `${url}/api/booking/Booking-update`,
            payload,
            { headers: { token } }
        );

        if (response.data.success) {
            setData({
                serviceDate: "",
                services: [{ description: "", price: "" }],
                reminderPeriod: ""
            });

            toast.success(response.data.message);
            return true;
        } else {
            toast.error(response.data.message);
            return false;
        }

    } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
        return false;
    }
};
    // Remove booking
        const removeBooking = async (itemId) => {
        try {
            const response = await axios.post(`${url}/api/booking/Booking-remove`, { id: itemId }, { headers: { token } });
            await fetchFullList();
            if (response.data.success) {
                toast.success("Complete Appointment");
                navigate("/appointment", { replace: true });
            }
            else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Server error");
            console.error(error);
        }
    }

    const fetchFullList = async () => {
        const response = await axios.get(`${url}/api/booking/Booking-FullDetails`, { params: { id: itemId }, headers: { token } });
        if (response.data.success) {
            setItem(response.data.data);
        }
        else {
            toast.error("Error");
        }
    }
    useEffect(() => {
        const total = data.services.reduce((sum, service) => {
            return sum + Number(service.price || 0);
        }, 0);

        setTotalPrice(total);
    }, [data.services]);

    useEffect(() => {
        if (!token) return;
        fetchFullList()
    }, [token])


    return (
        <div className="appointment-fulldetails-list-container">

            <div className="appointment-fulldetails-table">

                <div className="appointment-fulldetails-format">
                    <p className="appointment-fulldetails-title">Customer Data</p>

                    <div className="field">
                        <label>Image:</label>
                        <img src={assets.user_icon} alt="Customer" />
                    </div>

                    <hr />

                    <div className="field">
                        <label>Name:</label>
                        <p>{item.name}</p>
                    </div>

                    <hr />

                    <div className="field">
                        <label>Mobile No:</label>
                        <p>{item.mobile1 || "-"}</p>
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
                    <div className="field">
                        <label>Services:</label>
                        <p>
                            {item.services
                                ?.map(service => `${service.description} — ₹${service.price}`)
                                .join(", ")}
                        </p>
                    </div>
                    <hr />
                     <div className="Service-Date">
                        <p className="appointment-fulldetails-title">Service Date(Required)</p>
                        <input name="serviceDate" value={data.serviceDate} onChange={onChangeHandler} type="date" required />
                    </div>
                    <hr />
                    <div className="appointment-fulldetails-services">
                        <p className="appointment-fulldetails-title">Service Details (Required)</p>

                        {data.services.map((service, index) => (
                            <div key={index} className="appointment-fulldetails-service-row">

                                <label>Service {index + 1}</label>

                                {/* Service Description */}
                                <textarea
                                    value={service.description}
                                    onChange={(e) =>
                                        handleServiceChange(index, "description", e.target.value)
                                    }
                                    rows="2"
                                    placeholder="Write service details..."
                                    className="appointment-fulldetails-service-description"
                                />

                                {/* Service Price */}
                                <input
                                    type="number"
                                    value={service.price}
                                    onChange={(e) =>
                                        handleServiceChange(index, "price", Number(e.target.value))
                                    }
                                    placeholder="Enter service price"
                                    className="appointment-fulldetails-service-price"
                                />

                                {data.services.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeService(index)}
                                        className="appointment-fulldetails-remove-btn"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addService}
                            className="appointment-fulldetails-add-btn"
                        >
                            Add +
                        </button>
                    </div>

                    <div className="appointment-fulldetails-total-price">
                        <p>Total Price</p>
                        <input type="number" value={totalPrice} readOnly />
                    </div>
                    <div className="appointment-invoice" id="invoice">

                        <h2>Your Shop Name</h2>

                        <p><strong>Customer:</strong> {item.name}</p>
                        <p><strong>Date:</strong> {data.serviceDate}</p>

                        <table className="invoice-table">
                            <thead>
                                <tr>
                                    <th>Service</th>
                                    <th>Price</th>
                                </tr>
                            </thead>

                            <tbody>
                                {data.services.map((service, index) => (
                                    <tr key={index}>
                                        <td>{service.description}</td>
                                        <td>₹{service.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <h3>Total: ₹{totalPrice}</h3>

                    </div>
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
                                sendInvoice();
                            }}
                        />
                    </div>
                    <div className="appointment-fulldetails-reminder flex-col">
                        <p>Reminder Period</p>
                        <select name="reminderPeriod" value={data.reminderPeriod} onChange={onChangeHandler} required>
                            <option value={item.reminderPeriod}>{item.reminderPeriod}</option>
                            <option value="6">6 Months</option>
                            <option value="9">9 Months</option>
                            <option value="11">11 Months</option>
                            <option value="12">1 Year</option>
                            <option value="24">2 Years</option>
                        </select>
                    </div>
                    <hr />
                    <button
                        type="button"
                        className="apppointment add-btn"
                        disabled={loading}
                        onClick={async () => {
                            if (loadingRef.current) return; // instant block

                            loadingRef.current = true; // lock immediately
                            setLoading(true);

                            try {
                                const isSuccess = await onSubmitHandler(itemId); // your submit function

                                if (isSuccess) {
                                    await axios.post(`${url}/api/service_Customer/booking-complete`, {
                                        id: itemId
                                    }, {
                                        headers: { token }
                                    });
                                }
                                if (isSuccess) {
                                    // optional delay (like your save button)
                                    await new Promise(resolve => setTimeout(resolve, 400));
                                    // await removeBooking(itemId);
                                }

                            } finally {
                                loadingRef.current = false; // unlock
                                setLoading(false);
                            }
                        }}
                    >
                        {loading ? <div className="loader"></div> : "Submit"}
                    </button>

                    <div className="field">
                        <label>If Customer Denied service</label>
                    </div>
                    <hr />
                    <div className="field">
                        <label>Reason for Service Denial</label>
                        <textarea rows="3" placeholder="Enter reason..."></textarea>

                        <button className="service-denied">
                            Submit Denial
                        </button>
                    </div>




                </div>

            </div>

        </div>
    )
}

export default AppointmentDetails
