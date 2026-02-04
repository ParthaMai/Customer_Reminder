import express from "express"
import { TodayDobList } from "../controllers/DobController.js";

const DobRouter = express.Router();

DobRouter.get("/dob-remind",TodayDobList);

export default DobRouter;