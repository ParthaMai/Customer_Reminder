import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
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


const Service_ReminderSchema = new mongoose.Schema(
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

    services: [serviceSchema],

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
    }
  },
  { timestamps: true }
);
Service_ReminderSchema.index({ userId: 1, name: 1 });
Service_ReminderSchema.index({ userId: 1, mobile1: 1 });
Service_ReminderSchema.index({ userId: 1, _id: 1 });
Service_ReminderSchema.index({ userId: 1, create: -1 });
Service_ReminderSchema.index({userId: 1,serviceCategory: 1});
// Service_ReminderSchema.index({ create: 1 },{ expireAfterSeconds: 864000 } ); // Delete 10 days

const ServiceReminderModel =mongoose.models.Service_Reminder_data || mongoose.model("Service_Reminder_data",Service_ReminderSchema)

export default ServiceReminderModel;
