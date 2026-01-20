import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  cv: String,
  coverLetter: String,
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
   createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

export const JobApplicationModel =
  mongoose.models.JobApplication ||
  mongoose.model("JobApplication", jobApplicationSchema);
