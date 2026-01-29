import express from "express"
import { addEmi, EmiList, FullEmiList, removeCustomer, SearchEmi } from "../controllers/EmiCotroller.js"
import multer from "multer"

const EmiRouter = express.Router();


// Image storage in upload file

const storage = multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`);
    }
})

const upload = multer({storage:storage})

EmiRouter.post("/add",upload.single("image"),addEmi);

EmiRouter.get("/list",EmiList)

EmiRouter.post("/remove",removeCustomer);

EmiRouter.get("/fullList",FullEmiList);

EmiRouter.get("/searchEmi",SearchEmi);









export default EmiRouter;