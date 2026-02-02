import React, { useEffect, useState } from 'react'
import './List_EMI.css'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../../assets/assets'
import { useNavigate } from "react-router-dom";


const List_EMI = ({url}) => {

  // const url = "http://192.168.1.8:4000"

  const navigate = useNavigate();
  const handleUpdate = (id) => {
    navigate("/list_EMI/FullList_Emi", { state: { id } });
  };

  const [list, setList] = useState([]);

  const [searchField, setSearchField] = useState("name");
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

    // Debounce function
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  // Debounced search handler
  const handleSearch = debounce((val) => searchEmi(val), 300);

  // const searchEmi = async (value) => {
  //   try {
  //     if (!value.trim()) {
  //       fetchList();
  //       return;
  //     }

  //     const response = await axios.get(`${url}/api/emi/searchEmi`,{ params: { field: searchField, value: value}});

  //     if (response.data.success) {
  //       setList(response.data.data);
  //     } else {
  //       toast.error("Search error");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("Server error");
  //   }
  // };

  const searchEmi = async (value, pageNumber = 1) => {
  try {
    // If search box is empty, fallback to normal list
    if (!value.trim()) {
      fetchList(1); // fetch normal paginated list
      return;
    }

    const response = await axios.get(`${url}/api/emi/searchEmi`, {
      params: {
        field: searchField,
        value,
        page: pageNumber,  // pass current page
        limit: 10,         // limit per page
      },
    });

    if (response.data.success) {
      setList(response.data.data);
      setPage(response.data.pagination.currentPage);
      setTotalPages(response.data.pagination.totalPages);
    } else {
      toast.error("Search error");
    }
  } catch (error) {
    console.log(error);
    toast.error("Server error");
  }
};



  // const fetchList = async () => {
  //   const response = await axios.get(`${url}/api/emi/list`);
  //   if(response.data.success) {
  //     setList(response.data.data);
  //   }
  //   else{
  //     toast.error("Error");
  //   }
  // }

const fetchList = async (page = 1, value = "") => {

  const response = await axios.get(`${url}/api/emi/list`, {
    params: {
      field: searchField,
      value,
      page,
      limit: 10
    }
  });

  if (response.data.success) {
    setList(response.data.data);
    setTotalPages(response.data.pagination.totalPages);
    setPage(response.data.pagination.currentPage);
  }
};

  useEffect(()=>{
    fetchList(1)
  },[])

  const removeCustomer = async(itemId) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this customer?");
        if (!isConfirmed) return;
        try{
        const response = await axios.post(`${url}/api/emi/remove`,{id:itemId});
        await fetchList();
        if(response.data.success){
          toast.success(response.data.message);
        }
        else{
          toast.error("Error")
        }
      }catch(error){
        toast.error("Server error");
        console.error(error);
      }
      }

  return (
    <div className='list add flex-col'>
      <p>All EMI Customer list</p>
      <div className="search-box">
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder={`Search by ${searchField}`}
            value={searchValue}
            onChange={(e) =>{
              setSearchValue(e.target.value);
              const val = e.target.value;
              handleSearch(val);

            }} 
          />
        </div>
        <select
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
        >
          <option value="name">Name</option>
          <option value="formNo">Form No</option>
          <option value="mobile1">Mobile No</option>
        </select>


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

        {/* Unified pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              disabled={page === 1}
              onClick={() => {
                if (searchValue.trim()) {
                  searchEmi(searchValue, page - 1);
                } else {
                  fetchList(page - 1);
                }
              }}
            >
              Prev
            </button>

            <span>{page} / {totalPages}</span>

            <button
              disabled={page === totalPages}
              onClick={() => {
                if (searchValue.trim()) {
                  searchEmi(searchValue, page + 1);
                } else {
                  fetchList(page + 1);
                }
              }}
            >
              Next
            </button>
          </div>
        )}


        {list.map((item, index) => {
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
