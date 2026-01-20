// company.controller.ts
import { Router } from "express";
import { authentication } from "../../middleware/authecation.middleware.js";
import { authorization } from "../../middleware/authorization.js";
import { ROLES } from "../../utils/roles.js"; // أو المكان اللي مخزن فيه الـ ROLES
import { applyJobController, reviewApplicationController, getApplicantsController } from "./jobAPPlicationservice.js"
const router = Router();


router.post(
  "/jobs/:jobId/apply",
  authentication,
  authorization([ROLES.USER, ROLES.COMPANYOWNER, ROLES.HR]),
  applyJobController
);


router.patch(
  "/applications/:applicationId/review",
  authentication,
  authorization([ROLES.HR, ROLES.COMPANYOWNER]),
  reviewApplicationController
);


router.get(
  "/job/:jobId/applications",
  authentication,
  authorization([ROLES.HR, ROLES.COMPANYOWNER, ROLES.USER]),
  getApplicantsController
);


export default router;
