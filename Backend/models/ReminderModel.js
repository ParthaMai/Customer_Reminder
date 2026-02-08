import mongoose from "mongoose";


const ReminderSchema = new mongoose.Schema(
  {
    payment: {
        type: String
    },
    name: {
      type: String,
      required: true,
      trim: true,
      index: true
    },

    formNo: {
      type: String
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
      type: Number
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
      min: 0
    },

    emiTenure: {
      type: Number,
    },

    failedEmi: {
      type: Number,
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



// method
ReminderSchema.methods.extendReminderSent = async function () {
  this.nextReminderDate = new Date(this.extendReminder);
  await this.save();
};



const ReminderModel = mongoose.models.ReminderEmis || mongoose.model("ReminderEmis", ReminderSchema);

export default ReminderModel;