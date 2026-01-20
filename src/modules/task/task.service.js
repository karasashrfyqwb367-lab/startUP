
import { TaskModel } from "../../DB/model/Task.model.js";
import { sendEmail } from "../../utils/email/sendEmail.js";

const getTaskEmailTemplate = (employeeName, taskName, projectName, duration) => {
    return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 24px;">New Task Assigned 📋</h1>
            <p style="margin: 10px 0 0; opacity: 0.9;">Project Manager: StartUp AI System</p>
        </div>
        <div style="padding: 30px; line-height: 1.6; color: #334155;">
            <p style="font-size: 18px;">Hi <b>${employeeName}</b>,</p>
            <p>You have been assigned a new task. Here are the project details:</p>
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 12px; border-left: 4px solid #4f46e5; margin: 20px 0;">
                <p style="margin: 5px 0;"><b>Project:</b> ${projectName}</p>
                <p style="margin: 5px 0;"><b>Task:</b> ${taskName}</p>
                <p style="margin: 5px 0;"><b>Expected Duration:</b> ${duration}</p>
            </div>
            <p>Please update your progress via the system or reply to this email once started.</p>
            <div style="text-align: center; margin-top: 30px;">
                <a href="#" style="background-color: #4f46e5; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold;">View Dashboard</a>
            </div>
        </div>
        <div style="background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8;">
            <p>© 2026 StartUp AI Management - Built for Scale</p>
        </div>
    </div>
  `;
};

export const createTaskController = async (req, res, next) => {
    try {
        const { employeeName, employeeEmail, taskName, projectName, expectedDuration } = req.body;

        const newTask = await TaskModel.create({
            employeeName,
            employeeEmail,
            taskName,
            projectName,
            expectedDuration,
            assignedBy: req.user._id
        });

        // Send the task email immediately
        await sendEmail({
            to: employeeEmail,
            subject: `New Assignment: ${taskName} for ${projectName}`,
            html: getTaskEmailTemplate(employeeName, taskName, projectName, expectedDuration)
        });

        return res.status(201).json({ message: "Task assigned and email sent!", data: newTask });
    } catch (error) {
        next(error);
    }
};

export const getMyAssignedTasks = async (req, res, next) => {
    try {
        const tasks = await TaskModel.find({ assignedBy: req.user._id }).sort({ createdAt: -1 });
        return res.status(200).json({ data: tasks });
    } catch (error) {
        next(error);
    }
};

export const updateTaskStatus = async (req, res, next) => {
    try {
        const { taskId } = req.params;
        const { status } = req.body;
        const task = await TaskModel.findByIdAndUpdate(taskId, { status }, { new: true });
        return res.status(200).json({ message: "Status updated!", data: task });
    } catch (error) {
        next(error);
    }
}
