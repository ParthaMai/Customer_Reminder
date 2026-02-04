import EmiModel from "../models/EmiModel.js";
import DobModel from "../models/DobModel.js";

const TodayDobList = async (req, res) => {
    try { 
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        const DobList = await EmiModel.find({
            birthday: { $gte: startOfToday, $lte: endOfToday }
        });

        // Insert found documents into the new collection
        if (DobList.length > 0) {
            await DobModel.insertMany(DobList);
        }
        if(DobList.length > 0){
            for (const dob of DobList) {
                await dob.markDobSent();
            }
        }

    res.json({ success: true, message: "Dob stored successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};


export {TodayDobList};