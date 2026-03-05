import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {
    const url = "http://192.168.1.8:4000"
    // const url = "https://customer-reminder-backend.onrender.com"

    const[token,setToken] = useState("");



    useEffect(()=>{
    async function laodData() {
        if (localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"));
        }
    }
    laodData();
    },[])

    const contextValue = {

        url,
        token,
        setToken
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
