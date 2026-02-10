import mongoose from "mongoose";

const EmiSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true
    },

    formNo: {
      type: String,
      required: true,
      unique: true,
      index: true
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
      length: 12,
      index: true
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

// ===== Pre-save middleware: set first reminder =====
EmiSchema.pre("save", function () {
  if (this.isModified("purchaseDate") && this.purchaseDate && this.reminderPeriod != null && !this.isModified("nextReminderDate")) {
    const today = new Date();
    const firstReminder = new Date(this.purchaseDate);
    firstReminder.setMonth(firstReminder.getMonth() + this.reminderPeriod);

    while (firstReminder < today) {
      firstReminder.setMonth(
        firstReminder.getMonth() + this.reminderPeriod
      );
    }
    this.nextReminderDate = firstReminder;
  }
});

// method
EmiSchema.methods.markReminderSent = async function () {
  const nextDate = new Date(this.nextReminderDate);
  nextDate.setUTCMonth(nextDate.getUTCMonth() + this.reminderPeriod);
  this.nextReminderDate = nextDate;
  await this.save();
};

EmiSchema.methods.minimizeReminder = async function () {
  if (!this.extendReminder) return; // safety check for null
  const minimizeDate = new Date(this.extendReminder);
  minimizeDate.setMonth(minimizeDate.getMonth() - 1);
  this.extendReminder = minimizeDate;
  await this.save();
}

// This is for calculate Birthday
EmiSchema.pre("save", function () {
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
EmiSchema.methods.markDobSent = async function (){
  if(!this.birthday) return;
  const nextBirthday = new Date(this.birthday);
  nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
  
  this.birthday = nextBirthday;
  await this.save();
}


const EmiModel =mongoose.models.Emi || mongoose.model("EMI_Customer-data",EmiSchema)

export default EmiModel;
