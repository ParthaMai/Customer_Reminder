import React, { useContext, useEffect, useRef, useState } from 'react'
import "./BookingAppointment.css"
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../../assets/assets';

const BookingAppointment = () => {

    const { token, url } = useContext(StoreContext);
    const [data, setData] = useState({
        name: "",
        mobile1: "",
        mobile2: "",
        description: "",
        dob: "",
        serviceCategory: "" 
    });

const [mobileStatus, setMobileStatus] = useState(null);
const [item, setItem] = useState([]);
const [selectedNumber, setSelectedNumber] = useState("");
    const savingRef = useRef(false);

const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(false);
    const [bookingData, setBookingData] = useState({
        serviceType: "",
        address: "",
        bookingDate: ""
    });

//  For mobile
     useEffect(() => {
        const delay = setTimeout(async () => {

            if (data.mobile1.length !== 10) {
                setMobileStatus(null);
                setItem(null);
                return;
            }

            try {
                const res = await axios.get(`${url}/api/service_Customer/check-mobileNo`, { params: { mobile: data.mobile1 }, headers: { token }  }
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
    
    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }
    const onChangeBookingHandler = (event) => {
        const { name, value } = event.target;
        setBookingData(prev => ({ ...prev, [name]: value }));
    };
        // For whatsapp appointment
    const handleAppointmentUpdatae = (mobileNumber) => {
        if (!mobileNumber) {
            alert("No number selected");
            return;
        }
const customerName = item?.name || data.name || "Customer";

        const message = `Hello ${customerName}, 😊\nYour appointment is scheduled on ${bookingData.bookingDate}.\nWe look forward to serving you. Thank you!`;



        const encodedMessage = encodeURIComponent(message);

        // Open WhatsApp chat with pre-filled message
        window.open(
            `https://wa.me/${mobileNumber}?text=${encodedMessage}`,
            "_blank"
        );
    };

    const handleSubmit = async (e) => {

        if (!bookingData.bookingDate) {
            toast.warning("Please select booking date");
            return;
        }

        try {
            setLoading(true);

            // ✅ EXISTING CUSTOMER → UPDATE BOOKING
            if (mobileStatus === "exists" && item) {

                const payload = {
                    _id: item._id,
                    serviceType: bookingData.serviceType,
                    address: bookingData.address,
                    bookingDate: bookingData.bookingDate,
                    serviceCategory: item.serviceCategory
                };

                const res = await axios.post(
                    `${url}/api/service_Customer/booking-update`, payload, { headers: { token } }
                );

                if (res.data.success) {
                    toast.success("Booking updated");
                } else {
                    toast.error(res.data.message);
                }
            }

            // ✅ NEW CUSTOMER → CREATE + BOOKING
            else {

                const payload = {
                    ...data,
                    serviceType: bookingData.serviceType,
                    address: bookingData.address,
                    bookingDate: bookingData.bookingDate
                };

                const res = await axios.post(
                    `${url}/api/service_Customer/create-customer`, payload, { headers: { token } }
                );

                if (res.data.success) {
                    toast.success("Customer + booking created");
                } else {
                    toast.error(res.data.message);
                }
            }

            // RESET
            setData({
                name: "",
                mobile1: "",
                mobile2: "",
                description: "",
                dob: "",
                serviceCategory: ""
            });

            setBookingData({
                serviceType: "",
                address: "",
                bookingDate: ""
            });

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
      name: item.name || ""
    }));
  }
}, [mobileStatus, item]);

    return (
    <div className='ba-container'>
        <form className='ba-form' onSubmit={handleSubmit}>

            {/* ================= MOBILE ================= */}
            <div className="ba-mobile">
                <p>Mobile No. (Required)</p>

                <input  name="mobile1" value={data.mobile1}  onChange={onChangeHandler} type="tel" maxLength="10" placeholder="(Required)"  required />

                <input  name="mobile2" value={data.mobile2}  onChange={onChangeHandler} type="tel" maxLength="10"  placeholder="(Optional)" />

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
                    onChange={onChangeHandler}
                    value={data.name}
                    type="text"
                    name='name'
                    placeholder='Type Here (Required)'
                    required
                />
            </div>

            {/* ================= DOB ================= */}
            <div className="ba-dob">
                <p>Date of Birth (Optional)</p>
                <input
                    type="date"
                    name="dob"
                    value={data.dob}
                    onChange={onChangeHandler}
                />
            </div>

            {/* ================= SERVICE CATEGORY ================= */}
            <select
                name='serviceCategory'
                value={data.serviceType}
                onChange={onChangeHandler}
                required
            >
                <option value="">Select Service Type</option>
                <option value="RO">RO</option>
                <option value="Chimney">Chimney</option>
                <option value="AC">AC</option>
            </select>
            {/* ================= BOOKING SECTION ================= */}
            <hr />

            <div className="ba-field">
                <label>Service Type</label>
                <textarea
                    rows="2"
                    name="serviceType"
                    value={bookingData.serviceType}
                    onChange={onChangeBookingHandler}
                    placeholder="Enter the type of service..."
                />
            </div>

            <hr />

            <div className="ba-field">
                <label>Booking Date: (Required)</label>
                <input
                    type="date"
                    name="bookingDate"
                    value={bookingData.bookingDate}
                    onChange={onChangeBookingHandler}
                    min={new Date().toISOString().split("T")[0]}
                />
            </div>

            <hr />

            {/* ================= SELECT NUMBER + WHATSAPP ================= */}
            <div className="ba-field">
                <select
  onChange={(e) => setSelectedNumber(e.target.value)}
  value={selectedNumber}
>
  <option value="">Select number</option>

  {/* Existing customer */}
  {item?.mobile1 && (
    <option value={item.mobile1}>
      Mobile 1 - {item.mobile1}
    </option>
  )}

  {item?.mobile2 && (
    <option value={item.mobile2}>
      Mobile 2 - {item.mobile2}
    </option>
  )}

  {/* New customer */}
  {!item && data.mobile1 && (
    <option value={data.mobile1}>
      Mobile 1 - {data.mobile1}
    </option>
  )}

  {!item && data.mobile2 && (
    <option value={data.mobile2}>
      Mobile 2 - {data.mobile2}
    </option>
  )}
</select>

                <img
                    src={assets.whatsapp_icon}
                    alt="whatsapp"
                    className="ba-whatsapp"
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

            {/* ================= ADDRESS + BOOK ================= */}
            <div className="ba-field">
                <label>Customer Address</label>

                <textarea
                    rows="3"
                    name="address"
                    value={bookingData.address}
                    onChange={onChangeBookingHandler}
                    placeholder="Enter customer address..."
                />

                <button type="button"  className="ba-book-btn"  disabled={saving}
                    onClick={async () => {
                        if (savingRef.current) return;

                        savingRef.current = true;
                        setSaving(true);

                        try {
                            const isBooking = await handleSubmit(item?._id);

                        } finally {
                            savingRef.current = false;
                            setSaving(false);
                        }
                    }}
                >
                    {saving ? "Booking..." : "Book Appointment"}
                </button>
            </div>

        </form>
    </div>
);
}

export default BookingAppointment
