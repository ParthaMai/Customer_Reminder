import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import { ToastContainer} from 'react-toastify';
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
import FullDetails_Pending from './pages/Pending_Calls/FullDetails_Pending/FullDetails_Pending'
import Appointment from './pages/Appointment/Appointment'
import AppointmentDetails from './pages/Appointment/AppointmentDetails/AppointmentDetails'
import TodayEarn from './pages/TodayEarn/TodayEarn'
import ServiceHistory from './pages/ServiceHistory/ServiceHistory'
import ContactUs from './pages/ContactUs/ContactUs'
import TotalEarning from './pages/TotalEarning/TotalEarning'
import MonthlyStats from './pages/CompleteService/CompleteService'
import SubsCription from './pages/Subscription/SubsCription'
import BookingAppointment from './pages/BookingAppointment/BookingAppointment'

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
          <Route path="/" element={<Home />} />
          <Route path='/add-customer' element={<Customer/>} />
          <Route path="/list_Service_Customer" element={<List_Service_Customer/>} />
          <Route path="/list_Customer/FullList_Customer/:id" element={<FullList_Customer/>} />
          <Route path="/list_Pending_Calls" element={<Pending_Calls/>} />
          <Route path="/list_Pending/FullList_Pending/:id" element={<FullDetails_Pending/>} />
          <Route path="/reminder" element = {<Reminder />} />
          <Route path="/reminder/Fullist/:id" element={<FullDetails_Reminder/>} />
          <Route path="/appointment" element = {<Appointment/>} />
          <Route path="/appointment/FullList/:id" element = {<AppointmentDetails/>} />
          <Route path="/today-earn" element = {<TodayEarn/>} />
          <Route path="/service-history" element = {<ServiceHistory/>} />
          <Route path="/contact-us" element = {<ContactUs/>} />
          <Route path="/total-earning" element = {<TotalEarning/>} />
          <Route path="/complete-service" element = {<MonthlyStats/>} />
          <Route path="/subscription" element = {<SubsCription/>} />
          <Route path="/booking-appointment" element = {<BookingAppointment/>} />

          
          {/* <Route path='/dob_reminder' element = {<Dob_reminder url={url} />} />
          <Route path='/dob/dob_wish/:id' element = {<Dob_wish url={url} />} /> */}
        </Routes>

        <Footer />
    </div>
    </>
  )
}

export default App
