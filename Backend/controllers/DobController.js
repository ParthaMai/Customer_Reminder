import EmiModel from "../models/EmiModel.js";
import DobModel from "../models/DobModel.js";
import CashModel from "../models/CashModel.js";

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

        // ================= CASH Customer DOB =================
        const CashDobList = await CashModel.find({
          birthday: { $gte: startOfToday, $lte: endOfToday }
        });

        if (CashDobList.length > 0) {
          await DobModel.insertMany(CashDobList);
          for (const cash of CashDobList) {
            await cash.markDobCash();
          }
        }



    res.json({ success: true, message: "Dob stored successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// all Dob Remind customer list
const DobList = async (req, res) => {
  try {
    // Get page and limit from query params (default to 1 and 10)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Fetch only the current page of DOB records
    const data = await DobModel.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalRecords = await DobModel.countDocuments();

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

// Full details
const FullDobList = async (req,res) => {
    try {
        const Dob = await DobModel.findById(req.query.id);
        res.json({success:true,data: Dob})
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

// remove Dob customer 
const removeDob = async (req,res) => {

    try{
        // this is food data deleted from database
        await DobModel.findByIdAndDelete(req.body.id);
        res.json({success:true, message:"Birthday Removed"})
    }catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

// Remove DOB after 1 day
const deleteOldDob = async (req, res) => {
  try {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const result = await DobModel.deleteMany({
      create: { $lt: oneDayAgo }
    });
    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};








export {TodayDobList, DobList, FullDobList, removeDob, deleteOldDob};