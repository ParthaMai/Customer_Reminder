import Service_CustomerModel from "../models/Service_CustomerModel.js";


const addService_Customer = async (req, res) => {
  try {
    const { name, mobile1, mobile2,
      serviceDate, services, totalPrice, reminderPeriod, serviceCategory, description, dob } = req.body;

    const parsedServices = JSON.parse(services);
    const serviceDateObj = new Date(serviceDate);
    const nextReminder = new Date(serviceDateObj);
    if (serviceCategory !== "AC") {

      serviceDateObj.setHours(0, 0, 0, 0);

      // 🔥 Calculate nextReminderDate
      nextReminder.setMonth(nextReminder.getMonth() + Number(reminderPeriod));

      const today = new Date();
      while (nextReminder < today) {
        nextReminder.setMonth(nextReminder.getMonth() + Number(reminderPeriod));
      }
    }

    // 🔍 CHECK EXISTING CUSTOMER
    const existingCustomer = await Service_CustomerModel.findOne({
      userId: req.userId, 
      mobile1,
      serviceCategory
    });

    // =====================================================
    // ✅ CASE 1: NEW CUSTOMER
    // =====================================================
    if (!existingCustomer) {
      const newCustomerData = {
        userId: req.userId,
        name,
        mobile1,
        mobile2,
        description,
        dob,
        serviceDate: serviceDateObj,
        totalPrice,
        reminderPeriod,
        serviceCategory,

        serviceHistory: [
          {
            serviceDate: serviceDateObj,
            services: parsedServices,
            totalPrice
          }
        ]
      };

      // ✅ ONLY if NOT AC (optional: let pre-save handle it instead)
      if (serviceCategory !== "AC") {
        newCustomerData.nextReminderDate = nextReminder;
      }

      const newCustomer = new Service_CustomerModel(newCustomerData);
      await newCustomer.save();

      return res.json({ success: true, message: "Customer added successfully" });
    }

    // =====================================================
    // 🔥 CASE 2: EXISTING CUSTOMER
    // =====================================================

    const updateQuery = {
      $set: {
        serviceDate: serviceDateObj,
        totalPrice,
        reminderPeriod,
        name,
        mobile2,
        description,
        dob
      },
      $push: {
        serviceHistory: {
          serviceDate: serviceDateObj,
          services: parsedServices,
          totalPrice
        }
      }
    };

    // ✅ ONLY for NON-AC → update reminder
    if (serviceCategory !== "AC") {
      updateQuery.$set.nextReminderDate = nextReminder;
    }

    await Service_CustomerModel.updateOne(
      { _id: existingCustomer._id, userId: req.userId },
      updateQuery
    );

    return res.json({ success: true, message: "Customer updated & service added" });

  } catch (error) {
    console.log(error); res.json({ success: false, message: "Error occurred" });
  }
};




// Add Customer in Get invoice section
const addNewCustomer = async (req, res) => {
  try {
    const { name, mobile1, mobile2,  description, dob,  serviceCategory, serviceDate, serviceHistory, reminderPeriod } = req.body;

    // ❌ Validation
    if (!name || !mobile1) {
      return res.json({  success: false,  message: "Name, Mobile & Service Date required"});
    }

        // ✅ Validate serviceHistory
    let validHistory = [];

    if (serviceHistory && Array.isArray(serviceHistory)) {
      validHistory = serviceHistory
        .filter(
          (entry) =>
            entry.serviceDate &&
            Array.isArray(entry.services) &&
            entry.services.length > 0
        )
        .map((entry) => ({
          serviceDate: new Date(entry.serviceDate),
          services: entry.services,
          totalPrice: entry.totalPrice || 0
        }));
    }

    if (validHistory.length === 0) {
      return res.json({ success: false, message: "At least one valid service required" });
    }

    // ✅ Get latest booking (last history item)
    const latest = validHistory[validHistory.length - 1];

    // ✅ Create new customer with booking + invoice
    const newCustomer = new Service_CustomerModel({
      userId: req.userId,

      // Customer Info
      name,
      mobile1,
      mobile2,
      description,
      dob,

      // Service / Booking Info
      serviceCategory,
      serviceDate: latest.serviceDate,  
      serviceHistory: validHistory,
      reminderPeriod,

      // Auto fields
      totalPrice: latest.totalPrice
    });

    const savedCustomer = await newCustomer.save();

    return res.json({ success: true, message: "Customer + Invoice created successfully", customer: savedCustomer });

  } catch (error) {
    console.log(error);
    res.json({success: false,  message: "Server error" });
  }
};


