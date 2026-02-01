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

        const EmiList = await EmiModel.find({
            nextReminderDate: { $gte: startOfToday, $lte: endOfToday }
        });

        // Insert found documents into the new collection
        if (EmiList.length > 0) {
            await ReminderModel.insertMany(EmiList);
        }
    
        for (const emi of EmiList) {
            await emi.markReminderSent();
        }
        
    //     // if for loop is  slow then use this // Update nextReminderDate in parallel
    // await Promise.all(EmiList.map(emi => emi.markReminderSent()));
   

    res.json({ success: true, message: "Reminders stored successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};


// all Remind customer list
const RemindList = async (req,res) => {
    try {
        const Remind = await ReminderModel.find({}).sort({ createdAt: -1 });
        res.json({success:true,data: Remind})
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}


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

// remove Emi customer 
const removeReminder = async (req,res) => {

    try{
        const customer = await ReminderModel.findById(req.body.id);
        // delete the image
        fs.unlink(`uploads/${customer.image}`,()=>{})

        // this is food data deleted from database
        await ReminderModel.findByIdAndDelete(req.body.id);
        res.json({success:true, message:"Customer Removed"})
    }catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}



export {TodayEmiList, RemindList, FullRemindList, removeReminder};
