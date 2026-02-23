import CashModel from "../models/CashModel.js";
import EmiModel from "../models/EmiModel.js";
import ReminderModel from "../models/ReminderModel.js";
import fs from 'fs'


// EMI customers whose reminder is today
const TodayEmiList = async (req, res) => {
    try { 
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

         // ================= EMI NORMAL =================
        const EmiList = await EmiModel.find({
            nextReminderDate: { $gte: startOfToday, $lte: endOfToday }
        });
        // Insert found documents into the new collection
        if (EmiList.length > 0) {
          console.log("hoye6e")
           const insertedDocs = await ReminderModel.insertMany(EmiList);

            console.log("Inserted count:", insertedDocs.length);
            console.log("First inserted ID:", insertedDocs[0]._id);
        }
        if(EmiList.length > 0){
            for (const emi of EmiList) {
              console.log("+Reminder")
                await emi.markReminderSent();
            }
        }

        const emiExtendReminderList = await EmiModel.find({
            extendReminder: { $gte: startOfToday, $lte: endOfToday }
        });
       
        if(emiExtendReminderList.length >0){
            await ReminderModel.insertMany(emiExtendReminderList);
        } 
        if(emiExtendReminderList.length > 0){
            for (const extend of emiExtendReminderList){
                await extend.minimizeReminder();
            }
        }

           // ================= CASH NORMAL =================
        const CashList = await CashModel.find({
          nextReminderDate: { $gte: startOfToday, $lte: endOfToday }
        });
        console.log("yes")

        if (CashList.length > 0) {
          await ReminderModel.insertMany(CashList);
          console.log("hel")
          for (const cash of CashList) {
            console.log("hi")
            await cash.markReminderCash();
          }
        }

        // ================= CASH EXTEND =================
        const cashExtendReminderList = await CashModel.find({
          extendReminder: { $gte: startOfToday, $lte: endOfToday }
        });

        if (cashExtendReminderList.length > 0) {
          console.log("Extend")
          await ReminderModel.insertMany(cashExtendReminderList);
          for (const extend of cashExtendReminderList) {
            await extend.minimizeReminderCash();
          }
        }
   

    res.json({ success: true, message: "Reminders stored successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Already Stored in Reminder" });
    }
};


// update the nextReminder data and summary
const updateReminder = async (req, res) => {
  try {
    const { _id, summary, extendReminder } = req.body;

    // Build dynamic payload
    let payload = {};

 // Update even if the value is null
    if ("summary" in req.body) payload.summary = summary;
    if ("extendReminder" in req.body) payload.extendReminder = extendReminder;

    // If nothing to update
    if (Object.keys(payload).length === 0) {
      return res.json({ success: false, message: "Please provide at least one field to update" });
    }

    const updated = await ReminderModel.findByIdAndUpdate(
      _id,
      { $set: payload },
      { new: true }
    );

    if (!updated) {
      return res.json({ success: false, message: "Reminder not found" });
    }

    res.json({ success: true, message: "Reminder updated successfully"});

  } catch (error) {
    console.error(error); 
    res.json({ success: false, message: "Server error" });
  }
};



// all Remind customer list with pagination
const RemindList = async (req, res) => {
  try {
    // Get page and limit from query params (default to 1 and 10)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Fetch only the current page of reminders
    const data = await ReminderModel.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count of reminders for pagination info
    const totalRecords = await ReminderModel.countDocuments();

    // Send response
    res.json({
      success: true,
      data,
      pagination: {
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// one Remind customer Fulllist
const FullRemindList = async (req,res) => {
    try {
        const Remind = await ReminderModel.findById(req.query.id);
        res.json({success:true,data:Remind})
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

// remove Reminder customer 
const removeReminder = async (req,res) => {

    try{

        // this is food data deleted from database
        await ReminderModel.findByIdAndDelete(req.body.id);
        res.json({success:true, message:"Customer Removed"})
    }catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

// delete old reminder which is old morethan 10days
const deleteOldReminders = async (req,res) => {
  try {
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 7);

    const result = await ReminderModel.deleteMany({
      createdAt: { $lt: tenDaysAgo }
    });

    res.json({success: true,deletedCount: result.deletedCount});
  } catch (error) {
    res.status(500).json({ success: false });
  }
};






export {TodayEmiList, RemindList, FullRemindList, removeReminder, updateReminder, deleteOldReminders};
