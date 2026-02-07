import express from "express"
import multer from "multer";
import { addCash, CashList, removeCustomer, SearchCash } from "../controllers/CashController.js";


const CashRouter = express.Router();
const upload = multer(); 

CashRouter.post("/add", upload.none(),addCash);
CashRouter.get("/list",CashList);
CashRouter.post("/remove",removeCustomer);
CashRouter.get("/searchCash", SearchCash);


export default CashRouter;