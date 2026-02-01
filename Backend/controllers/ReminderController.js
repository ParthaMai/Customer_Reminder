import EmiModel from "../models/EmiModel.js";
import ReminderModel from "../models/ReminderModel.js";


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
    await ReminderModel.insertMany(EmiList);
    
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


export {TodayEmiList};
