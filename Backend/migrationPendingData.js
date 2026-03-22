import mongoose from "mongoose";

import XLSX from "xlsx";
import Service_CustomerModel from "./models/Service_CustomerModel.js";
import PendingCallModel from "./models/PendingCallModel.js";

const MONGO_URI = 'mongodb+srv://parthamaity2004_db_user:Partha988373@cluster1.yr6zp7r.mongodb.net/Sonar-Bangla';

const setTodayReminderForFirst100 = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");


     // ✅ Get today (start of day IST-safe)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1️⃣ Fetch first 100 records
    const customers = await Service_CustomerModel.find({})
      .sort({ createdAt: 1 }) // oldest first (optional)
      .limit(80);

    console.log(`Found ${customers.length} records`);

    // 2️⃣ Update them
    for (const customer of customers) {
      await Service_CustomerModel.updateOne(
        {
          _id: customer._id
        },
        {
          $set: {
            bookingDate: today
          }
        }
      );
    }

    console.log("✅ Migration completed: First 100 updated to today");

    process.exit(0);
  } catch (error) {
    console.error("❌ Migration error:", error);
    process.exit(1);
  }
};

setTodayReminderForFirst100();