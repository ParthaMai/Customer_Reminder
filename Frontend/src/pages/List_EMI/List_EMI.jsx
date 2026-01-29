import React, { useEffect, useState } from 'react'
import './List_EMI.css'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../../assets/assets'
import { useNavigate } from "react-router-dom";


const List_EMI = () => {

  const url = "http://192.168.1.8:4000"

  const navigate = useNavigate();
  const handleUpdate = (id) => {
    navigate("/list_EMI/FullList_Emi", { state: { id } });
  };



  const [searchField, setSearchField] = useState("name");
  const [searchValue, setSearchValue] = useState("");


  const [list, setList] = useState([]);

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/emi/list`);
    if(response.data.success) {
      setList(response.data.data);
    }
    else{
      toast.error("Error");
    }
  }

  useEffect(()=>{
    fetchList()
  },[])

  const removeCustomer = async(itemId) => {
        const response = await axios.post(`${url}/api/emi/remove`,{id:itemId});
        await fetchList();
        if(response.data.success){
          toast.success(response.data.message);
        }
        else{
          toast.error("Error")
        }
      }

  return (
    <div className='list add flex-col'>
      <p>All EMI Customer list</p>
      <div className="search-box">
      <select 
        value={searchField} 
        onChange={(e) => setSearchField(e.target.value)}
      >
        <option value="name">Name</option>
        <option value="formNo">Form No</option>
        <option value="mobile1">Mobile No</option>
      </select>

      <input 
        type="text"
        placeholder={`Search by ${searchField}`}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
    </div>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Update</b>
          <b>Form No.</b>
          <b>Purchase Date</b>
          <b>Mobile No.</b>
          <b>Price</b>
          <b>Failed Emis</b>
          <b>Action</b>
        </div>
        {list.map((item,index) =>{
          return (
            <div key={index} className="list-table-format">
              <img src={`${url}/image/`+item.image} alt="" />
              <p>{item.name}</p>
              <img src={assets.edit_icon} alt="edit" className="edit-icon"onClick={() => handleUpdate(item._id)}/>
              <p>{item.formNo}</p>
              <p>{new Date(item.purchaseDate).toISOString().split("T")[0]}</p>
              <p>{item.mobile1}</p>
              <p>₹{item.price}</p>
              <p>{item.failedEmi}</p>
              <p onClick={()=>removeCustomer(item._id)} className='cursor'>x</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default List_EMI
