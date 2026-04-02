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

const Booking_CustomerSchema = new mongoose.Schema(
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
    }
  },
  { timestamps: true }
);
Booking_CustomerSchema.index({ userId: 1, name: 1 });
Booking_CustomerSchema.index({ userId: 1, mobile1: 1 });
Booking_CustomerSchema.index({ userId: 1, _id: 1 });
Booking_CustomerSchema.index({ userId: 1, create: -1 });


const BookingCustomerModel =mongoose.models.Booking_Customer_data || mongoose.model("Booking_Customer_data",Booking_CustomerSchema)

export default BookingCustomerModel;
