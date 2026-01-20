import { Router } from "express";
import { createJobService } from "../job/job.service.js";
import { authentication } from "../../middleware/authecation.middleware.js";
import { authorization } from "../../middleware/authorization.js";
import { ROLES } from "../../utils/roles.js";
import JobModel from "../../DB/model/Jop.Model.js";

const router = Router();

router.post(
  "/company/:companyId/job/create",
  authentication,
  authorization([ROLES.COMPANYOWNER, ROLES.HR]),
  createJobService
);

router.get("/", async (req, res) => {
  try {
    const jobs = await JobModel.find().populate("company");
    res.status(200).json({ jobs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/my", authentication, authorization([ROLES.COMPANYOWNER, ROLES.HR, ROLES.USER]), async (req, res) => {
  try {
    console.log('Fetching my jobs for user:', req.user._id);
    const jobs = await JobModel.find({ createdBy: req.user._id }).populate("company");
    console.log('Found my jobs:', jobs.length);
    res.status(200).json({ jobs });
  } catch (error) {
    console.error('Error in /job/my:', error);
    res.status(500).json({ error: error.message });
  }
});




export default router;
