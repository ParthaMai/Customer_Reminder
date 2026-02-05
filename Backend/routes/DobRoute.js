import express from "express"
import { DobList, FullDobList, removeDob, TodayDobList } from "../controllers/DobController.js";

const DobRouter = express.Router();

DobRouter.get("/dob-remind",TodayDobList);
DobRouter.get("/dob-list", DobList);
DobRouter.get("/full-list",FullDobList)
DobRouter.post("/delete",removeDob)

export default DobRouter;