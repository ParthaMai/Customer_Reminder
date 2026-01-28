import mongoose from "mongoose";

const EmiSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
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
      length: 10
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
    }
  },
  { timestamps: true }
);

const EmiModel =mongoose.models.Emi || mongoose.model("EMI_Customer-data",EmiSchema)

export default EmiModel;
