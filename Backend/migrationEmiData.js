import mongoose from "mongoose";
import EmiModel from "./models/EmiModel.js";

const MONGO_URI = 'mongodb+srv://parthamaity2004_db_user:Partha988373@cluster1.yr6zp7r.mongodb.net/Sonar-Bangla';

const migrateEmiData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

   // Bulk update all documents to convert formNo to string
    const result = await EmiModel.updateMany(
      {}, // all documents
      [
        { $set: { formNo: { $toString: "$formNo" } } }
      ],
      { updatePipeline: true } // fix for Mongoose 7+
    );

    console.log(`Migration completed. ${result.modifiedCount} documents updated.`);

    process.exit(0);
  } catch (error) {
    console.error("Migration error:", error);
    process.exit(1);
  }
};

migrateEmiData();
