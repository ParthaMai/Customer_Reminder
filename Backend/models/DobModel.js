import mongoose from "mongoose";

const DobSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true
    },

    formNo: {
      type: Number,
      required: true,
      unique: true
    },

    purchaseDate: {
      type: Date,
      required: true
    },

    mobile1: {
      type: String,
      required: true,
      length: 10,
      index: true
    },

    mobile2: {
      type: String,
      length: 10
    },

    mobile3: {
      type: String,
      length: 10
    },

    mobile4: {
      type: String,
      length: 10
    },

    description: {
      type: String
    },

    fatherName: {
      type: String
    },

    aadhar: {
      type: String,
      length: 12
    },

    voterId: {
      type: String,
      length: 10
    },

    age: {
      type: Number,
      required: true
    },

    pan: {
      type: String,
      length: 10
    },

    dob: {
      type: Date,
      default: null
    },

    cibil: {
      type: Number
    },

    pinCode: {
      type: String,
      length: 6
    },

    qualification: {
      type: String
    },

    occupation: {
      type: String
    },

    mobileModel: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    emiCharges: {
      type: Number,
      required: true,
      min: 0
    },

    emiTenure: {
      type: Number,
      required: true
    },

    failedEmi: {
      type: Number,
      required: true,
      min: 0
    },

    reminderPeriod: {
      type: Number,
      required: true
    },

    image: {
      type: String 
    },

    // Store the next Upcoming Emi
     nextReminderDate: { 
      type: Date, 
      index: true 
    },
    summary: {
      type: String
    },
    extendReminder: {
      type: Date,
      index: true
    },
    birthday: {
      type: Date,
      index: true
    }
  },
  { timestamps: true }
);


const DobModel =mongoose.models.dob || mongoose.model("Birthday_Customer-data",DobSchema)

export default DobModel;
