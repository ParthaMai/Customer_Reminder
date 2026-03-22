import express from "express"
import authMiddleware from "../middleware/auth.js";
import { getServiceHistoryByDate, getWeeklyEarnings } from "../controllers/TodayEarnController.js";


const TodayEarnRouter = express.Router();

TodayEarnRouter.get("/weekly",authMiddleware,getWeeklyEarnings);
TodayEarnRouter.get("/service-history", authMiddleware, getServiceHistoryByDate )




export default TodayEarnRouter;