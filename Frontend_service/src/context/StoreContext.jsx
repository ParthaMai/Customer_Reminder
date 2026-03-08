import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {
    const url = "http://192.168.1.8:4000"
    // const url = "https://customer-reminder-backend.onrender.com"

    const[token,setToken] = useState("");
    const[reminder_list,setReminderList] = useState([]);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);



      const fetchReminderList = async (pageNumber = 1) => {
    try {
      console.log("hello hi")
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

    useEffect(()=>{
    async function laodData() {
        await fetchReminderList();
        if (localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"));
        }
    }
    laodData();
    },[])

    const contextValue = {

        url,
        token,
        setToken,
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
