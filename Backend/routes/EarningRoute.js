import express from "express"
import authMiddleware from "../middleware/auth.js";
import { calculateTotalEarning, getMonthlyEarnings, getMonthlyStats } from "../controllers/EarningController.js";



const TotalEarningRouter = express.Router();

TotalEarningRouter.get("/monthly",authMiddleware,getMonthlyEarnings);
TotalEarningRouter.post("/Total-Earning",authMiddleware,calculateTotalEarning);
TotalEarningRouter.get("/monthly-service",authMiddleware,getMonthlyStats);





export default TotalEarningRouter;