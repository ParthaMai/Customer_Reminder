import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Route, Routes } from 'react-router-dom'
import EMI from './pages/EmI/EMI'
import Cash from './pages/Cash/Cash'
import List from './pages/List/List'
import Home from './pages/Home/Home'


const App = () => {
  return (
    <div className='app'>
      <Navbar/>
      <hr/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/emi' element={<EMI/>} />
          <Route path="/cash" element={<Cash/>} />
          <Route path="/list" element={<List/>} />
        </Routes>
    </div>
  )
}

export default App
