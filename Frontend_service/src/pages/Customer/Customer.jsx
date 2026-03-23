import React, { useEffect, useState } from 'react'
import './Customer.css'
import { assets } from '../../assets/assets'
import axios from "axios"
import { toast } from 'react-toastify'
import { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'


const Customer = () => {

    const { token, url, fetchCustomerList, setCustomerCache } = useContext(StoreContext);
    const [serviceCategory, setServiceCategory] = useState("RO");
    const [mobileStatus, setMobileStatus] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(false);

    // Handle input change
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
        name: "",
        serviceDate: "",
        mobile1: "",
        mobile2: "",
        description: "",
        dob: "",
        services: [
            {
                description: "",
                price: ""
            }
        ],
        totalPrice: "",
        reminderPeriod: ""
    });

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setLoading(true)
        try {
            const formData = new FormData();

            formData.append("name", data.name);
            formData.append("serviceDate", data.serviceDate);
            formData.append("mobile1", data.mobile1);

            formData.append("services", JSON.stringify(data.services));
            formData.append("reminderPeriod", Number(data.reminderPeriod));

            // ✅ This is add Service Category
            formData.append("serviceCategory", serviceCategory);

            // (append only if they present) 

            if (data.mobile2) formData.append("mobile2", data.mobile2);
            if (data.description) formData.append("description", data.description);
            if (data.dob) formData.append("dob", data.dob);
            formData.append("totalPrice", totalPrice);


            const response = await axios.post(`${url}/api/service_Customer/add`, formData, { headers: { token } });
            if (response.data.success) {
                // 🔥 1. CLEAR CACHE
                setCustomerCache({});

                // 🔥 2. REFRESH FIRST PAGE
                await fetchCustomerList(1, serviceCategory);

                // 🔥 SCROLL TO TOP (ADD HERE)
                window.scrollTo({ top: 0, behavior: "smooth" });

                setData({
                    name: "",
                    serviceDate: "",
                    mobile1: "",
                    mobile2: "",
                    description: "",
                    dob: "",
                    services: [{ description: "", price: "" }],
                    totalPrice: "",
                    reminderPeriod: ""
                })
                toast.success(response.data.message);
            }
            else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong");
        }
        finally {
            setLoading(false);  // stop loading
        }

    };
    useEffect(() => {
        const total = data.services.reduce((sum, service) => {
            return sum + Number(service.price || 0);
        }, 0);

        setTotalPrice(total);
    }, [data.services]);

    useEffect(() => {
        const delay = setTimeout(async () => {
            if (data.mobile1.length !== 10) {
                setMobileStatus(null);
                return;
            }

            try {
                const res = await axios.get(
                    `${url}/api/service_Customer/check-mobile?mobile=${data.mobile1}&serviceCategory=${serviceCategory}`,
                    { headers: { token } }
                );

                if (res.data.exists) {
                    setMobileStatus("exists");
                } else {
                    setMobileStatus("new");
                }

            } catch (error) {
                console.log(error);
                setMobileStatus(null);
            }
        }, 300);

        return () => clearTimeout(delay);
    }, [data.mobile1, serviceCategory]);

    return (
        <div className='cash'>
            <div className="service-type-selector">
                {["RO", "Chimney", "AC"].map((type) => (
                    <button
                        key={type}
                        type="button"
                        className={serviceCategory === type ? "active" : ""}
                        onClick={() => {
                            setServiceCategory(type);

                            // reset reminder when switching
                            setData(prev => ({ ...prev, reminderPeriod: "" }));
                        }}
                    >
                        {type}
                    </button>
                ))}
            </div>
            <form className='flex-col' onSubmit={onSubmitHandler}>
                <div className="customer-name">
                    <p>Name(Required)</p>
                    <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='Type Here (Required)' required />
                </div>
                <div className="mobile-no">
                    <p>Mobile No. (Required) </p>
                    <input name="mobile1" value={data.mobile1} onChange={onChangeHandler} type="tel" maxLength="10" placeholder="(Required)" required />
                    <input name="mobile2" value={data.mobile2} onChange={onChangeHandler} type="tel" maxLength="10" placeholder="(Optional)" />
                    <div className="mobile-status">
                        {mobileStatus === "exists" && (
                            <p className="exists">⚠️ Customer already exists</p>
                        )}
                        {mobileStatus === "new" && (
                            <p className="new">✅ New customer</p>
                        )}
                    </div>
                </div>

                <div className="add-product-description">
                    <p>Mobile No. information (Optional)</p>
                    <textarea name="description" value={data.description} onChange={onChangeHandler} rows="3" placeholder='Write Customer MobNo. info.' />
                </div>
                <div className="Purchase-Date">
                    <p>Service Date(Required)</p>
                    <input name="serviceDate" value={data.serviceDate} onChange={onChangeHandler} type="date" required />
                </div>
                <div className="dob">
                    <p>Date of Birth (Optional)</p>
                    <input type="date" name="dob" value={data.dob} onChange={onChangeHandler} />
                </div>
                <div className="add-product-description">
                    <p>Service Details (Required)</p>

                    {data.services.map((service, index) => (
                        <div key={index} className="service-row">

                            <label>Service {index + 1}</label>

                            {/* Service Description */}
                            <textarea
                                value={service.description}
                                onChange={(e) =>
                                    handleServiceChange(index, "description", e.target.value)
                                }
                                rows="2" placeholder="Write service details..." />

                            {/* Service Price */}
                            <input type="number" value={service.price}
                                onChange={(e) =>
                                    handleServiceChange(index, "price", Number(e.target.value))
                                } placeholder="Enter service price" className="service-price" />

                            {data.services.length > 1 && (
                                <button type="button" onClick={() => removeService(index)} className="remove-btn" >
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addService}
                        className="add-btn-service"
                    >
                        Add +
                    </button>
                </div>
                <div className="total-price">
                    <p>Total Price</p>
                    <input type="number" value={totalPrice} readOnly />
                </div>
                <select
                    name="reminderPeriod"
                    value={data.reminderPeriod}
                    onChange={onChangeHandler}
                    required
                >
                    <option value="">Select period</option>

                    {serviceCategory === "RO" && (
                        <>
                            <option value="1">1 Months</option>
                            <option value="2">2 Months</option>
                            <option value="3">3 Months</option>
                            <option value="4">4 Months</option>
                            <option value="5">5 Months</option>
                            <option value="6">6 Months</option>
                            <option value="7">7 Months</option>
                            <option value="8">8 Months</option>
                            <option value="9">9 Months</option>
                            <option value="10">10 Months</option>
                            <option value="11">11 Months</option>
                            <option value="12">12 Months</option>
                            <option value="15">15 Months</option>
                            <option value="18">18 Months</option>
                        </>
                    )}

                    {serviceCategory === "Chimney" && (
                        <>
                            <option value="3">3 Months</option>
                            <option value="6">6 Months</option>
                            <option value="9">9 Months</option>
                            <option value="12">12 Months</option>
                            <option value="15">15 Months</option>
                            <option value="18">18 Months</option>
                        </>
                    )}

                    {serviceCategory === "AC" && (
                        <>
                            <option value="2">New Installation AC</option>
                            <option value="3">Regular AC</option>
                            <option value="4">4 Months</option>
                            <option value="6">6 Months</option>
                            <option value="12">1 Year</option>
                        </>
                    )}
                </select>
                <button type='submit' className='add-btn' disabled={loading}>
                    {loading ? <div className="loader"></div> : "ADD"}
                </button>
            </form>
        </div>
    )
};

export default Customer;
