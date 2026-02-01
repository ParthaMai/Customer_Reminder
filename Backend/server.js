import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import EmiRouter from "./routes/EmiRoute.js"
import ReminderRouter from "./routes/ReminderRoute.js"



// app config
const app = express()
const port = 4000

app.use(express.json())
app.use(cors()) // Linked frontend


//Data base connectin
connectDB();

// APi Endpoint
app.use("/api/emi",EmiRouter)
app.use("/image",express.static('uploads'))
app.use("/api/list",ReminderRouter)



app.get("/",(req,res) =>{
    res.send("API Working")
})

app.listen(port,"0.0.0.0", ()=>{
    console.log(`Server Started on http://10.126.209.219:${port}`)
})

// mongodb+srv://parthamaity2004_db_user:Partha988373@cluster1.yr6zp7r.mongodb.net/?