import React, { useEffect, useState } from 'react'
import './Customer.css'
import { assets } from '../../assets/assets'
import axios from "axios"
import { toast } from 'react-toastify'
import { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'


const Customer = () => {

    const{token,url} = useContext(StoreContext);
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

                // (append only if they present) 

                if (data.mobile2) formData.append("mobile2", data.mobile2);
                if (data.description) formData.append("description", data.description);
                if (data.dob) formData.append("dob", data.dob);
                formData.append("totalPrice", totalPrice);


                const response = await axios.post(`${url}/api/service_Customer/add`, formData, { headers: { token } });
                if (response.data.success) {
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

        return (
            <div className='cash'>
                <form className='flex-col' onSubmit={onSubmitHandler}>
                    <div className="customer-name">
                        <p>Name(Required)</p>
                        <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='Type Here (Required)' required />
                    </div>
                    <div className="Purchase-Date">
                        <p>Service Date(Required)</p>
                        <input name="serviceDate" value={data.serviceDate} onChange={onChangeHandler} type="date" required />
                    </div>
                    <div className="mobile-no">
                        <p>Mobile No. (Required) </p>
                        <input name="mobile1" value={data.mobile1} onChange={onChangeHandler} type="tel" maxLength="10" placeholder="(Required)" required />
                        <input name="mobile2" value={data.mobile2} onChange={onChangeHandler} type="tel" maxLength="10" placeholder="(Optional)" />
                    </div>
                    <div className="add-product-description">
                        <p>Mobile No. information (Optional)</p>
                        <textarea name="description" value={data.description} onChange={onChangeHandler} rows="3" placeholder='Write Customer MobNo. info.' />
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
                                        rows="2" placeholder="Write service details..."   />

                                    {/* Service Price */}
                                    <input type="number" value={service.price}
                                        onChange={(e) =>
                                            handleServiceChange(index, "price", Number(e.target.value))
                                        }  placeholder="Enter service price"  className="service-price"   />

                                    {data.services.length > 1 && (
                                        <button  type="button"  onClick={() => removeService(index)}   className="remove-btn" >
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
                        <div className="reminder flex-col">
                            <p>Reminder Period (Required)</p>
                            <select name="reminderPeriod" value={data.reminderPeriod} onChange={onChangeHandler} required>
                                <option value="">Select period(Required)</option>
                                <option value="13">Next Season</option>
                                <option value="15">Next Season</option>
                                <option value="6">6 Months</option>
                                <option value="9">9 Months</option>
                                <option value="11">11 Months</option>
                                <option value="12">1 Year</option>
                                <option value="24">2 Years</option>
                            </select>
                        </div>
                        <button type='submit' className='add-btn' disabled={loading}>
                            {loading ? <div className="loader"></div> : "ADD"}
                        </button>
                </form>
            </div>
        )
    };

    export default Customer;
