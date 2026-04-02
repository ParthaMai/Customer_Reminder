
import React, { useContext, useEffect, useRef, useState } from 'react'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../../assets/assets';
import html2pdf from "html2pdf.js";
import Invoice from '../Appointment/AppointmentDetails/Invoice';


const AddSale = () => {
    const { token, url } = useContext(StoreContext);
    const [totalPrice, setTotalPrice] = useState(0);
    const [data, setData] = useState({
        _id: null,
        name: "",
        mobile1: "",
        mobile2: "",
        description: "",
        dob: "",
        serviceCategory: "",
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

    const [mobileStatus, setMobileStatus] = useState(null);
    const [item, setItem] = useState(null);
    const [selectedNumber, setSelectedNumber] = useState("");
    const [loading, setLoading] = useState(false);

    const invoiceRef = useRef();
    const scrollRef = useRef(null);


    const generatePdfBlob = async () => {
        const element = invoiceRef.current;

        await new Promise(resolve => setTimeout(resolve, 100));

        const opt = {
            margin: [10, 10, 10, 10],
            filename: `invoice-${customerData.name || "customer"}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, logging: false },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        };

        // Generate PDF as Blob
        const pdfBlob = await html2pdf().set(opt).from(element).outputPdf("blob");
        const file = new File([pdfBlob], `invoice-${customerData.name}.pdf`, {
            type: "application/pdf",
        });

        return file;
    };


    //  For mobile
    useEffect(() => {
        const delay = setTimeout(async () => {

            if (data.mobile1.length !== 10) {
                setMobileStatus(null);
                setItem(null);
                return;
            }

            try {
                const res = await axios.get(`${url}/api/service_Customer/check-mobileNo`, { params: { mobile: data.mobile1 }, headers: { token } }
                );

                if (res.data.exists) {
                    setMobileStatus("exists");
                    setItem(res.data.customer); // full data
                } else {
                    setMobileStatus("new");
                    setItem(null);
                }

            } catch (err) {
                console.log(err);
                setMobileStatus(null);
            }

        }, 300);

        return () => clearTimeout(delay);

    }, [data.mobile1]);
    const handleServiceChange = (index, field, value) => {
        const updatedServices = [...data.services];
        updatedServices[index][field] = value;

        setData(prev => ({ ...prev, services: updatedServices }));
    };

    // Share via navigator.share
    const shareInvoice = async () => {
        try {
            const file = await generatePdfBlob();

            if (navigator.share) {
                await navigator.share({
                    title: `Invoice - ${customerData.name || "Customer"}`,
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
            a.download = `invoice-${customerData.name}.pdf`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed:", error);
            toast.error("Failed to download invoice");
        }
    };
    // For whatsapp  message
    const handleAMesseage = (mobileNumber) => {
        if (!mobileNumber) {
            alert("No number selected");
            return;
        }

        const message = `Hello ${customerData.name || "Customer"}, 😊\nHere is your invoice – you can check and download it anytime⬇️. \nThank you for choosing our service!`;



        const encodedMessage = encodeURIComponent(message);

        // Open WhatsApp chat with pre-filled message
        window.open(
            `https://wa.me/${mobileNumber}?text=${encodedMessage}`,
            "_blank"
        );
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
    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!data.serviceDate) {
            toast.warning("Please select booking date");
            return;
        }

        try {
            setLoading(true);
            const validServices = data.services.filter(s => s.description && s.price);

            if (!validServices.length) {
                toast.warning("Enter service details");
                return;
            }
            // ✅ EXISTING CUSTOMER → UPDATE BOOKING
            if (mobileStatus === "exists" && item) {

                // 🔥 SAME CATEGORY → UPDATE BOOKING
                if (item.serviceCategory === data.serviceCategory) {
                    // ✅ EXISTING CUSTOMER
                    const payload = {
                        _id: data._id,
                        totalPrice,
                        serviceDate: data.serviceDate,
                        reminderPeriod: data.reminderPeriod,
                        serviceCategory: data.serviceCategory,
                        serviceHistory: [
                            {
                                serviceDate: data.serviceDate,
                                services: validServices,
                                totalPrice
                            }
                        ]
                    };

                    const res = await axios.put(`${url}/api/booking/Booking-update`, payload, { headers: { token } });

                    if (res.data.success) {
                        // reset services only
                        setData(prev => ({
                            ...prev,
                            services: [{ description: "", price: "" }],
                            serviceDate: "",
                            reminderPeriod: ""
                        }));


                        toast.success(res.data.message);
                    } else {
                        toast.error(res.data.message);
                        return false;
                    }
                }
                else {

                    // 🔥 DIFFERENT CATEGORY → CREATE NEW CUSTOMER + INVOICE
                    const payload = {
                        ...data,
                        serviceHistory: [
                            {
                                serviceDate: data.serviceDate,
                                services: validServices,
                                totalPrice
                            }
                        ]
                    };

                    const res = await axios.post(`${url}/api/service_Customer/add-NewCustomer`, payload, { headers: { token } });

                    if (res.data.success) {
                        toast.success("Customer + Invoice created");
                    } else {
                        toast.error(res.data.message);
                    }
                }

            }

            // ✅ NEW CUSTOMER → CREATE + BOOKING
            else {

                const payload = {
                    ...data,
                    serviceHistory: [
                        {
                            serviceDate: data.serviceDate,
                            services: validServices,
                            totalPrice
                        }
                    ]
                };

                const res = await axios.post(
                    `${url}/api/service_Customer/add-NewCustomer`, payload, { headers: { token } }
                );

                if (res.data.success) {
                    toast.success("Customer + inovice created");
                } else {
                    toast.error(res.data.message);
                }
            }

            setData({
                name: "",
                mobile1: "",
                mobile2: "",
                description: "",
                dob: "",
                serviceCategory: "",
                serviceDate: "",
                services: [{ description: "", price: "" }],
                reminderPeriod: "",
                _id: null
            });

            setSelectedNumber("");
            setMobileStatus(null);
            setItem(null);

        } catch (err) {
            console.log(err);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };
    // For autofill the name
    useEffect(() => {
        if (mobileStatus === "exists" && item) {
            setData((prev) => ({
                ...prev,
                name: item.name || "",
                _id: item._id,
                reminderPeriod: item.reminderPeriod || ""
            }));
        } else if (mobileStatus === "new") {
            setData((prev) => ({
                ...prev,
                name: ""
            }));
        }
    }, [mobileStatus, item]);
    useEffect(() => {
        const total = data.services.reduce((sum, service) => {
            return sum + Number(service.price || 0);
        }, 0);

        setTotalPrice(total);
    }, [data.services]);

    const customerData = item || data;
    return (
        <div className='ba-container'>
            <form className='ba-form' onSubmit={handleSubmit}>

                {/* ================= MOBILE ================= */}
                <div className="ba-mobile">
                    <p>Mobile No. (Required)</p>

                    <input name="mobile1" value={data.mobile1} onChange={onChangeHandler} type="tel" maxLength="10" placeholder="(Required)" required />

                    <input name="mobile2" value={data.mobile2} onChange={onChangeHandler} type="tel" maxLength="10" placeholder="(Optional)" />

                    <div className="ba-mobile-status">
                        {mobileStatus === "exists" && (
                            <p className="exists">⚠️ Regular Customer</p>
                        )}
                        {mobileStatus === "new" && (
                            <p className="new">✅ New customer</p>
                        )}
                    </div>
                </div>

                {/* ================= DESCRIPTION ================= */}
                <div className="ba-description">
                    <p>Mobile No. information (Optional)</p>
                    <textarea name="description" value={data.description} onChange={onChangeHandler} rows="2" placeholder='Write Customer MobNo. info.' />
                </div>

                {/* ================= NAME ================= */}
                <div className="ba-name">
                    <p>Name (Required)</p>
                    <input
                        onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='Type Here (Required)'
                        required
                    />
                </div>

                {/* ================= DOB ================= */}
                <div className="ba-dob">
                    <p>Date of Birth (Optional)</p>
                    <input type="date" name="dob" value={data.dob} onChange={onChangeHandler} />
                </div>

                {/* ================= SERVICE CATEGORY ================= */}
                <select name='serviceCategory' value={data.serviceCategory} onChange={onChangeHandler} required
                >
                    <option value="">Select Service Type</option>
                    <option value="RO">RO</option>
                    <option value="Chimney">Chimney</option>
                    <option value="AC">AC</option>
                </select>
                {/* ================= BOOKING SECTION ================= */}
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
                                required
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
                                required
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

                        {customerData.mobile1 && (
                            <option value={customerData.mobile1}>Mobile 1 - {customerData.mobile1}</option>
                        )}
                        {customerData.mobile2 && (
                            <option value={customerData.mobile2}>Mobile 2 - {customerData.mobile2}</option>
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
                        type="button"
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
                        <option value="">Select Reminder</option>
                        <option value="6">6 Months</option>
                        <option value="9">9 Months</option>
                        <option value="11">11 Months</option>
                        <option value="12">12 Months</option>
                        <option value="15">15 Months</option>
                        <option value="24">2 Years</option>
                    </select>
                </div>
                <hr />
                <button type="submit" className="ba-book-btn" disabled={loading}>
                    {loading ? <div className="loader"></div> : "Submit"}
                </button>
                <hr />
                {/* Hidden Invoice for PDF */}
                <div style={{ width: "190mm", padding: "10mm", background: "white" }} ref={invoiceRef}>
                    <Invoice
                        customerInfo={{
                            name: customerData.name || "",
                            address: customerData.address || "",
                            contact: customerData.mobile1 || "",
                            serviceDate: data.serviceDate,
                            shopContact: "+91 9123456780",
                        }}
                        items={data.services.map(s => ({
                            name: s.description,
                            price: Number(s.price)
                        }))}
                    />
                </div>


            </form>
        </div>
    );
}

export default AddSale
