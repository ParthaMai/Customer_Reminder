import Service_CustomerModel from "../models/Service_CustomerModel.js";



const addService_Customer = async (req,res) => {

    let services = [];

    try {
        services = JSON.parse(req.body.services);
    } catch {
        return res.json({ success: false, message: "Invalid services format" });
    }
    
    const Service_Customer = new Service_CustomerModel({
        userId: req.userId,
        name: req.body.name,
        serviceDate: req.body.serviceDate,

        mobile1: req.body.mobile1,
        mobile2: req.body.mobile2,

        description: req.body.description,
        serviceCategory: req.body.serviceCategory,

        dob: req.body.dob,

        services: services,

        reminderPeriod: req.body.reminderPeriod,
        totalPrice: req.body.totalPrice

    })
    try{
        await Service_Customer.save(); // This is save data in mongodb
        res.json({success: true,message:"Customer Data Added"})
    }
    catch(error){
        console.log(error)
        res.json({success:false,message:"Detect Error"})
    }
}

// Enable paginatin concept
const Service_Customer_List = async (req, res) => {
  try {
    const userId = req.userId;
    const { serviceCategory } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {
      userId,
      ...(serviceCategory && { serviceCategory })
    };
    const data = await Service_CustomerModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalRecords = await Service_CustomerModel.countDocuments(query);

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

// Search customer Data
const SearchServiceCustomer = async (req, res) => {
  try {
    const userId = req.userId;
    const { field, value, page = 1, limit = 10, serviceCategory } = req.query;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;
    const allowedFields = ["name", "mobile1"];
    if (!allowedFields.includes(field)) {
    return res.json({ success: false, message: "Invalid search field" });
    }
    let query = {
      userId,
      ...(serviceCategory && { serviceCategory })
    };
    query[field] = { $regex: value, $options: "i" };

    const data = await Service_CustomerModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const totalRecords = await Service_CustomerModel.countDocuments(query);

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

// remove Service customer 
const removeCustomer = async (req,res) => {

    try{
        const customer = await Service_CustomerModel.findOneAndDelete({
          _id: req.body.id,
          userId: req.userId
        });

        if (!customer) {
            return res.json({ success: false, message: "Customer not found" });
        }

        res.json({success:true, message:"Customer Removed"})
    }catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}


// one Service customer Fulllist
const FullServiceList = async (req,res) => {
    try {
      const customer = await Service_CustomerModel.findOne({
        _id: req.query.id,
        userId: req.userId
      });
      res.json({success:true,data:customer})
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

// Update Customer Data
const updateField = async (req, res) => {
  try {

    const { _id, services, ...updateFields } = req.body;

    // If services sent as JSON string (from FormData)
    if (services) {
      try {
        if (typeof services === "string") {
          updateFields.services = JSON.parse(services);
        } else {
          updateFields.services = services;
        }
      } catch {
        return res.json({ success: false, message: "Invalid services format" });
      }
    }

    const updated = await Service_CustomerModel.findOneAndUpdate(
      {
        _id: _id,
        userId: req.userId   // 🔐 ensure user can update only their data
      },
      updateFields,
      { returnDocument: "after" }
    );

    if (!updated) {
      return res.json({success: false,  message: "Customer not found"});
    }

    res.json({ success: true, data: updated, message: "Customer updated successfully" });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Server Error"});
  }
};

// update the Booking information
const updateBooking = async (req, res) => {
  try {
    const userId = req.userId;
    const { _id, serviceType, address, bookingDate, serviceCategory } = req.body;

    let payload = {};

    if ("serviceType" in req.body) payload.serviceType = serviceType;
    if ("address" in req.body) payload.address = address;
    if ("bookingDate" in req.body) payload.bookingDate = new Date(bookingDate);
    if("serviceCategory" in req.body) payload.serviceCategory = serviceCategory;

    if (Object.keys(payload).length === 0) {
      return res.json({ success: false, message: "Please provide at least one field to update" });
    }

    const updated = await Service_CustomerModel.findOneAndUpdate(
      { _id: _id, userId: userId },
      { $set: payload },
      { returnDocument: "after" }
    );

    if (!updated) {
      return res.json({ success: false, message: "Booking not found" });
    }

    res.json({ success: true, message: "Booking updated successfully" });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Server error" });
  }
};

// Complete the appointment so that calculate total earning
const completeAppointment = async (req, res) => {
    try {
        const { id } = req.body;

        // ✅ First get booking
        const existingBooking = await Service_CustomerModel.findById(id);

        if (!existingBooking) {
            return res.json({ success: false, message: "Booking not found"});
        }

        // ✅ Use serviceDate from DB
        const booking = await Service_CustomerModel.findByIdAndUpdate(
            id,
            {
                isCompleted: true,
                completedAt: existingBooking.serviceDate
            },
            {
                returnDocument: "after"
            }
        );

        res.json({
            success: true,
            message: "Appointment completed"
        });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error" });
    }
};

//Check The number is already exist or not
const checkMobileExists = async (req, res) => {
  try {
    const userId = req.userId;
    const { mobile, serviceCategory } = req.query;

    if (!mobile || !serviceCategory) {
      return res.status(400).json({ success: false, message: "Mobile and serviceCategory are required" });
    }

    const existingCustomer = await Service_CustomerModel.findOne({
      userId,
      mobile1: mobile,
      serviceCategory: serviceCategory   // 🔥 KEY CHANGE
    });

    if (existingCustomer) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({success: false, message: "Error checking mobile" });
  }
};

export {addService_Customer, Service_Customer_List, SearchServiceCustomer,removeCustomer,FullServiceList, updateField, updateBooking, completeAppointment, checkMobileExists}