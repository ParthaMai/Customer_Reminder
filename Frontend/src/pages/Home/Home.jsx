import React from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import { useEffect } from 'react';
import { toast } from 'react-toastify'
import axios from 'axios'

const Home = ({url}) => {

    const createList = async () => {
    try {
      const response = await axios.get(`${url}/api/Birthday/dob-remind`);
      if (!response.data.success) {
        toast.error("Already Stored in Birthday complete all the Wish");
      }
    } catch (error) {
      toast.error("Server error");
      console.error(error);
    }
  }

  const fetchList = async () => {
     try {
    const response = await axios.get(`${url}/api/reminder-list/remind`);
    if (!response.data.success) {
      toast.error("Already Stored in Reminder Please complete the all Reminder and check again");
    }
  }catch(error){
    toast.error("Server error");
    console.error(error);
  }
  }


  // use here to update only once or twice per day
  useEffect(() => {
    fetchList(),
    createList()
  }, [])

  return (
    <div>
      <Sidebar />
    </div>
  )
}

export default Home
