import React, { useEffect, useState } from 'react'
import './Cash.css'
import { assets } from '../../assets/assets'
import axios from "axios"
import { toast } from 'react-toastify'

const Cash = ({url}) => {

    const [loading, setLoading] = useState(false);

    const [data, setData] = useState({
        payment: "CASH",
        name: "",
        purchaseDate: "",
        mobile1: "",
        mobile2: "",
        mobile3: "",
        mobile4: "",
        description: "",
        fatherName: "",
        aadhar: "",
        dob: "",
        age: "",
        mobileModel: "",
        price: "",
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
            formData.append("purchaseDate", data.purchaseDate);
            formData.append("mobile1", data.mobile1);
            formData.append("mobileModel", data.mobileModel);

            // Required number fields (convert from string to number)
            formData.append("price", Number(data.price));
            formData.append("reminderPeriod", Number(data.reminderPeriod));

            // (append only if they present) 

            if (data.mobile2) formData.append("mobile2", data.mobile2);
            if (data.mobile3) formData.append("mobile3", data.mobile3);
            if (data.mobile4) formData.append("mobile4", data.mobile4);
            if (data.description) formData.append("description", data.description);
            if (data.fatherName) formData.append("fatherName", data.fatherName);
            if (data.aadhar) formData.append("aadhar", data.aadhar);
            if (data.dob) formData.append("dob", data.dob);
            if (data.age) formData.append("age", data.age);


            const response = await axios.post(`${url}/api/cash/add`, formData);
            if (response.data.success) {
                setData({
                    payment: "CASH",
                    name: "",
                    purchaseDate: "",
                    mobile1: "",
                    mobile2: "",
                    mobile3: "",
                    mobile4: "",
                    description: "",
                    fatherName: "",
                    aadhar: "",
                    dob: "",
                    age: "",
                    mobileModel: "",
                    price: "",
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


    return (
        <div className='cash'>
            <form className='flex-col' onSubmit={onSubmitHandler}>
                <div className="customer-name">
                    <p>Name</p>
                    <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='Type Here (Required)' required />
                </div>
                <div className="Purchase-Date">
                    <p>Purchase Date(Required)</p>
                    <input name="purchaseDate" value={data.purchaseDate} onChange={onChangeHandler} type="date" required />
                </div>
                <div className="mobile-no">
                    <p>Mobile No. (Required) </p>
                    <input name="mobile1" value={data.mobile1} onChange={onChangeHandler} type="tel" maxLength="10" placeholder="(Required)" required />
                    <input name="mobile2" value={data.mobile2} onChange={onChangeHandler} type="tel" maxLength="10" placeholder="(Optional)" />
                    <input name="mobile3" value={data.mobile3} onChange={onChangeHandler} type="tel" maxLength="10" placeholder="(Optional)" />
                    <input name="mobile4" value={data.mobile4} onChange={onChangeHandler} type="tel" maxLength="10" placeholder="(Optional)" />
                </div>
                <div className="add-product-description">
                    <p>Mobile No. information (Optional)</p>
                    <textarea name="description" value={data.description} onChange={onChangeHandler} rows="3" placeholder='Write Customer MobNo. info.' />
                </div>
                <div className="father-name">
                    <p>Father Name (Optional)</p>
                    <input type="text" name="fatherName" value={data.fatherName} onChange={onChangeHandler} placeholder="Type Here" />
                </div>
                <div className="Aadhar-card">
                    <p>Aadhar No.(Optional)</p>
                    <input type="text" name="aadhar" value={data.aadhar} onChange={onChangeHandler} maxLength="12" placeholder="Enter Aadhaar Number (Optional)" />
                </div>
                <div className="dob">
                    <p>Date of Birth (Optional)</p>
                    <input type="date" name="dob" value={data.dob} onChange={onChangeHandler} />
                </div>
                <div className="age">
                    <p>Age (Optional)</p>
                    <input type="text" name="age" value={data.age} onChange={onChangeHandler} placeholder="Enter Age" />
                </div>
                <div className="mobile-model">
                    <p>Mobile Model (Required)</p>
                    <input type="text" name="mobileModel" value={data.mobileModel} onChange={onChangeHandler} placeholder="Enter mobile model (Required)" required />
                </div>
                <div className="price">
                    <p>Price (Required)</p>
                    <input onChange={onChangeHandler} value={data.price} type="number" name='price' placeholder='₹10000(Required)' required />
                </div>
                <div className="reminder flex-col">
                    <p>Reminder Period (Required)</p>
                    <select name="reminderPeriod" value={data.reminderPeriod} onChange={onChangeHandler} required>
                        <option value="">Select period(Required)</option>
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
}

export default Cash
