import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
      type: String,
      default: ""
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true,
        index: true
    },
    storeName: {
        type: String,
        default: ""
    },
    billPasscode: {
        type: String,
        default: "A"
    },
    totalCustomer: {
        type: Number,
        default: 0
    },
    totalBill:{
        type: Number,
        default: 0
    }
},
    { timestamps: true },
);

userSchema.index({ _id: 1, mobile: 1 });

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;