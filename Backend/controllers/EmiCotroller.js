import EmiModel from "../models/EmiModel.js";
import fs from 'fs'

// Add EMi Customer

const addEmi = async (req,res) => {
    
    // Check if image exist or not.
    const image_filename = req.file ? req.file.filename : null;

    const emi = new EmiModel({
        name: req.body.name,
        formNo: req.body.formNo,
        purchaseDate: req.body.purchaseDate,

        mobile1: req.body.mobile1,
        mobile2: req.body.mobile2,
        mobile3: req.body.mobile3,
        mobile4: req.body.mobile4,

        description: req.body.description,
        fatherName: req.body.fatherName,

        aadhar: req.body.aadhar,
        voterId: req.body.voterId,

        age: req.body.age,
        pan: req.body.pan,
        dob: req.body.dob,

        cibil: req.body.cibil,
        pinCode: req.body.pinCode,

        qualification: req.body.qualification,
        occupation: req.body.occupation,

        mobileModel: req.body.mobileModel,
        price: req.body.price,

        emiCharges: req.body.emiCharges,
        emiTenure: req.body.emiTenure,

        failedEmi: req.body.failedEmi,
        reminderPeriod: req.body.reminderPeriod,

        image: image_filename
    })
    try{
        await emi.save(); // This is save data in mongodb
        res.json({success: true,message:"EMI Customer Data Added"})
    }
    catch(error){
        console.log(error)
        res.json({success:false,message:"Detect Error"})
    }
}


// all EMi customer list
// const EmiList = async (req,res) => {
//     try {
//         const Emi = await EmiModel.find({}).sort({ createdAt: -1 });
//         res.json({success:true,data:Emi})
//     }
//     catch(error){
//         console.log(error);
//         res.json({success:false,message:"Error"})
//     }
// }



// Enable paginatin concept
const EmiList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const data = await EmiModel.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalRecords = await EmiModel.countDocuments();

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

// one EMi customer Fulllist
const FullEmiList = async (req,res) => {
    try {
        const Emi = await EmiModel.findById(req.query.id);
        res.json({success:true,data:Emi})
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

// const SearchEmi = async (req, res) => {
//   try {
//     const { field, value } = req.query;

//     const allowedFields = ["name", "formNo", "mobile1"];
//     if (!allowedFields.includes(field)) {
//       return res.json({ success: false, message: "Invalid search field" });
//     }

//     let query = {};

//     if (field === "formNo") {
//       query[field] = Number(value);
//     } 
//     else {
//       query[field] = { $regex: value, $options: "i" }; 
//     }

//     const data = await EmiModel.find(query).sort({ createdAt: -1 });

//     res.json({ success: true, data });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: "Error" });
//   }
// };

const SearchEmi = async (req, res) => {
  try {
    const { field, value, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (field === "formNo") query[field] = Number(value);
    else query[field] = { $regex: value, $options: "i" };

    const data = await EmiModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const totalRecords = await EmiModel.countDocuments(query);

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



// remove Emi customer 
const removeCustomer = async (req,res) => {

    try{
        const customer = await EmiModel.findById(req.body.id);
        // delete the image
        fs.unlink(`uploads/${customer.image}`,()=>{})

        // this is food data deleted from database
        await EmiModel.findByIdAndDelete(req.body.id);
        res.json({success:true, message:"Customer Removed"})
    }catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}


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

    const updated = await EmiModel.findByIdAndUpdate(
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


export {addEmi, EmiList, removeCustomer, FullEmiList, SearchEmi, updateReminder}