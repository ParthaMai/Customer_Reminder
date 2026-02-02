import React from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import { useEffect } from 'react';
import { toast } from 'react-toastify'
import axios from 'axios'

const Home = ({url}) => {

  const fetchList = async () => {
     try {
    const response = await axios.get(`${url}/api/reminder-list/remind`);
    if (!response.data.success) {
      toast.error("Error");
    }
  }catch(error){
    toast.error("Server error");
    console.error(error);
  }
  }


  // use here to update only once or twice per day
  useEffect(() => {
    fetchList()
  }, [])

  return (
    <div>
      <Sidebar />
    </div>
  )
}

export default Home
