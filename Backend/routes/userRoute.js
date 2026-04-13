import express from "express"
import { getUserProfile, incrementBill, loginUser, registerUser } from "../controllers/userController.js";
import upload from "../middleware/upload.js";
import authMiddleware from "../middleware/auth.js";


const userRouter = express.Router();

userRouter.post("/register",upload.single("image"), registerUser);
userRouter.post("/login",loginUser);
userRouter.get("/profile", authMiddleware, getUserProfile);
userRouter.post("/increment-bill", authMiddleware, incrementBill);

export default userRouter;
// now setup this userRouter in server.js file