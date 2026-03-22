import mongoose from "mongoose";

const EarningSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    month: {
        type: String,
        required: true
    }, // "January", "February", ...
    year: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        default: 0
    },
    services: {
        type: Number,
        default: 0, // number of services completed in this month
    },
});

EarningSchema.index({ userId: 1, month: 1, year: 1 }, { unique: true });
EarningSchema.index({ userId: 1, year: 1 });

const EarningModel = mongoose.models.Total_Earning_data || mongoose.model("Total_Earning_data", EarningSchema)

export default EarningModel;
