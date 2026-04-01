import mongoose from "mongoose";
import Service_CustomerModel from "./models/Service_CustomerModel.js";

const MONGO_URI = 'mongodb+srv://parthamaity2004_db_user:Partha988373@cluster1.yr6zp7r.mongodb.net/Sonar-Bangla';

const migrateServiceCustomerData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // 🔍 Find only old records
    const customers = await Service_CustomerModel.find({
      "serviceHistory.0.services.0": { $exists: false }, // 🔥 key fix
        services: { $exists: true }
    });

    console.log(`📦 Found ${customers.length} old records`);

    if (customers.length === 0) {
      console.log("✅ No migration needed");
      process.exit(0);
    }

console.log("Found:", customers.length);

customers.forEach(c => {
  console.log("ID:", c._id);
  console.log("ID:", c.services);


  console.log("----------------------");
});
    console.log("🎉 Migration completed successfully");
    process.exit(0);

  } catch (error) {
    console.error("❌ Migration error:", error);
    process.exit(1);
  }
};

migrateServiceCustomerData();