import mongoose from "mongoose";

const serviceItemSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
});

const serviceHistorySchema = new mongoose.Schema({
  serviceDate: {
    type: Date,
    required: true
  },
  services: {
    type: [serviceItemSchema],
    default: []
  },
  totalPrice: {
    type: Number,
    required: true
  }
});

const taskSchema = new mongoose.Schema({
  isComplete: {
    type: Boolean,
    default: false,
    index: true
  },
  completedDate: {
    type: Date,
    default: null
  },
});

const Pending_CustomerSchema = new mongoose.Schema(
  {
    userId:{
        type:String,
        required:true,
        index: true
    },
    name: {
      type: String,
      required: true,
      trim: true,
      index: true
    },

    serviceDate: {
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

    description: {
      type: String
    },

    dob: {
      type: Date,
      default: null
    },

    serviceHistory: {
      type: [serviceHistorySchema],
      default: []
    },

    reminderPeriod: {
      type: Number,
      required: true
    },
    totalPrice:{
      type:Number,
      required:true
    },

    // Store the next Upcoming Cash Reminder
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
    },
    create: {
      type: Date,
      default: Date.now
    },

    //For booking Customer
    serviceType:{
        type: String
    },
    address:{
        type: String
    },
    bookingDate:{
      type: Date,
      index: true
    },
    serviceDenial:{
        type: String
    },
    serviceCategory: {
      type: String,
      enum: ["RO", "Chimney", "AC"]
    },
    // For store Calling Date
    callingDate: {
      type: Date,
      default: null
    },
    // For task
    tasks: {
      type: [taskSchema],
      default: []
    }
  },
  { timestamps: true }
);
Pending_CustomerSchema.index({ userId: 1, name: 1 });
Pending_CustomerSchema.index({ userId: 1, mobile1: 1 });
Pending_CustomerSchema.index({ userId: 1, _id: 1 });
Pending_CustomerSchema.index({ userId: 1, create: -1 });
Pending_CustomerSchema.index({userId: 1,serviceCategory: 1});


const PendingCallModel =mongoose.models.PendingCalls_Customer_data || mongoose.model("PendingCalls_Customer_data",Pending_CustomerSchema)

export default PendingCallModel;
