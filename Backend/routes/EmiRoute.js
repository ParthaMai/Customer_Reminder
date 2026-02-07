import express from "express"
import { addEmi, EmiList, FullEmiList, removeCustomer, SearchEmi, updateField, updateReminder } from "../controllers/EmiCotroller.js"
import upload from "../middleware/upload.js";

const EmiRouter = express.Router();




EmiRouter.post("/add",upload.single("image"),addEmi);

EmiRouter.get("/list",EmiList)

EmiRouter.post("/remove",removeCustomer);

EmiRouter.get("/fullList",FullEmiList);

EmiRouter.get("/searchEmi",SearchEmi);

EmiRouter.post("/extend-reminder",updateReminder)

EmiRouter.put("/update", updateField);








export default EmiRouter;