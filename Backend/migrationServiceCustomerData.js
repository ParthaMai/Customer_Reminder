import mongoose from "mongoose";

import XLSX from "xlsx";
import Service_CustomerModel from "./models/Service_CustomerModel.js";
import PendingCallModel from "./models/PendingCallModel.js";

const MONGO_URI = 'mongodb+srv://parthamaity2004_db_user:Partha988373@cluster1.yr6zp7r.mongodb.net/Sonar-Bangla';

const migrateExcelData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Read Excel file
    const workbook = XLSX.readFile("./sep21_nov21.csv"); // change file name
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(sheet);

    console.log("First row preview:", data[0]);
   // Map Excel data to schema format
    const formattedData = data.map(row => {
      let serviceDate;
      if (typeof row.serviceDate === "number") {
        // Excel date conversion
        serviceDate = new Date((row.serviceDate - 25569) * 86400 * 1000);
      } else {
        serviceDate = new Date(row.serviceDate);
      }

      if (isNaN(serviceDate)) return null;
      serviceDate.setHours(0, 0, 0, 0);

      // Calculate first nextReminderDate (your existing logic)
      const firstReminder = new Date(serviceDate);
      const reminderPeriod = 11; // default, adjust if needed
      firstReminder.setMonth(firstReminder.getMonth() + reminderPeriod);
      const today = new Date();
      while (firstReminder < today) {
        firstReminder.setMonth(firstReminder.getMonth() + reminderPeriod);
      }

      // Map Excel description to services array
      const servicesArray = [{
        description: row.description || row["service Description"] || "No description",
        price: Number(row.totalPrice) || 0
      }];

      return {
        userId: "69a9bc87999b8185641d70d7", // set dynamically if needed
        name: row.name,
        mobile1: row.mobile1,
        serviceDate: serviceDate,
        services: servicesArray,
        totalPrice: Number(row.totalPrice) || 0,
        reminderPeriod: reminderPeriod,
        nextReminderDate: firstReminder,
        serviceCategory: "Chimney",

      };
    }).filter(Boolean);

    // Insert into MongoDB
    await PendingCallModel.insertMany(formattedData);

    console.log(`Migration completed. ${formattedData.length} records inserted.`);
    process.exit(0);

  } catch (error) {
    console.error("Migration error:", error);
    process.exit(1);
  }
};

migrateExcelData();
