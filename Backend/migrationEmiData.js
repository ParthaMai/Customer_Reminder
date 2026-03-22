import mongoose from "mongoose";
import CashModel from "./models/CashModel.js";
import XLSX from "xlsx";

const MONGO_URI = 'mongodb+srv://parthamaity2004_db_user:Partha988373@cluster1.yr6zp7r.mongodb.net/Sonar-Bangla';

const migrateExcelData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Read Excel file
    const workbook = XLSX.readFile("./janu22_march22.csv"); // change file name
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(sheet);

    console.log("First row preview:", data[0]);
    // Map Excel data to your schema format
  const formattedData = data.map(row => {
    let fullDate;

    if (typeof row.purchaseDate === "number") {
      fullDate = new Date((row.purchaseDate - 25569) * 86400 * 1000);
    } else {
      fullDate = new Date(row.purchaseDate);
    }

    if (isNaN(fullDate)) return null;

    fullDate.setHours(0, 0, 0, 0);

    // 🔥 Calculate next reminder here
    const firstReminder = new Date(fullDate);
    firstReminder.setMonth(firstReminder.getMonth() + 11);

    const today = new Date();
    while (firstReminder < today) {
      firstReminder.setMonth(firstReminder.getMonth() + 11);
    }

    return {
      name: row.name,
      purchaseDate: fullDate,
      mobile1: row.mobile1,
      mobileModel: row.mobileModel,
      price: row.price,
      reminderPeriod: 11,
      nextReminderDate: firstReminder
    };
  }).filter(Boolean);

    // Insert into MongoDB
    await CashModel.insertMany(formattedData);

    console.log(`Migration completed. ${formattedData.length} records inserted.`);
    process.exit(0);

  } catch (error) {
    console.error("Migration error:", error);
    process.exit(1);
  }
};

migrateExcelData();
