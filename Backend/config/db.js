import mongoose from "mongoose"


export const connectDB = async() => {
    await mongoose.connect('mongodb+srv://parthamaity2004_db_user:Partha988373@cluster1.yr6zp7r.mongodb.net/Sonar-Bangla').then(()=> console.log("DB connected"));
}
