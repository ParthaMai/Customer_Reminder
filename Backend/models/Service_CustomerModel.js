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


const Service_CustomerSchema = new mongoose.Schema(
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

    // That is for Today earn 
    isCompleted: {
      type: Boolean,
      default: false,
      index: true
    },
    completedAt: {
      type: Date,
      index: true
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
Service_CustomerSchema.index({ userId: 1, nextReminderDate: 1 });
Service_CustomerSchema.index({ userId: 1, extendReminder: 1 });
Service_CustomerSchema.index({ userId: 1, name: 1 });
Service_CustomerSchema.index({ userId: 1, mobile1: 1 });
Service_CustomerSchema.index({ userId: 1, _id: 1 });
Service_CustomerSchema.index({ userId: 1, createdAt: -1 });
Service_CustomerSchema.index({ userId: 1,isCompleted: 1, completedAt: 1 });
Service_CustomerSchema.index({userId: 1,serviceCategory: 1});
Service_CustomerSchema.index({ userId: 1, isCompleted: 1, serviceDate: -1});

// ===== Pre-save middleware: set first reminder =====
Service_CustomerSchema.pre("save", function () {
  if (this.isModified("serviceDate") && this.serviceDate && this.reminderPeriod != null && !this.isModified("nextReminderDate")) {
    const today = new Date();

    // 🔥 Special logic for AC
    if (this.serviceCategory === "AC" && (this.reminderPeriod === 2 || this.reminderPeriod === 3)) {
      let targetYear;

      if (this.reminderPeriod === 2) {
        targetYear = today.getFullYear() + 2; // 2028
        this.reminderPeriod = 3;
      } else if (this.reminderPeriod === 3) {
        targetYear = today.getFullYear() + 1; // 2027
      }

      this.nextReminderDate = new Date(targetYear, 0, 3); // Jan 2
      return;
    }

    const firstReminder = new Date(this.serviceDate);
    firstReminder.setMonth(firstReminder.getMonth() + this.reminderPeriod);

    while (firstReminder < today) {
      firstReminder.setMonth(
        firstReminder.getMonth() + this.reminderPeriod
      );
    }
    
    this.nextReminderDate = firstReminder;
  }
});


// This is for calculate Birthday
Service_CustomerSchema.pre("save", function () {
  if (this.isModified("dob") && this.dob && !isNaN(new Date(this.dob))) {
    const today = new Date();
    const dob = new Date(this.dob);

    // Create birthday for current year
    const nextBirthday = new Date(Date.UTC(
      today.getFullYear(),
      dob.getMonth(),
      dob.getDate()
    ));
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }

    this.birthday = nextBirthday;
  }
});

// calculate next birthday
Service_CustomerSchema.methods.markDobCash = async function (){
  if(!this.birthday) return;
  const nextBirthday = new Date(this.birthday);
  nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
  
  this.birthday = nextBirthday;
  await this.save();
}

const Service_CustomerModel =mongoose.models.Service_Customer_data || mongoose.model("Service_Customer_data",Service_CustomerSchema)

export default Service_CustomerModel;