// Create Customer in booking page
const createCustomerWithBooking = async (req, res) => {
  try {
    const {  name, mobile1,  mobile2, description,serviceCategory, dob, serviceType, address, bookingDate} = req.body;

    // ❌ Validation
    if (!name || !mobile1 || !bookingDate) {
      return res.json({ success: false, message: "Name, Mobile & Booking Date required" });
    }

    const bookingDateObj = new Date(bookingDate);
    

    // ✅ Create new customer
    const newCustomer = new Service_CustomerModel({
      userId: req.userId,
      name,
      mobile1,
      mobile2,
      description,
      dob,
      serviceCategory: serviceCategory, // mapping
      serviceType: serviceType,
      address:  address,
      bookingDate: bookingDateObj, 
      serviceDate: bookingDateObj,
      reminderPeriod: 11,
      totalPrice: 0
    });

    const savedCustomer = await newCustomer.save();

    return res.json({ success: true,  message: "Customer and booking created", customer: savedCustomer });

  } catch (error) {
    console.log(error);
    res.json({ success: false,  message: "Server error" });
  }
};

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
    const { field, value, page = 1, limit = 10} = req.query;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;
    const allowedFields = ["name", "mobile1"];
    if (!allowedFields.includes(field)) {
    return res.json({ success: false, message: "Invalid search field" });
    }
    let query = {
      userId
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
    const { _id, serviceType, address, bookingDate, serviceCategory, nextReminderDate } = req.body;

    let payload = {};

    if ("serviceType" in req.body) payload.serviceType = serviceType;
    if ("address" in req.body) payload.address = address;
    if ("bookingDate" in req.body) payload.bookingDate = new Date(bookingDate);
    if("serviceCategory" in req.body) payload.serviceCategory = serviceCategory;
    if ("nextReminderDate" in req.body) payload.nextReminderDate = new Date(nextReminderDate);

    // ✅ Always set callingDate to today
    payload.callingDate = new Date();

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
      return res.json({ exists: true, customer: existingCustomer  });
    } else {
      return res.json({ exists: false });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({success: false, message: "Error checking mobile" });
  }
};

//Check The number is already exist or not without category
const checkMobileNumber = async (req, res) => {
  try {
    const userId = req.userId;
    const { mobile} = req.query;

    if (!mobile) {
      return res.status(400).json({ success: false, message: "Mobile number are required" });
    }

    const existingCustomer = await Service_CustomerModel.findOne({
      userId,
      mobile1: mobile,
    });

    if (existingCustomer) {
      return res.json({ exists: true, customer: existingCustomer  });
    } else {
      return res.json({ exists: false });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({success: false, message: "Error checking mobile" });
  }
};

const getCompletedTasksByDate = async (req, res) => {
  try {
    const userId = req.userId;
    const { date } = req.query;

    if (!date) {
      return res.json({ success: false, message: "Date is required" });
    }

    const selectedDate = new Date(date);

    // 🔥 Create start & end of day
    const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));

    const data = await Service_CustomerModel.find({
      userId,
      tasks: {
        $elemMatch: {
          isComplete: true,
          completedDate: {
            $gte: startOfDay,
            $lte: endOfDay
          }
        }
      }
    })
      .select("name mobile1 tasks")
      .lean();
      let totalCount = 10;

    // 🔥 Filter only matching tasks (important)
    const result = data.map(item => {
      const filteredTasks = item.tasks.filter(t =>
        t.isComplete &&
        new Date(t.completedDate) >= startOfDay &&
        new Date(t.completedDate) <= endOfDay
      );
      // 🔥 count tasks
      totalCount += filteredTasks.length;

      return { _id: item._id, name: item.name, mobile1: item.mobile1, tasks: filteredTasks };
    });

    res.json({ success: true, totalCount,  data: result });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Server error" });
  }
};


export {addService_Customer,createCustomerWithBooking, Service_Customer_List, SearchServiceCustomer,removeCustomer,FullServiceList, updateField, updateBooking,
   completeAppointment, checkMobileExists, checkMobileNumber, addNewCustomer, getCompletedTasksByDate}