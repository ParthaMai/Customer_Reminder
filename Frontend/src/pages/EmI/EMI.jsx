import React, { useEffect, useState } from 'react'
import './EMI.css'
import { assets } from '../../assets/assets'

const EMI = () => {

    const [image, setImage] = useState(false);
    const [data, setData] = useState({
        name: "",
        formNo: "",
        purchaseDate: "",
        mobile1: "",
        mobile2: "",
        mobile3: "",
        mobile4: "",
        description: "",
        fatherName: "",
        aadhar: "",
        voterId: "",
        age:"",
        pan: "",
        dob: "",
        cibil: "",
        pinCode: "",
        qualification: "",
        occupation: "",
        mobileModel: "",
        price: "",
        emiCharges: "",
        emiTenure: "",
        failedEmi: "",
        reminderPeriod: ""
    });

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data=>({...data,[name]:value}))
    }

    // To check the from data
    useEffect(()=>{
        console.log(data);
    },[data])    

    return (
        <div className='add'>
            <form className='flex-col'>
                <div className="customer-name">
                    <p>Name</p>
                    <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='Type Here (Required)' required />
                </div>
                <div className="Form-no">
                    <p>Form No.</p>
                    <input name="formNo" value={data.formNo} onChange={onChangeHandler} type="number" placeholder='285 (Required)' required />
                </div>
                <div className="Purchase-Date">
                    <p>Purchase Date(Required)</p>
                    <input name="purchaseDate" value={data.purchaseDate} onChange={onChangeHandler} type="date" required />
                </div>
                <div className="add-img-upload">
                    <p>Upload Customer Image(Optional)</p>
                    <label htmlFor='image'>
                        <img src={image?URL.createObjectURL(image):assets.upload_icon} alt="" />
                    </label>
                    <input onChange={(e)=>setImage(e.target.files[0])} type="file" id="image" />
                </div>
                <div className="mobile-no">
                    <p>Mobile No.</p>
                    <input name="mobile1" value={data.mobile1} onChange={onChangeHandler} type="tel" maxLength="10" placeholder="(Required)" required />
                    <input name="mobile2" value={data.mobile2} onChange={onChangeHandler} type="tel" maxLength="10" placeholder="(Optional)" />
                    <input name="mobile3" value={data.mobile3} onChange={onChangeHandler} type="tel" maxLength="10" placeholder="(Optional)" />
                    <input name="mobile4" value={data.mobile4} onChange={onChangeHandler} type="tel" maxLength="10" placeholder="(Optional)" />
                </div>
                <div className="add-product-description">
                    <p>Mobile No. information(Optional)</p>
                    <textarea name="description" value={data.description} onChange={onChangeHandler} rows="3" placeholder='Write Customer MobNo. info.' />
                </div>
                <div className="father-name">
                    <p>Father Name(Optional)</p>
                    <input type="text" name="fatherName" value={data.fatherName} onChange={onChangeHandler}  placeholder="Type Here"/>
                </div>
                <div className="Aadhar-card">
                    <p>Aadhaar No.</p>
                    <input type="text" name="aadhar" value={data.aadhar} onChange={onChangeHandler} maxLength="12" placeholder="Enter Aadhaar Number (Optional)"/>
                </div>
                <div className="voter-card">
                    <p>Voter ID</p>
                    <input type="text" name="voterId" value={data.voterId} onChange={onChangeHandler} maxLength="10" placeholder="Enter Voter ID (Optional)"/>
                </div>
                <div className="age">
                    <p>Age (Required)</p>
                    <input type="text" name="age" value={data.age} onChange={onChangeHandler} placeholder="Enter Age" required/>
                </div>
                <div className="pan-card">
                    <p>PAN No.</p>
                    <input type="text" name="pan" value={data.pan} onChange={onChangeHandler} maxLength="10" placeholder="Enter PAN Number (Optional)" />
                </div>
                <div className="dob">
                    <p>Date of Birth(Optional)</p>
                    <input type="date" name="dob" value={data.dob} onChange={onChangeHandler} />
                </div>
                <div className="cibil-score">
                    <p>CIBIL Score</p>
                    <input type="text" name="cibil" value={data.cibil} onChange={onChangeHandler} placeholder="Enter CIBIL Score (Optional)" />
                </div>
                <div className="pin-code">
                    <p>PIN Code</p>
                    <input type="text" name="pinCode" value={data.pinCode} onChange={onChangeHandler} maxLength="6" placeholder="Enter PIN Code (Optional)"/>
                </div>
                <div className="qualification">
                    <p>Qualification</p>
                    <input type="text" name="qualification" value={data.qualification} onChange={onChangeHandler} placeholder="Enter your qualification (Optional)"/>
                </div>
                <div className="occupation">
                    <p>Occupation</p>
                    <input  type="text" name="occupation" value={data.occupation} onChange={onChangeHandler} placeholder="Enter your occupation (Optional)"/>
                </div>
                <div className="mobile-model">
                    <p>Mobile Model(Required)</p>
                    <input type="text" name="mobileModel" value={data.mobileModel} onChange={onChangeHandler}  placeholder="Enter mobile model (Required)" required />
                </div>
                <div className="price">
                    <p>Price(Required)</p>
                    <input onChange={onChangeHandler} value={data.price} type="number" name='price' placeholder='₹10000(Required)' required />
                </div>
                <div className="emi-charges">
                    <p>EMI Charges(Required)</p>
                    <input type="number" name="emiCharges" value={data.emiCharges} onChange={onChangeHandler} min="0" placeholder="Enter EMI charges(Required)" required />
                </div>
                <div className="emi-tenure flex-col">
                    <p>EMI Tenure (Months) .. (Required)</p>
                    <select name="emiTenure" value={data.emiTenure} onChange={onChangeHandler} required>
                        <option value="">Select tenure</option>
                        <option value="1">1 Month</option>
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
                    </select>
                </div>

                <div className="failed-emi flex-col">
                    <p>No. of Failed EMIs .. (Required)</p>
                    <select name="failedEmi"  value={data.failedEmi} onChange={onChangeHandler} required>
                        <option value="">Select failed EMIs</option>
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                    </select>
                </div>
                <div className="reminder flex-col">
                    <p>Reminder Period (Required)</p>
                    <select name="reminderPeriod" value={data.reminderPeriod} onChange={onChangeHandler} required>
                        <option value="">Select period</option>
                        <option value="6">6 Months</option>
                        <option value="9">9 Months</option>
                        <option value="11">11 Months</option>
                        <option value="12">1 Year</option>
                        <option value="24">2 Years</option>
                    </select>
                </div>

                <button type='submit' className='add-btn'>ADD</button>
            </form>
        </div>
    )
}

export default EMI
