
import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import 'dotenv/config'
import EmiRouter from "./routes/EmiRoute.js"
import ReminderRouter from "./routes/ReminderRoute.js"
import DobRouter from "./routes/DobRoute.js"
import CashRouter from "./routes/CashRoute.js"

import "./cron.js"; 

// app config
const app = express()

const port = process.env.PORT || 4000

app.use(express.json())
app.use(cors()) // Linked frontend


//Data base connectin
connectDB();

// APi Endpoint
app.use("/api/emi",EmiRouter)
app.use("/api/cash",CashRouter);

app.use("/api/reminder-list",ReminderRouter)
app.use("/api/Birthday",DobRouter);



app.get("/",(req,res) =>{
    res.send("API Working")
})
app.get("/api/health", (req, res) => {
  console.log("Health check hit");
  res.json({ status: "ok" });
});


app.listen(port,"0.0.0.0", ()=>{
    console.log(`Server Started on http://10.126.209.219:${port}`)
})

// mongodb+srv://parthamaity2004_db_user:Partha988373@cluster1.yr6zp7r.mongodb.net/?
