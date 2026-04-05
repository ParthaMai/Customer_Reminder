import { createContext, useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "../axiosInstance";


export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {
  // const url = "http://192.168.1.8:4000"
  const url = "https://customer-reminder-backend.onrender.com"
  // const url = "http://13.201.29.150"

  const [token, setToken] = useState("");

  // For Count Reminder 
  const [reminderCount, setReminderCount] = useState(0);

  // ✅ Customer List State
  const [customerCache, setCustomerCache] = useState({});
  const [customerList, setCustomerList] = useState([]);
  const [customerPage, setCustomerPage] = useState(1);
  const [customerTotalPages, setCustomerTotalPages] = useState(1);
  const [customerCategory, setCustomerCategory] = useState("RO");

  // ✅ Pending Calls State
  const [pendingCache, setPendingCache] = useState({});
  const [pendingList, setPendingList] = useState([]);
  const [pendingPage, setPendingPage] = useState(1);
  const [pendingTotalPages, setPendingTotalPages] = useState(1);
  const [pendingCategory, setPendingCategory] = useState("RO");

  // ✅ Reminder State
  const [reminderCache, setReminderCache] = useState({});
  const [reminderList, setReminderList] = useState([]);
  const [reminderPage, setReminderPage] = useState(1);
  const [reminderTotalPages, setReminderTotalPages] = useState(1);
  const [reminderCategory, setReminderCategory] = useState("RO");


  // ✅ Booking State
  const [bookingCache, setBookingCache] = useState({});
  const [bookingList, setBookingList] = useState([]);
  const [bookingPage, setBookingPage] = useState(1);
  const [bookingTotalPages, setBookingTotalPages] = useState(1);
  const [bookingCategory, setBookingCategory] = useState("RO");

  // ✅ Fetch with Cache
const fetchCustomerList = async (pageNumber = 1, category = customerCategory, forceRefresh = false) => {
  if (!token) return;
  const cacheKey = `${category}_page_${pageNumber}`;

  // 🔥 Use cache only if forceRefresh is false
  if (!forceRefresh && customerCache[cacheKey]) {
    const cachedData = customerCache[cacheKey];
    setCustomerList(cachedData.data);
    setCustomerPage(cachedData.page);
    setCustomerTotalPages(cachedData.totalPages);
    return;
  }

  try {
    const response = await axiosInstance.get(`${url}/api/service_Customer/list`, {
      params: { page: pageNumber, limit: 10, serviceCategory: category },
      headers: { token }
    });

    if (response.data.success) {
      const { data, pagination } = response.data;

      setCustomerList(data);
      setCustomerPage(pagination.currentPage);
      setCustomerTotalPages(pagination.totalPages);

      // Save to cache
      setCustomerCache(prev => ({
        ...prev,
        [cacheKey]: { data, page: pagination.currentPage, totalPages: pagination.totalPages }
      }));
    }
  } catch (error) {
    console.log(error);
  }
};

  // ✅ Fetch Pending List with Cache
  const fetchPendingList = async (pageNumber = 1, category = pendingCategory, forceRefresh = false ) => {
    if (!token) return;   // ✅ FIX
    const cacheKey = `${category}_page_${pageNumber}`;

      // ✅ Use cache only if NOT force refresh
    if (!forceRefresh && pendingCache[cacheKey]) {
      const cachedData = pendingCache[cacheKey];

      setPendingList(cachedData.data);
      setPendingPage(cachedData.page);
      setPendingTotalPages(cachedData.totalPages);
      return;
    }

    try {
      const response = await axiosInstance.get(`${url}/api/pending-list/pending-list`, {
        params: { page: pageNumber, limit: 15, serviceCategory: category },
        headers: { token }
      });

      if (response.data.success) {
        const { data, pagination } = response.data;
        setPendingList(data);
        setPendingPage(pagination.currentPage);
        setPendingTotalPages(pagination.totalPages);

        setPendingCache(prev => ({
          ...prev,
          [cacheKey]: { data, page: pagination.currentPage, totalPages: pagination.totalPages }
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ Fetch Reminder List with Cache
  const fetchReminderList = async (pageNumber = 1, category = reminderCategory) => {
    if (!token) return;   // ✅ FIX

    const cacheKey = `${category}_page_${pageNumber}`;

    // 🔥 1. Check cache first
    if (reminderCache[cacheKey]) {
      const cachedData = reminderCache[cacheKey];

      setReminderList(cachedData.data);
      setReminderPage(cachedData.page);
      setReminderTotalPages(cachedData.totalPages);
      return;
    }

    try {
      const response = await axiosInstance.get(
        `${url}/api/service-remind-list/remind-list`,
        {
          params: {
            page: pageNumber,
            limit: 10,
            serviceCategory: category   // ✅ IMPORTANT
          },
          headers: { token }
        }
      );

      if (response.data.success) {
        const { data, pagination } = response.data;

        setReminderList(data);
        setReminderPage(pagination.currentPage);
        setReminderTotalPages(pagination.totalPages);

        // 🔥 2. Save to cache
        setReminderCache(prev => ({
          ...prev,
          [cacheKey]: {
            data,
            page: pagination.currentPage,
            totalPages: pagination.totalPages
          }
        }));
      }

    } catch (error) {
      console.log(error);
    }
  };

  // ✅ Fetch Reminder Count
  const fetchReminderCount = async () => {
  try {
    const res = await axiosInstance.get(`${url}/api/service-remind-list/reminder-count`, {
      headers: { token }
    });

    if (res.data.success) {
      setReminderCount(res.data.total);
    }
  } catch (error) {
    console.log(error);
  }
};


  // Fetch bookinglist
  const fetchBookingList = async (pageNumber = 1, category = bookingCategory) => {

    if (!token) return;

    const cacheKey = `${category}_booking_page_${pageNumber}`;

    // ✅ Cache check
    if (bookingCache[cacheKey]) {
      const cached = bookingCache[cacheKey];
      setBookingList(cached.data);
      setBookingPage(cached.page);
      setBookingTotalPages(cached.totalPages);
      return;
    }

    try {
      const response = await axiosInstance.get(`${url}/api/booking/Booking-list`, {
        params: {
          page: pageNumber,
          limit: 10,
          serviceCategory: category   // ✅ ADD THIS
        },
        headers: { token }
      });

      if (response.data.success) {
        const { data, pagination } = response.data;

        setBookingList(data);
        setBookingPage(pagination.currentPage);
        setBookingTotalPages(pagination.totalPages);

        // ✅ Save cache
        setBookingCache(prev => ({
          ...prev,
          [cacheKey]: {
            data,
            page: pagination.currentPage,
            totalPages: pagination.totalPages
          }
        }));
      }

    } catch (error) {
      console.log(error);
    }
  };

//   useEffect(() => {
//     async function loadData() {
//       if (localStorage.getItem("token")) {
//         setToken(localStorage.getItem("token"));
//       }
//     }
//     loadData();
//   }, [])

//     // This is for Reminder Count
// useEffect(() => {
//   const storedToken = localStorage.getItem("token");

//   if (storedToken) {
//     setToken(storedToken);
//     fetchReminderCount(storedToken); // 🔥 call directly
//   }
// }, []);


useEffect(() => {
  const storedToken = localStorage.getItem("token");
  if (storedToken) {
    setToken(storedToken);
  }
}, []);

useEffect(() => {
  if (token) {
    fetchReminderCount();
  }
}, [token]);
  const contextValue = {

    url,
    token,
    setToken,

    // Customer
    customerList,
    setCustomerList,
    customerPage,
    customerTotalPages,
    customerCategory,
    setCustomerCategory,
    setCustomerPage,
    fetchCustomerList,
    setCustomerCache,

    // Pending
    pendingList,
    setPendingList,
    pendingPage,
    setPendingPage,
    pendingTotalPages,
    fetchPendingList,
    pendingCache,
    setPendingCache,
    pendingCategory,
    setPendingCategory,

    // ✅ Reminder 
    reminderList,
    reminderPage,
    reminderTotalPages,
    reminderCategory,
    setReminderCategory,
    setReminderPage,
    fetchReminderList,
    reminderCache,
    setReminderCache,

    // ✅ Booking
    bookingList,
    bookingPage,
    bookingTotalPages,
    bookingCategory,
    setBookingCategory,
    setBookingPage,
    fetchBookingList,
    bookingCache,
    setBookingCache,

    // ✅ Reminder Count
    fetchReminderCount,
    reminderCount
  }

  return (
    <div>
      <StoreContext.Provider value={contextValue}>
        {props.children}
      </StoreContext.Provider>
    </div>
  )
}

export default StoreContextProvider;
