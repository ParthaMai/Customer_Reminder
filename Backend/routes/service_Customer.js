import express from "express"
import multer from "multer";
import { addService_Customer, checkMobileExists, checkMobileNumber, completeAppointment, createCustomerWithBooking, FullServiceList, removeCustomer, SearchServiceCustomer, Service_Customer_List, updateBooking, updateField } from "../controllers/ServiceController.js";
import authMiddleware from "../middleware/auth.js";


const Service_CustomerRouter = express.Router();
const upload = multer(); 

Service_CustomerRouter.post("/add", upload.none(),authMiddleware,addService_Customer);
Service_CustomerRouter.post("/create-customer", upload.none(),authMiddleware,createCustomerWithBooking);
Service_CustomerRouter.get("/list",authMiddleware,Service_Customer_List);
Service_CustomerRouter.get("/searchCustomer",authMiddleware,SearchServiceCustomer);
Service_CustomerRouter.post("/remove",authMiddleware,removeCustomer);
Service_CustomerRouter.get("/fullList", authMiddleware, FullServiceList);
Service_CustomerRouter.put("/updateCustomer",authMiddleware,updateField);
Service_CustomerRouter.post("/booking-update",authMiddleware,updateBooking);
Service_CustomerRouter.post("/booking-complete",authMiddleware,completeAppointment);
Service_CustomerRouter.get("/check-mobile", authMiddleware, checkMobileExists);
Service_CustomerRouter.get("/check-mobileNo", authMiddleware, checkMobileNumber);


export default Service_CustomerRouter;