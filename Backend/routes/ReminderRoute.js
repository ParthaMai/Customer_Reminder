import express from "express"
import { FullRemindList, RemindList, removeReminder, TodayEmiList } from "../controllers/ReminderController.js"

const ReminderRouter = express.Router();

ReminderRouter.get("/remind",TodayEmiList);
ReminderRouter.get("/remind-list", RemindList);
ReminderRouter.get("/fullDetails",FullRemindList);
ReminderRouter.post("/remove-reminder",removeReminder);


export default ReminderRouter;