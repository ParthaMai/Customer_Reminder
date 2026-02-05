import express from "express"
import { deleteOldDob, DobList, FullDobList, removeDob, TodayDobList } from "../controllers/DobController.js";

const DobRouter = express.Router();

DobRouter.get("/dob-remind",TodayDobList);
DobRouter.get("/dob-list", DobList);
DobRouter.get("/full-list",FullDobList)
DobRouter.post("/delete",removeDob)
DobRouter.post("/remove-old", deleteOldDob);

export default DobRouter;