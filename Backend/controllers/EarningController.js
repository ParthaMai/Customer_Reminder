
import EarningModel from "../models/EarningModel.js";
import Service_CustomerModel from "../models/Service_CustomerModel.js";

const getMonthlyEarnings = async (req, res) => {
  try {
    const userId = req.userId; // auth middleware
    const year = req.query.year ? Number(req.query.year) : new Date().getFullYear();

    const earnings = await EarningModel.find({ userId, year });

    const months = [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December"
    ];

    const data = {};
    months.forEach(m => data[m] = 0);

    earnings.forEach(e => {
      data[e.month] = e.amount;
    });

    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const calculateTotalEarning = async (req, res) => {
  try {
    const { totalPrice, serviceDate } = req.body;
    const userId = req.userId;
    if (!totalPrice || !serviceDate) {
      return res.status(400).json({ success: false, message: "Missing data" });
    }

    const date = new Date(serviceDate);
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    const months = [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December"
    ];
    const monthName = months[monthIndex];

    // Atomic increment per user/month/year
    const updated = await EarningModel.findOneAndUpdate(
      { userId, month: monthName, year },
      { $inc: { amount: totalPrice, services: 1 } },
      { upsert: true, returnDocument: "after" }
    );

    res.json({ success: true, message: "Monthly earnings updated successfully", data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// Get monthly earnings and service count for current year
const getMonthlyStats = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(400).json({ success: false, message: "userId is required" });
    }

    const year = req.query.year ? Number(req.query.year) : new Date().getFullYear();
    const earnings = await EarningModel.find({ userId, year });

    const months = [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December"
    ];

    // Build object with default 0
    const amount = {};
    const services = {};
    months.forEach(m => {
      amount[m] = 0;
      services[m] = 0;
    });

    earnings.forEach(e => {
      amount[e.month] = e.amount;
      services[e.month] = e.services;
    });

    res.json({ success: true, data: { amount, services } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
export { getMonthlyEarnings, calculateTotalEarning, getMonthlyStats };