import express from "express"
import authMiddleware from "../middleware/auth.js";
import { deleteOldReminders, FullReminderList, getReminderTotalCount, RemindList, removeReminder, TodayServiceList, updateReminder } from "../controllers/ServiceReminderController.js";


const RemindRouter = express.Router();

RemindRouter.get("/remind",authMiddleware,TodayServiceList);
RemindRouter.get("/remind-list",authMiddleware,RemindList);
RemindRouter.get("/Full-Details",authMiddleware,FullReminderList);
RemindRouter.post("/extend-remind",authMiddleware,updateReminder);
RemindRouter.post("/remove-remind",authMiddleware,removeReminder);
RemindRouter.post("/cleanup-old",authMiddleware,deleteOldReminders);
RemindRouter.get("/reminder-count",authMiddleware,getReminderTotalCount);



export default RemindRouter;