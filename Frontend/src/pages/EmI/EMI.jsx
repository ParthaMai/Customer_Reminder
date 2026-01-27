import React from 'react'
import './EMI.css'
import { assets } from '../../assets/assets'

const EMI = () => {
    return (
        <div className='add'>
            <form className='flex-col'>
                <div className="customer-name">
                    <p>Name</p>
                    <input type="text" name='name' placeholder='Type Here (Required)' required />
                </div>
                <div className="Form-no">
                    <p>Form No.</p>
                    <input type="number" placeholder='285 (Required)' required />
                </div>
                <div className="Purchase-Date">
                    <p>Purchase Date(Required)</p>
                    <input type="date" name="Pur-dob" required />
                </div>
                <div className="add-img-upload">
                    <p>Upload Customer Image(Optional)</p>
                    <label htmlFor='image'>
                        <img src={assets.upload_icon} alt="" />
                    </label>
                    <input type="file" id="image" />
                </div>
                <div className="mobile-no">
                    <p>Mobile No.</p>
                    <input type="tel" maxLength="10" placeholder="(Required)" required />
                    <input type="tel" maxLength="10" placeholder="(Optional)" />
                    <input type="tel" maxLength="10" placeholder="(Optional)" />
                    <input type="tel" maxLength="10" placeholder="(Optional)" />
                </div>
                <div className="add-product-description">
                    <p>Mobile No. information(Optional)</p>
                    <textarea name="description" rows="3" placeholder='Write Customer MobNo. info.' ></textarea>
                </div>
                <div className="father-name">
                    <p>Father Name(Optional)</p>
                    <input type="text" name='name' placeholder='Type Here' />
                </div>
                <div className="Aadhar-card">
                    <p>Aadhaar No.</p>
                    <input type="text" maxLength="12" placeholder="Enter Aadhaar Number (Optional)"/>
                </div>
                <div className="voter-card">
                    <p>Voter ID</p>
                    <input type="text" maxLength="10" placeholder="Enter Voter ID(Optional)" />
                </div>
                <div className="pan-card">
                    <p>PAN No.</p>
                    <input type="text" maxLength="10" placeholder="Enter PAN Number(Optional)" />
                </div>
                <div className="dob">
                    <p>Date of Birth(Optional)</p>
                    <input type="date" name="dob" />
                </div>
                <div className="cibil-score">
                    <p>CIBIL Score</p>
                    <input type="text" min="-1" max="900" placeholder="Enter CIBIL Score(Optional)" />
                </div>
                <div className="pin-code">
                    <p>PIN Code</p>
                    <input type="text" maxLength="6" placeholder="Enter PIN Code(Optional)"/>
                </div>
                <div className="qualification">
                    <p>Qualification</p>
                    <input type="text" placeholder="Enter your qualification(Optional)" />
                </div>
                <div className="occupation">
                    <p>Occupation</p>
                    <input type="text" placeholder="Enter your occupation(Optional)" />
                </div>
                <div className="mobile-model">
                    <p>Mobile Model(Required)</p>
                    <input type="text" placeholder="Enter mobile model(Required)" required />
                </div>
                <div className="price">
                    <p>Price(Required)</p>
                    <input type="number" placeholder='₹10000(Required)' required />
                </div>
                <div className="emi-charges">
                    <p>EMI Charges(Required)</p>
                    <input type="number" min="0" placeholder="Enter EMI charges(Required)" required />
                </div>
                <div className="emi-tenure flex-col">
                    <p>EMI Tenure (Months) .. (Required)</p>
                    <select name="emiTenure" required>
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
                    <select name="failedEmi" required>
                        <option value="">Select failed EMIs</option>
                        <option value="1">0</option>
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
                    <select name="reminderPeriod" required>
                        <option value="">Select period</option>
                        <option value="6_months">6 Months</option>
                        <option value="9_months">9 Months</option>
                        <option value="11_months">11 Months</option>
                        <option value="1_year">1 Year</option>
                        <option value="2_years">2 Years</option>
                        <option value="3_years">3 Years</option>
                    </select>
                </div>

                <button type='submit' className='add-btn'>ADD</button>
            </form>
        </div>
    )
}

export default EMI
