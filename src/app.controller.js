import { resolve } from "node:path";
import { config } from "dotenv";
config({ path: resolve("./config/.env.development") });
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import userController from "./modules/user/user.controller.js"
import authController from "./modules/auth/auth.controller.js"; // استخدم .js بعد التترانسبيل
import companyContller from "./modules/company/campany.controller.js"
import jobController from "./modules/job/job.controller.js"
import Applicationjob from "./modules/job.Application/jobAPPlicatin.controller.js"
import aiRouter from "./modules/AI/AiRouter.js"
import taskRouter from "./modules/task/task.router.js";
import { globalErrorHandeling } from "./error.respons.ts/error.respons.js";
import connectinDB from "./DB/conection.DB.js";

// Load environment variables

// Rate limiter configuration
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // ساعة
  max: 2000,
  message: { error: "Too many requests, please try again later" },
  statusCode: 429,
});

const bootstrap = async () => {
  const app = express();
  const port = process.env.PORT || 5000;

  // Middlewares
  app.use(express.json());
  app.use(cors());
  app.use(helmet());
  app.use(limiter);

  // Connect to DB
  await connectinDB();

  // Routers
  app.get("/ping", (req, res) => res.json({ message: "pong" }));
  app.use("/task", taskRouter);
  app.use("/user", userController);
  app.use("/auth", authController);
  app.use("/company", companyContller);
  app.use("/job", jobController)
  app.use("/Application", Applicationjob)
  app.use("/ai", aiRouter);
  // Global error handling (BEFORE 404 handler)
  app.use(globalErrorHandeling);

  // Test route
  app.get("/", (req, res) => {
    res.json({ message: "Welcome to startUp back-end page" });
  });

  // 404 handler (AFTER all routes and error handler)
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: "Route not found",
    });
  });

  // Start server
  app.listen(port, () => {
    console.log(`Server is running on port ${port} `);
  });
};

export default bootstrap;
