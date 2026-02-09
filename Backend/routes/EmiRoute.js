import express from "express"
import { addEmi, EmiList, FullEmiList, removeCustomer, SearchEmi, updateField, updateReminder } from "../controllers/EmiCotroller.js"
import upload from "../middleware/upload.js";
import uploadAudio from "../middleware/uploadAudio.js";

const EmiRouter = express.Router();




EmiRouter.post("/add",upload.single("image"),addEmi);

EmiRouter.get("/list",EmiList)

EmiRouter.post("/remove",removeCustomer);

EmiRouter.get("/fullList",FullEmiList);

EmiRouter.get("/searchEmi",SearchEmi);

EmiRouter.post("/extend-reminder",updateReminder)

EmiRouter.put("/update", updateField);

// This is for audio 
// EmiRouter.post("/upload-audio",uploadAudio.single("audio"),uploadAudioController);







export default EmiRouter;