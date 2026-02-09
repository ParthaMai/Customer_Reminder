import mongoose from "mongoose";
import EmiModel from "./models/EmiModel.js";

const MONGO_URI = 'mongodb+srv://parthamaity2004_db_user:Partha988373@cluster1.yr6zp7r.mongodb.net/Sonar-Bangla';

const migrateEmiData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Fetch all EMI documents
    const emis = await EmiModel.find({});

    for (const emi of emis) {
      let updated = false;

      // 1️⃣ nextReminderDate
    if (
      emi.purchaseDate &&
      emi.reminderPeriod != null
    ) {
      const today = new Date();
      const firstReminder = new Date(emi.purchaseDate);
      firstReminder.setMonth(firstReminder.getMonth() + emi.reminderPeriod);

      while (firstReminder < today) {
        firstReminder.setMonth(
          firstReminder.getMonth() + emi.reminderPeriod
        );
      }

      emi.nextReminderDate = firstReminder;
    }

      // 2️⃣ summary → store as string "null" if missing
      if (emi.summary === undefined || emi.summary === null || emi.summary === "") {
        emi.summary = "null";
        updated = true;
      }

      // 3️⃣ extendReminder → actual null if missing
      if (emi.extendReminder === undefined || emi.extendReminder === "") {
        emi.extendReminder = null;
        updated = true;
      }

      // 4️⃣ birthday → actual null if missing or dob missing
      if (!emi.birthday) {
        if (emi.dob) {
          const today = new Date();
          const dob = new Date(emi.dob);
          const nextBirthday = new Date(Date.UTC(
            today.getFullYear(),
            dob.getMonth(),
            dob.getDate()
          ));
          emi.birthday = nextBirthday;
        } else {
          emi.birthday = null;
        }
        updated = true;
      }

      // Save if anything updated
      if (updated) {
        await emi.save();
        console.log(`Updated EMI: ${emi._id}`);
      }
    }

    console.log("Migration completed!");
    process.exit(0);
  } catch (error) {
    console.error("Migration error:", error);
    process.exit(1);
  }
};

migrateEmiData();
