import mongoose from "mongoose";
import XLSX from "xlsx";
import Service_CustomerModel from "./models/Service_CustomerModel.js";
import PendingCallModel from "./models/PendingCallModel.js";

const MONGO_URI = "mongodb+srv://parthamaity2004_db_user:Partha988373@cluster1.yr6zp7r.mongodb.net/Sonar-Bangla";

const migrateExcelData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // 📂 Read Excel/CSV
    const workbook = XLSX.readFile("./sep21_nov21.csv");
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const data = XLSX.utils.sheet_to_json(sheet);
    console.log("📄 First row preview:", data[0]);

    const today = new Date();

    const formattedData = data.map(row => {
      let serviceDate;

      // ✅ Fix Excel date
      if (typeof row.serviceDate === "number") {
        serviceDate = new Date((row.serviceDate - 25569) * 86400 * 1000);
      } else {
        serviceDate = new Date(row.serviceDate);
      }

      if (isNaN(serviceDate)) return null;
      serviceDate.setHours(0, 0, 0, 0);

      // ✅ Reminder logic
      const reminderPeriod = 11;
      const nextReminder = new Date(serviceDate);

      nextReminder.setMonth(nextReminder.getMonth() + reminderPeriod);
      while (nextReminder < today) {
        nextReminder.setMonth(nextReminder.getMonth() + reminderPeriod);
      }

      // ✅ Services array
      const servicesArray = [
        {
          description:
            row.description ||
            row["service Description"] ||
            "No description",
          price: Number(row.totalPrice) || 0,
        },
      ];

      // ✅ NEW STRUCTURE (IMPORTANT 🔥)
      return {
        userId: "69a9bc87999b8185641d70d7",
        name: row.name,
        mobile1: row.mobile1,

        // keep for quick access (optional)
        serviceDate: serviceDate,
        totalPrice: Number(row.totalPrice) || 0,

        // 🔥 MAIN STRUCTURE
        serviceHistory: [
          {
            serviceDate: serviceDate,
            services: servicesArray,
            totalPrice: Number(row.totalPrice) || 0,
          },
        ],

        reminderPeriod: reminderPeriod,
        nextReminderDate: nextReminder,
        serviceCategory: "Chimney",
      };
    }).filter(Boolean);

    // 🚀 Insert fresh clean data
    await Service_CustomerModel.insertMany(formattedData);

    console.log(`🎉 Done! Inserted ${formattedData.length} records`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Migration error:", error);
    process.exit(1);
  }
};

migrateExcelData();