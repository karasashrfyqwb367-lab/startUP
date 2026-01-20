import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const CompanySchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    industry: { type: String },
    address: { type: String },
    companyEmail: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    HRs: [{ type: Schema.Types.ObjectId, ref: "User" }],
    approvedByAdmin: { type: Boolean, default: false },
    logo: { type: String }, // أو { secure_url, public_id } لو رفع صورة
    initialCapital: { type: Number, default: 0 },
    aiReport: { type: String }, // تخزين تحليل الذكاء الاصطناعي
}, { timestamps: true });

export const CompanyModel = models.Company || model("Company", CompanySchema);

export default CompanyModel;