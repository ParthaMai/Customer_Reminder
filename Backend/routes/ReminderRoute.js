import express from "express"
import { TodayEmiList } from "../controllers/ReminderController.js"

const ReminderRouter = express.Router();

ReminderRouter.get("/remind",TodayEmiList);


export default ReminderRouter;