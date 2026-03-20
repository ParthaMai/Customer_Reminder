import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {
  const url = "http://192.168.1.8:4000"
  // const url = "https://customer-reminder-backend.onrender.com"

  const [token, setToken] = useState("");

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

  const [reminder_list, setReminderList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ✅ Fetch with Cache
  const fetchCustomerList = async (pageNumber = 1, category = customerCategory) => {
    const cacheKey = `${category}_page_${pageNumber}`;

    // 🔥 1. Check cache first for Customer list
    if (customerCache[cacheKey]) {
      const cachedData = customerCache[cacheKey];

      setCustomerList(cachedData.data);
      setCustomerPage(cachedData.page);
      setCustomerTotalPages(cachedData.totalPages);
      return;
    }

    try {

      const response = await axios.get(`${url}/api/service_Customer/list`, {
        params: {
          page: pageNumber,
          limit: 10,
          serviceCategory: category
        },
        headers: { token }
      });

      if (response.data.success) {
        const { data, pagination } = response.data;

        setCustomerList(data);
        setCustomerPage(pagination.currentPage);
        setCustomerTotalPages(pagination.totalPages);

        // 🔥 2. Save to cache
        setCustomerCache(prev => ({
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

   // ✅ Fetch Pending List with Cache
  const fetchPendingList = async (pageNumber = 1, category = pendingCategory) => {
    const cacheKey = `${category}_page_${pageNumber}`;

    if (pendingCache[cacheKey]) {
      const cachedData = pendingCache[cacheKey];
      setPendingList(cachedData.data);
      setPendingPage(cachedData.page);
      setPendingTotalPages(cachedData.totalPages);
      console.log("⚡ Loaded Pending Calls from cache");
      return;
    }

    try {
      console.log("🌐 API called for Pending Calls");
      const response = await axios.get(`${url}/api/pending-list/pending-list`, {
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


  const fetchReminderList = async (pageNumber = 1) => {
    try {
      const response = await axios.get(`${url}/api/service-remind-list/remind-list`, {
        params: {
          page: pageNumber,
          limit: 10
        },
        headers: {
          token: token
        }
      });

      if (response.data.success) {
        setReminderList(response.data.data);
        setPage(response.data.pagination.currentPage);
        setTotalPages(response.data.pagination.totalPages);
      }

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    async function laodData() {
      await fetchReminderList();
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
      }
    }
    laodData();
  }, [])

  const contextValue = {

    url,
    token,
    setToken,

    // Customer
    customerList,
    customerPage,
    customerTotalPages,
    customerCategory,
    setCustomerCategory,
    setCustomerPage,
    fetchCustomerList,

    // Pending
    pendingList,
    pendingPage,
    pendingTotalPages,
    fetchPendingList,
    pendingCache,
    setPendingCache,
    pendingCategory,
    setPendingCategory,


    reminder_list,
    page,
    totalPages,
    fetchReminderList
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
