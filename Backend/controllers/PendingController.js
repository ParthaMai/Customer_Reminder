
import fs from 'fs'
import Service_CustomerModel from "../models/Service_CustomerModel.js";
import PendingCallModel from '../models/PendingCallModel.js';


// EMI customers whose reminder is today
const TodayPendingCallsList = async (req, res) => {
    try { 
        const userId = req.userId;
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

         // ================= Pending NORMAL =================
        const PendingList = await Service_CustomerModel.find({
            userId: userId,
            nextReminderDate: { $gte: startOfToday, $lte: endOfToday }
        });
        // Insert found documents into the new collection
        if (PendingList.length > 0) {

        // Get all ids
        const ids = PendingList.map(doc => doc._id);

        // Delete existing documents with same ids
        await PendingCallModel.deleteMany({ _id: { $in: ids } });

        // Insert fresh documents
        await PendingCallModel.insertMany(PendingList);

        }
        if(PendingList.length > 0){
            for (const pending of PendingList) {
              const nextDate = new Date(pending.nextReminderDate);
                  let monthsToAdd = pending.reminderPeriod;

            // 🔥 Special logic for AC yearly
            if (pending.serviceCategory === "AC" && pending.reminderPeriod === 3) {
              monthsToAdd = 12;
            }

            nextDate.setMonth(nextDate.getMonth() + monthsToAdd);

              await Service_CustomerModel.updateOne(
                {
                  _id: pending._id,
                  userId: userId,
                  nextReminderDate: pending.nextReminderDate // 🔐 prevents double update
                },
                {
                  $set: { nextReminderDate: nextDate }
                }
              );
            }
        }

    res.json({ success: true, message: "Reminders stored successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Already Stored in Reminder" });
    }
};


// update the nextReminder data and summary
const updatePending = async (req, res) => {
  try {
    const userId = req.userId;
    const { _id, summary, extendReminder } = req.body;

    // Build dynamic payload
    let payload = {};

 // Update even if the value is null
    if ("summary" in req.body) payload.summary = summary;
    if ("extendReminder" in req.body) payload.extendReminder = extendReminder;

    // ✅ Always set callingDate to today
    payload.callingDate = new Date();

    // If nothing to update
    if (Object.keys(payload).length === 0) {
      return res.json({ success: false, message: "Please provide at least one field to update" });
      
    }

    await Service_CustomerModel.updateOne(
      { _id, userId },
      {
        $push: {
          tasks: {
            isComplete: true,
            completedDate: new Date()
          }
        }
      }
    );

    const updated = await Service_CustomerModel.findByIdAndUpdate(
      {
        _id: _id,
        userId: userId
      },
      { $set: payload },
      { returnDocument: "after" }
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
const PendingList = async (req, res) => {
  try {
    const userId = req.userId;
    const { serviceCategory } = req.query;
    // Get page and limit from query params (default to 1 and 10)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Fetch only the current page of reminders
    const query = {
      userId,
      ...(serviceCategory && { serviceCategory })
    };
    const data = await PendingCallModel.find(query)
      .sort({ create: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count of reminders for pagination info
    const totalRecords = await PendingCallModel.countDocuments(query);

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
const FullPendingList = async (req,res) => {
    try {
        const userId = req.userId;
        const id = req.query.id;

    const Pending = await PendingCallModel.findOne({
      _id: id,
      userId: userId
    });
        res.json({success:true,data:Pending})
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

// remove Service customer 
const removePending = async (req,res) => {

    try{
        const customer = await PendingCallModel.findOneAndDelete({
          _id: req.body.id,
          userId: req.userId
        });

        if (!customer) {
            return res.json({ success: false, message: "Customer not found" });
        }

        res.json({success:true, message:"Call Data Removed"})
    }catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

// i thought this is delete later
// delete old reminder which is old morethan 10days
const deleteOldReminders = async (req,res) => {
  try {
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 7);

    const result = await ReminderModel.deleteMany({
      create: { $lt: tenDaysAgo }
    });
    res.json({success: true,deletedCount: result.deletedCount});
  } catch (error) {
    res.status(500).json({ success: false });
  }
};






export {TodayPendingCallsList, PendingList, FullPendingList, removePending, updatePending, deleteOldReminders};
