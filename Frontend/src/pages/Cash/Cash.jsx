import React, { useEffect, useState } from 'react'
import './Cash.css'
import { assets } from '../../assets/assets'

const Cash = () => {





    
  return (
    <div className='cash'>
      <form className='flex-col'>
        <div className="customer-name">
          <p>Name</p>
          <input type="text" name='name' placeholder='Type Here(Required)' required/>
        </div>
        <div className="Purchase-Date">
            <p>Purchase Date(Required)</p>
            <input type="date" name="cash-Pur-dob" required />
        </div>
         <div className="mobile-no">
                <p>Mobile No.</p>
                <input type="tel" maxLength="10" placeholder="(Required)" required />
                <input type="tel" maxLength="10" placeholder="(Optional)" />
                <input type="tel" maxLength="10" placeholder="(Optional)" />
                <input type="tel" maxLength="10" placeholder="(Optional)" />
            </div>
            <div className="add-product-description">
                <p>Mobile No. information (Optional)</p>
                <textarea name="description" rows="3" placeholder='Write Customer MobNo. info.' ></textarea>
            </div>
            <div className="father-name">
                <p>Father Name (Optional)</p>
                <input type="text" name='name' placeholder='Type Here(Optional)'/>
            </div>
            <div className="Aadhar-card">
                <p>Aadhar No.(Optional)</p>
                <input type="text" maxLength="12" placeholder="Enter Aadhaar Number(Optional)" />
            </div>
            <div className="dob">
                <p>Date of Birth (Optional)</p>
                <input type="date" name="dob"/>
            </div>
            <div className="mobile-model">
                <p>Mobile Model (Required)</p>
                <input type="text" placeholder="Enter mobile model" required />
            </div>
            <div className="price">
                <p>Price (Required)</p>
                <input type="number"  placeholder='₹10000' required />
            </div>
        <div className="reminder flex-col">
        <p>Reminder Period (Required)</p>
        <select name="reminderPeriod" required>
            <option value="">Select period(Required)</option>
            <option value="6_months">6 Months</option>
            <option value="9_months">9 Months</option>
            <option value="11_months">11 Months</option>
            <option value="1_year">1 Year</option>
            <option value="2_years">2 Years</option>
            <option value="3_years">3 Years</option>
        </select>
        </div>
      <button type='submit' className='cash-add-btn'>ADD</button>
      </form>
    </div>
  )
}

export default Cash
