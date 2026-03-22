import express from "express"

import authMiddleware from "../middleware/auth.js";
import { BookingList, FullBookingList, removeBooking, TodayBookingList, updateServiceReminder } from "../controllers/BookingController.js";


const BookingRouter = express.Router();

BookingRouter.get("/Booking",authMiddleware,TodayBookingList);
BookingRouter.get("/Booking-list",authMiddleware,BookingList);
BookingRouter.get("/Booking-FullDetails",authMiddleware,FullBookingList);
BookingRouter.post("/Booking-remove",authMiddleware,removeBooking);
BookingRouter.put("/Booking-update",authMiddleware,updateServiceReminder);


export default BookingRouter;