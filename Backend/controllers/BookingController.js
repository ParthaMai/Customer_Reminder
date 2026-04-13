import BookingCustomerModel from "../models/BookingModel.js";
import Service_CustomerModel from "../models/Service_CustomerModel.js";





// EMI customers whose reminder is today
const TodayBookingList = async (req, res) => {
    try {
        const userId = req.userId;
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        // ================= Pending NORMAL =================
        const BookingList = await Service_CustomerModel.find({
            userId: userId,
            bookingDate: { $gte: startOfToday, $lte: endOfToday }
        });
        // Insert found documents into the new collection
        if (BookingList.length > 0) {

            // Get all ids
            const ids = BookingList.map(doc => doc._id);

            // Delete existing documents with same ids
            await BookingCustomerModel.deleteMany({ _id: { $in: ids } });

            // Insert fresh documents
            await BookingCustomerModel.insertMany(
                BookingList.map(doc => doc.toObject())
            );
        }
            if (BookingList.length > 0) {
              for (const item of BookingList) {
                if (!item.bookingDate) continue;
    
                const minimizeDate = new Date(item.bookingDate);
                minimizeDate.setMonth(minimizeDate.getMonth() - 1);
    
                await Service_CustomerModel.updateOne(
                  {
                    _id: item._id,
                    bookingDate: item.bookingDate // 🔐 safety
                  },
                  {
                    $set: { bookingDate: minimizeDate }
                  }
                );
              }
            }
        


        res.json({ success: true, message: "Booking cusotomer stored successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Already Stored in Booking" });
    }
};

// All booking List
const BookingList = async (req, res) => {
  try {
    const userId = req.userId;
    const { serviceCategory } = req.query;
    // Get page and limit from query params (default to 1 and 10)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const query = {
      userId,
      ...(serviceCategory && { serviceCategory })
    };

    // Fetch only the current page of reminders
    const data = await BookingCustomerModel.find(query)
      .sort({ create: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count of reminders for pagination info
    const totalRecords = await BookingCustomerModel.countDocuments(query);

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

// one customer Fulllist
const FullBookingList = async (req,res) => {
    try {
        const userId = req.userId;
        const id = req.query.id;

    const Booking = await BookingCustomerModel.findOne({
      _id: id,
      userId: userId
    });
        res.json({success:true,data:Booking})
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

// remove Booking customer 
const removeBooking = async (req,res) => {

    try{
        const customer = await BookingCustomerModel.findOneAndDelete({
          _id: req.body.id,
          userId: req.userId
        });

        if (!customer) {
            return res.json({ success: false, message: "Customer not found" });
        }

        res.json({success:true, message:"Booking Customer Removed"})
    }catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

const updateServiceReminder = async (req, res) => {
  try {
    const userId = req.userId;
    const {  _id,  serviceDate, totalPrice,  reminderPeriod,  serviceCategory, serviceHistory   } = req.body;

    let updateQuery = {
      $set: {}
    };

    const serviceDateObj = serviceDate ? new Date(serviceDate) : null;

    // ✅ SET fields
    if (serviceDateObj) {
      updateQuery.$set.serviceDate = serviceDateObj;
      updateQuery.$set.completedAt = serviceDateObj;
      updateQuery.$set.isCompleted = true;  
    }

    if (reminderPeriod) {
      updateQuery.$set.reminderPeriod = reminderPeriod;
    }

    if (totalPrice !== undefined) {
      updateQuery.$set.totalPrice = totalPrice;
    }

    if (serviceCategory) {
      updateQuery.$set.serviceCategory = serviceCategory;
    }

    // ✅ HANDLE serviceHistory FROM FRONTEND
    if (serviceHistory && Array.isArray(serviceHistory)) {
      const validHistory = serviceHistory.filter(
        (entry) =>
          entry.serviceDate &&
          entry.services &&
          entry.services.length > 0
      ).map(entry => ({
        serviceDate: new Date(entry.serviceDate),
        services: entry.services,
        totalPrice: entry.totalPrice
      }));

      if (validHistory.length > 0) {
        updateQuery.$push = {
          serviceHistory: { $each: validHistory }
        };
      }
    }

    // ✅ CALCULATE NEXT REMINDER (ONLY NON-AC)
    if ( serviceCategory && serviceCategory !== "AC" &&  serviceDateObj &&  reminderPeriod) {
      const nextReminder = new Date(serviceDateObj);
      nextReminder.setMonth(nextReminder.getMonth() + Number(reminderPeriod));

      updateQuery.$set.nextReminderDate = nextReminder;
    }

    // ❌ NOTHING TO UPDATE
     if (
      Object.keys(updateQuery.$set).length === 0 &&
      !updateQuery.$push
    )  {
      return res.json({ success: false, message: "No valid data to update" });
    }

    // ✅ DB UPDATE
    const updated = await Service_CustomerModel.findOneAndUpdate(
      { _id, userId },
      updateQuery,
      { returnDocument: "after" }
    );

    if (!updated) {
      return res.json({ success: false, message: "Customer not found"});
    }

    res.json({ success: true, message: "Booking updated successfully" });

  } catch (error) {
    console.error(error);
    res.json({success: false, message: "Server error" });
  }
};



export { TodayBookingList, BookingList, FullBookingList, removeBooking, updateServiceReminder };