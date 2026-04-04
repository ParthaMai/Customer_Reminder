import Service_CustomerModel from "../models/Service_CustomerModel.js";


// this is for weekly Earning
const getWeeklyEarnings = async (req, res) => {
    try {
        const userId = req.userId;

        const now = new Date();

        // Start of week (Sunday)
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        // End of week
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);

        const result = await Service_CustomerModel.aggregate([
            {
                $match: {
                    userId: userId,
                    isCompleted: true,
                    completedAt: {
                        $gte: startOfWeek,
                        $lt: endOfWeek
                    }
                }
            },
            {
                $group: {
                    _id: { $dayOfWeek: "$completedAt" },
                    total: { $sum: "$totalPrice" }
                }
            }
        ]);

        // Default full week
        const weekData = {
            Sunday: 0,
            Monday: 0,
            Tuesday: 0,
            Wednesday: 0,
            Thursday: 0,
            Friday: 0,
            Saturday: 0
        };

        const map = {
            1: "Sunday",
            2: "Monday",
            3: "Tuesday",
            4: "Wednesday",
            5: "Thursday",
            6: "Friday",
            7: "Saturday"
        };

        result.forEach(item => {
            weekData[map[item._id]] = item.total;
        });

        res.json({
            success: true,
            data: weekData
        });

    } catch (error) {
        res.json({ success: false, message: "Error" });
    }
};


// This is for service History
const getServiceHistoryByDate = async (req, res) => {
  try {
    const userId = req.userId;
    const { date } = req.query;

    if (!date) {
      return res.json({ success: false, message: "Date is required" });
    }

    // Start & End of selected day
    const start = new Date(date);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setUTCHours(23, 59, 59, 999);

const customers = await Service_CustomerModel.find({
  userId,
  isCompleted: true
});

let filteredData = [];

customers.forEach(customer => {
  const matchedServices = customer.serviceHistory.filter(s => {
    const d = new Date(s.serviceDate);
    return d >= start && d <= end;
  });

  if (matchedServices.length > 0) {
    filteredData.push({
      ...customer._doc,
      serviceHistory: matchedServices
    });
  }
});

res.json({ success: true, data: filteredData});

  } catch (error) {
    console.error(error);
    res.json({  success: false, message: "Server error" });
  }
};


export {getWeeklyEarnings, getServiceHistoryByDate}