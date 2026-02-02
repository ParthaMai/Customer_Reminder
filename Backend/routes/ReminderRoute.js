import express from "express"
import { deleteOldReminders, FullRemindList, RemindList, removeReminder, TodayEmiList, updateReminder } from "../controllers/ReminderController.js"

const ReminderRouter = express.Router();

ReminderRouter.get("/remind",TodayEmiList);
ReminderRouter.get("/remind-list", RemindList);
ReminderRouter.get("/fullDetails",FullRemindList);
ReminderRouter.post("/remove-reminder",removeReminder);
ReminderRouter.post("/extend-reminder",updateReminder);
ReminderRouter.post("/cleanup-old",deleteOldReminders)



export default ReminderRouter;