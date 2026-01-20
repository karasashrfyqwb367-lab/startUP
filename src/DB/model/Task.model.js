import mongoose from "mongoose";
const { Schema, model } = mongoose;

const TaskSchema = new Schema(
    {
        employeeName: {
            type: String,
            required: true,
        },
        employeeEmail: {
            type: String,
            required: true,
            lowercase: true,
        },
        taskName: {
            type: String,
            required: true,
        },
        projectName: {
            type: String,
            default: "General Project"
        },
        expectedDuration: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["Not Started", "In Progress", "Completed"],
            default: "Not Started",
        },
        assignedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        }
    },
    { timestamps: true }
);

export const TaskModel = model("Task", TaskSchema);
