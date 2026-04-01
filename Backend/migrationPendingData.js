import mongoose from "mongoose";

import XLSX from "xlsx";
import Service_CustomerModel from "./models/Service_CustomerModel.js";
import PendingCallModel from "./models/PendingCallModel.js";
import ServiceReminderModel from "./models/ServiceReminderModel.js";


const MONGO_URI = 'mongodb+srv://parthamaity2004_db_user:Partha988373@cluster1.yr6zp7r.mongodb.net/Sonar-Bangla';


const setTodayExtendReminderForFirst80 = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // ✅ Get today's date (start of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1️⃣ Fetch first 80 records
    const customers = await Service_CustomerModel.find({})
      .sort({ createdAt: 1 }) // optional
      .limit(80);

    console.log(`Found ${customers.length} records`);

    // 2️⃣ Update them (bulk is faster)
    const bulkOps = customers.map(customer => ({
      updateOne: {
        filter: { _id: customer._id },
        update: {
          $set: {
            nextReminderDate: today
          }
        }
      }
    }));

    if (bulkOps.length > 0) {
      await Service_CustomerModel.bulkWrite(bulkOps);
    }

    console.log("✅ Migration completed: extendReminder set to today");

    process.exit(0);
  } catch (error) {
    console.error("❌ Migration error:", error);
    process.exit(1);
  }
};

setTodayExtendReminderForFirst80();