import express from "express"
import multer from "multer";
import { addCash, CashList, FullCashList, removeCustomer, SearchCash, updateField, updateReminder } from "../controllers/CashController.js";


const CashRouter = express.Router();
const upload = multer(); 

CashRouter.post("/add", upload.none(),addCash);
CashRouter.get("/list",CashList);
CashRouter.post("/remove",removeCustomer);
CashRouter.get("/searchCash", SearchCash);
CashRouter.get("/fullList",FullCashList);
CashRouter.put("/update", updateField);
CashRouter.post("/extend-reminder",updateReminder)


export default CashRouter;