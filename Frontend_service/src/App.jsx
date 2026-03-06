import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Route, Routes } from 'react-router-dom'
import EMI from './pages/EmI/EMI'
import Home from './pages/Home/Home'
import List_EMI from './pages/List_EMI/List_EMI'
import { ToastContainer} from 'react-toastify';
import FullList_Emi from './pages/List_EMI/FullList_Emi/FullList_Emi'
import Reminder from './pages/Reminder/Reminder'
import FullDetails_Reminder from './pages/Reminder/FullDetails_Reminder/FullDetails_Reminder'
import Dob_reminder from './pages/Dob/Dob_reminder'
import Dob_wish from './pages/Dob/Wish/Dob_wish'
import { useState } from 'react'
import LoginPopup from './components/LoginPopup/LoginPopup'
import Footer from './components/Footer/Footer'
import Customer from './pages/Customer/Customer'
import List_Service_Customer from './pages/List_Service_Customer/List_Service_Customer'
import FullList_Customer from './pages/List_Service_Customer/FullList_Customer/FullList_Customer'
import Pending_Calls from './pages/Pending_Calls/Pending_Calls'

const App = () => {

  const url = "https://customer-reminder-backend.onrender.com"
  //  const url = "http://192.168.1.8:4000"

  const [showLogin,setShowLogin] = useState(false);

  return (
    <>
    {showLogin?<LoginPopup setShowLogin={setShowLogin}/>:<></>}
    <div className='app'>
      
      <Navbar setShowLogin={setShowLogin} /> {/* Pass the login props */}
      <ToastContainer /> 
      <hr/>
        <Routes>
          <Route path="/" element={<Home url={url} />} />
          <Route path='/add-customer' element={<Customer/>} />
          <Route path="/list_Service_Customer" element={<List_Service_Customer/>} />
          <Route path="/list_Customer/FullList_Customer/:id" element={<FullList_Customer/>} />
          <Route path="/list_Pending_Calls" element={<Pending_Calls/>} />
          <Route path="/list_EMI" element={<List_EMI url={url}/>} />
          <Route path="/list_EMI/FullList_Emi/:id" element={<FullList_Emi url={url} />} />
          <Route path="/reminder" element = {<Reminder url={url} />} />
          <Route path="/reminder/:id" element={<FullDetails_Reminder url={url} />} />
          <Route path='/dob_reminder' element = {<Dob_reminder url={url} />} />
          <Route path='/dob/dob_wish/:id' element = {<Dob_wish url={url} />} />
        </Routes>

        <Footer />
    </div>
    </>
  )
}

export default App
