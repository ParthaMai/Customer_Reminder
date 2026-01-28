import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import EmiRouter from "./routes/EmiRoute.js"



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

app.get("/",(req,res) =>{
    res.send("API Working")
})

app.listen(port,()=>{
    console.log(`Server Started on http://localhost:${port}`)
})

// mongodb+srv://parthamaity2004_db_user:Partha988373@cluster1.yr6zp7r.mongodb.net/?