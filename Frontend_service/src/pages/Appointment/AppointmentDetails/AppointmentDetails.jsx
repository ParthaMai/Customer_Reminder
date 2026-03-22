import React, { useContext, useEffect, useRef, useState } from 'react'
import './AppointmentDetails.css'

import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom';
import { assets } from '../../../assets/assets';
import { StoreContext } from '../../../context/StoreContext';
import html2pdf from "html2pdf.js";
import Invoice from "./Invoice";

const AppointmentDetails = () => {
    const { token, url , setBookingCache} = useContext(StoreContext);
    const [totalPrice, setTotalPrice] = useState(0);
    const loadingRef = useRef(false);
    const [loading, setLoading] = useState(false);
    const [selectedNumber, setSelectedNumber] = useState("");
    const navigate = useNavigate();


    const { id: itemId } = useParams();// previous state item id like props
    const [item, setItem] = useState({});


    const invoiceRef = useRef();
    const scrollRef = useRef(null);




    const generatePdfBlob = async () => {
        const element = invoiceRef.current;

        await new Promise(resolve => setTimeout(resolve, 100));

        const opt = {
            margin: [10, 10, 10, 10],
            filename: `invoice-${item.name}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, logging: false },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        };

        // Generate PDF as Blob
        const pdfBlob = await html2pdf().set(opt).from(element).outputPdf("blob");
        const file = new File([pdfBlob], `invoice-${item.name}.pdf`, {
            type: "application/pdf",
        });

        return file;
    };

    // Share via navigator.share
    const shareInvoice = async () => {
        try {
            const file = await generatePdfBlob();

            if (navigator.share) {
                await navigator.share({
                    title: `Invoice - ${item.name}`,
                    text: "Here is your service invoice",
                    files: [file],
                });
            } else {
                toast.info("Sharing not supported on this device");
            }
        } catch (error) {
            console.error("Sharing failed:", error);
            toast.error("Failed to share invoice");
        }
    };

    // Download PDF
    const downloadInvoice = async () => {
        try {
            const file = await generatePdfBlob();
            const url = URL.createObjectURL(file);
            const a = document.createElement("a");
            a.href = url;
            a.download = `invoice-${item.name}.pdf`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed:", error);
            toast.error("Failed to download invoice");
        }
    };

    // const sendInvoice = async () => {
    //   const element = invoiceRef.current;

    //   // Wait a tick to ensure React renders
    //   await new Promise(resolve => setTimeout(resolve, 100));

    //  try {
    //     const opt = {
    //       margin: [10, 10, 10, 10], // Use array for Top, Left, Bottom, Right margins
    //       filename: `invoice-${item.name}.pdf`,
    //       image: { type: 'jpeg', quality: 0.98 },
    //       html2canvas: {
    //         scale: 2, // Scale 2 is standard for sharp A4, scale 3 makes file sizes very large
    //         useCORS: true,
    //         logging: false, // Turn off logging in production
    //       },
    //       jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    //     };

    //         // Generate PDF as Blob
    //     const pdfBlob = await html2pdf().set(opt).from(element).outputPdf("blob");

    //     const customerInfo = {
    //       name: item.name,
    //     };

    //     const file = new File([pdfBlob], `invoice-${customerInfo.name}.pdf`, {
    //       type: "application/pdf",
    //     });

    //     if (navigator.share) {
    //       // Mobile devices supporting Web Share API
    //       await navigator.share({
    //         title: `Invoice - ${customerInfo.name}`,
    //         text: "Here is your service invoice",
    //         files: [file],
    //       });
    //     } else {
    //       // Fallback for desktop or unsupported browsers: download
    //       const url = URL.createObjectURL(file);
    //       const a = document.createElement("a");
    //       a.href = url;
    //       a.download = `invoice-${customerInfo.name}.pdf`;
    //       a.click();
    //       URL.revokeObjectURL(url);
    //     }
    //   } catch (error) {
    //     console.error("PDF generation failed:", error);
    //   }
    // };





    // Submit Denied
    const handleDeniedClick = () => {
        toast.info("This feature is available in the premium plan. Please upgrade to continue.");
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
                toast.warning("Service date is required");
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
            else{
                toast.warning("Enter service Details");
                return false;
            }


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
                setBookingCache({})
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

    // For whatsapp  message
    const handleAMesseage = (mobileNumber) => {
        if (!mobileNumber) {
            alert("No number selected");
            return;
        }

        const message = `Hello ${item.name}, 😊\nHere is your invoice – you can check and download it anytime⬇️. \nThank you for choosing our service!`;



        const encodedMessage = encodeURIComponent(message);

        // Open WhatsApp chat with pre-filled message
        window.open(
            `https://wa.me/${mobileNumber}?text=${encodedMessage}`,
            "_blank"
        );
    };

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

    // Block to start
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, []);

    return (
        <div className="appointment-fulldetails-list-container">
            <div className="appointment-fulldetails-table">

                <div className="appointment-fulldetails-format" ref={scrollRef}>
                    <p className="appointment-fulldetails-title">Customer Data</p>

                    <div className="field">
                        <label>Image:</label>
                        <img src={assets.user_icon} alt="Customer" />
                    </div>

                    <hr />
                    <div className="field">
                        <label>Appointment Date :</label>
                        <p>
                            {item.create
                                ? new Date(item.create).toISOString().split("T")[0]
                                : "N/A"}
                        </p>
                    </div>
                    <hr />
                    <div className="field">
                        <label>Service Type: </label>
                        <p>{item.serviceType || "-"}</p>
                    </div>
                    <hr />
                    <div className="field">
                        <label>Customer Address: </label>
                        <p>{item.address || "-"}</p>
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
                    <div className="field invoice">
                        <label>Send invoice and save this record</label>
                    </div>
                    <div className="Service-Date">
                        <p className="appointment-fulldetails-title">Servicing Date(Required)</p>
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
                                    toast.info("Please select a number first");
                                    return;
                                }
                                handleAMesseage(selectedNumber);
                            }}
                        />
                    </div>
                    <hr />
                    <div className="field share-field">
                        <button
                            className="share-button"
                            onClick={() => shareInvoice()}
                            title="Share Invoice via WhatsApp"
                        >
                            Share
                        </button>
                        <img
                            src={assets.download_icon}
                            alt="Share Icon"
                            className="share-icon-outside"
                            onClick={() => downloadInvoice()}
                            title="Share Invoice"
                        />
                    </div>
                    <hr />
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

                                // This is for calculate Earning per week
                                if (isSuccess) {
                                    await axios.post(`${url}/api/service_Customer/booking-complete`, {
                                        id: itemId
                                    }, {
                                        headers: { token }
                                    });
                                }

                                //This is for Calculate total monthly earning
                                if (isSuccess) {
                                    await axios.post(`${url}/api/totalEarning/Total-Earning`, {
                                        totalPrice: totalPrice,
                                        serviceDate: data.serviceDate,
                                        userId: item.userId
                                    }, {
                                        headers: { token }
                                    });
                                }

                                if (isSuccess) {
                                    // optional delay (like your save button)
                                    await new Promise(resolve => setTimeout(resolve, 400));
                                    await removeBooking(itemId);
                                }

                            } finally {
                                loadingRef.current = false; // unlock
                                setLoading(false);
                            }
                        }}
                    >
                        {loading ? <div className="loader"></div> : "Submit"}
                    </button>

                    <hr />
                    <div className="field">
                        <label>Reason for Service Denial</label>
                        <textarea rows="3" placeholder="Enter reason..."></textarea>

                        <button className="service-denied" onClick={handleDeniedClick}>
                            Submit Denial
                        </button>
                    </div>
                    <hr />
                    {/* Hidden Invoice for PDF */}
                    <div style={{ width: "190mm", padding: "10mm", background: "white" }} ref={invoiceRef}>
                        <Invoice
                            customerInfo={{
                                name: item.name,
                                address: item.address,
                                contact: item.mobile1,
                                serviceDate: data.serviceDate,
                                shopContact: "+91 9123456780",
                            }}
                            items={data.services.map(s => ({ name: s.description, price: Number(s.price) }))}
                        />
                    </div>




                </div>

            </div>

        </div>
    )
}

export default AppointmentDetails
