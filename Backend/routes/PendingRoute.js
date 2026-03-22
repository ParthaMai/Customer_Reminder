import express from "express"
import { FullPendingList, PendingList, removePending, TodayPendingCallsList, updatePending } from "../controllers/PendingController.js";
import authMiddleware from "../middleware/auth.js";


const PendingRouter = express.Router();

PendingRouter.get("/pending",authMiddleware,TodayPendingCallsList);
PendingRouter.get("/pending-list",authMiddleware,PendingList);
PendingRouter.get("/pending-fulllist",authMiddleware,FullPendingList);
PendingRouter.post("/remove",authMiddleware,removePending);
PendingRouter.post("/extend-date",authMiddleware,updatePending);



export default PendingRouter;