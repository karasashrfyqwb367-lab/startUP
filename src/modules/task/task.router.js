
import { Router } from "express";
import { createTaskController, getMyAssignedTasks, updateTaskStatus } from "./task.service.js";
import { authentication } from "../../middleware/authecation.middleware.js";

const taskRouter = Router();

taskRouter.post("/", authentication, createTaskController);
taskRouter.get("/", authentication, getMyAssignedTasks);
taskRouter.patch("/:taskId", authentication, updateTaskStatus);

export default taskRouter;
