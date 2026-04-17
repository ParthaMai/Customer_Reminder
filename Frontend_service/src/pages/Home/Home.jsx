import React, { useContext } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import { useEffect } from 'react';
import { toast } from 'react-toastify'
import axios from 'axios'
import { StoreContext } from '../../context/StoreContext';

const Home = () => {

  const { token, url } = useContext(StoreContext);

  const DobList = async () => {
    if (!navigator.onLine) {
      toast.error("No Internet Connection");
      return;
    }
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
  const RemindList = async () => {
    if (!navigator.onLine) {
      toast.error("No Internet Connection");
      return;
    }
    try {
      const response = await axios.get(`${url}/api/service-remind-list/remind`, { headers: { token } });
      if (!response.data.success) {
        toast.error("Already Stored in Reminder Please complete the all Reminder and check again");
      }
    } catch (error) {
      toast.error("Server error");
      console.error(error);
    }
  }
  const fetchList = async () => {
    if (!navigator.onLine) {
      toast.error("No Internet Connection");
      return;
    }
    try {
      const response = await axios.get(`${url}/api/pending-list/pending`, { headers: { token } });
      if (!response.data.success) {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Server error");
      console.error(error);
    }
  }
  const BookingList = async () => {
    if (!navigator.onLine) {
      toast.error("No Internet Connection");
      return;
    }
    try {
      const response = await axios.get(`${url}/api/booking/Booking`, { headers: { token } });
      if (!response.data.success) {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Server error");
      console.error(error);
    }
  }

  // use here to update only once or twice per day
  useEffect(() => {

    if (!token) return;
    RemindList(),
      fetchList(),
      DobList(),
      BookingList()
  }, [token])

  return (
    <div>
      <Sidebar />
    </div>
  )
}

export default Home
