
import fs from 'fs'
import Service_CustomerModel from "../models/Service_CustomerModel.js";
import ServiceReminderModel from '../models/ServiceReminderModel.js';


// EMI customers whose reminder is today
const TodayServiceList = async (req, res) => {
    try { 
        const userId = req.userId;
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

         // ================= Pending NORMAL =================
        const RemindList = await Service_CustomerModel.find({
            userId: userId,
            extendReminder: { $gte: startOfToday, $lte: endOfToday }
        });
        // Insert found documents into the new collection
        if (RemindList.length > 0) {

        // Get all ids
        const ids = RemindList.map(doc => doc._id);

        // Delete existing documents with same ids
        await ServiceReminderModel.deleteMany({ _id: { $in: ids } });

        // Insert fresh documents
        await ServiceReminderModel.insertMany(RemindList);

        }
        if (RemindList.length > 0) {
          for (const item of RemindList) {
            if (!item.extendReminder) continue;

            const minimizeDate = new Date(item.extendReminder);
            minimizeDate.setMonth(minimizeDate.getMonth() - 1);

            await Service_CustomerModel.updateOne(
              {
                _id: item._id,
                extendReminder: item.extendReminder // 🔐 safety
              },
              {
                $set: { extendReminder: minimizeDate }
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
const updateReminder = async (req, res) => {
  try {
    const userId = req.userId;
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
const RemindList = async (req, res) => {
  try {
    const userId = req.userId;
    const { serviceCategory } = req.query;
    // Get page and limit from query params (default to 1 and 10)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = {
      userId,
      ...(serviceCategory && { serviceCategory })
    };
    // Fetch only the current page of reminders
    const data = await ServiceReminderModel.find(query)
      .sort({ create: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count of reminders for pagination info
    const totalRecords = await ServiceReminderModel.countDocuments(query);

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
const FullReminderList = async (req,res) => {
    try {
        const userId = req.userId;
        const id = req.query.id;

    const Reminder = await ServiceReminderModel.findOne({
      _id: id,
      userId: userId
    });
        res.json({success:true,data:Reminder})
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

// remove Service customer 
const removeReminder = async (req,res) => {

    try{
        const customer = await ServiceReminderModel.findOneAndDelete({
          _id: req.body.id,
          userId: req.userId
        });

        if (!customer) {
            return res.json({ success: false, message: "Customer not found" });
        }
        res.json({success:true, message:"Reminder Customer Removed"})
    }catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

// delete old reminder which is old morethan 10days
const deleteOldReminders = async (req,res) => {
  try {
    const { userId } = req.body;
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

    const result = await ServiceReminderModel.deleteMany({
      userId: userId,
      create: { $lt: tenDaysAgo }
    });
    res.json({success: true,deletedCount: result.deletedCount});
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
};


//This is for count Reminders
const getReminderTotalCount = async (req, res) => {
  try {
    const userId = req.userId;

    // ✅ Use UTC (MongoDB stores in UTC)
    const now = new Date();

    const startOfToday = new Date(now);
    startOfToday.setUTCHours(0, 0, 0, 0);

    const endOfToday = new Date(now);
    endOfToday.setUTCHours(23, 59, 59, 999);

    const total = await ServiceReminderModel.countDocuments({
      userId,
      create: {
        $gte: startOfToday,
        $lte: endOfToday
      }
    });

    res.json({ success: true, total });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};





export {TodayServiceList , RemindList, FullReminderList, removeReminder, updateReminder, deleteOldReminders , getReminderTotalCount};
