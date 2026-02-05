import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Route, Routes } from 'react-router-dom'
import EMI from './pages/EmI/EMI'
import Cash from './pages/Cash/Cash'
import Home from './pages/Home/Home'
import List_EMI from './pages/List_EMI/List_EMI'
import List_Cash from './pages/List_Cash/List_Cash'
import { ToastContainer} from 'react-toastify';
import FullList_Emi from './pages/List_EMI/FullList_Emi/FullList_Emi'
import Reminder from './pages/Reminder/Reminder'
import FullDetails_Reminder from './pages/Reminder/FullDetails_Reminder/FullDetails_Reminder'
import Dob_reminder from './pages/Dob/Dob_reminder'
import Dob_wish from './pages/Dob/Wish/Dob_wish'


const App = () => {

  const url = "http://192.168.1.8:4000"

  return (
    <div className='app'>
      <ToastContainer /> 
      <Navbar/>
      <hr/>
        <Routes>
          <Route path="/" element={<Home url={url} />} />
          <Route path='/emi' element={<EMI url={url}/>} />
          <Route path="/cash" element={<Cash/>} />
          <Route path="/list_EMI" element={<List_EMI url={url}/>} />
          <Route path="/list_Cash" element={<List_Cash/>} />
          <Route path="/list_EMI/FullList_Emi/:id" element={<FullList_Emi url={url} />} />
          <Route path="/reminder" element = {<Reminder url={url} />} />
          <Route path="/reminder/:id" element={<FullDetails_Reminder url={url} />} />
          <Route path='/dob_reminder' element = {<Dob_reminder url={url} />} />
          <Route path='/dob/dob_wish/:id' element = {<Dob_wish url={url} />} />
        </Routes>
    </div>
  )
}

export default App
