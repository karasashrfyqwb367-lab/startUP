// models/job.model.ts
import { Schema, model, Types } from "mongoose";

const jobSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    salary: Number,
    location: String,

    company: {
      type: Types.ObjectId,
      ref: "Company",
      required: true,
    },

    createdBy: {
      type: Types.ObjectId,
      ref: "User", // HR أو Owner
      required: true,
    },
  },
  { timestamps: true }
);

export const JobModel = model("Job", jobSchema);
export default JobModel;