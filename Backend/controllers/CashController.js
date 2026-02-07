import CashModel from "../models/CashModel.js";

const addCash = async (req,res) => {
    
    const cash = new CashModel({

        name: req.body.name,
        purchaseDate: req.body.purchaseDate,

        mobile1: req.body.mobile1,
        mobile2: req.body.mobile2,
        mobile3: req.body.mobile3,
        mobile4: req.body.mobile4,

        description: req.body.description,
        fatherName: req.body.fatherName,

        aadhar: req.body.aadhar,

        age: req.body.age,
        dob: req.body.dob,

        mobileModel: req.body.mobileModel,
        price: req.body.price,

        reminderPeriod: req.body.reminderPeriod,

    })
    try{
        await cash.save(); // This is save data in mongodb
        res.json({success: true,message:"Cash Customer Data Added"})
    }
    catch(error){
        console.log(error)
        res.json({success:false,message:"Detect Error"})
    }
}


// Enable paginatin concept
const CashList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const data = await CashModel.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalRecords = await CashModel.countDocuments();

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
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// remove Emi customer 
const removeCustomer = async (req,res) => {

    try{
        const customer = await CashModel.findById(req.body.id);

        if (!customer) {
            return res.json({ success: false, message: "Customer not found" });
        }

        // this is food data deleted from database
        await CashModel.findByIdAndDelete(req.body.id);
        res.json({success:true, message:"Customer Removed"})
    }catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}


const SearchCash = async (req, res) => {
  try {
    const { field, value, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const allowedFields = ["name", "mobile1", "aadhar"];
    if (!allowedFields.includes(field)) {
    return res.json({ success: false, message: "Invalid search field" });
    }
    let query = {};
    if (field === "mobile1") {
      query[field] = { $regex: value, $options: "i" };
    } else {
      // partial match for other fields
      query[field] = { $regex: value, $options: "i" };
    }

    const data = await CashModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const totalRecords = await CashModel.countDocuments(query);

    res.json({
      success: true,
      data,
      pagination: {
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
        currentPage: Number(page)
      }
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};




export { addCash, CashList, removeCustomer, SearchCash}