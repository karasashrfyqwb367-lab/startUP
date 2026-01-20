import { Router } from "express";
import { createCompany } from "../company/companyservice.js";
import { authentication } from "../../middleware/authecation.middleware.js";
import { authorization } from "../../middleware/authorization.js";
import { ROLES } from "../../utils/roles.js";
import { UserModel, RoleEnum } from "../../DB/model/User.model.js";
import { CompanyModel } from "../../DB/model/CompanyModel.js";

const router = Router();

router.post(
  "/Create",
  authentication,
  authorization([ROLES.USER, ROLES.COMPANYOWNER, ROLES.HR]),
  async (req, res, next) => {
    try {
      console.log('Creating company for user:', req.user._id);
      // 1. Create the company
      const company = await createCompany(req.user._id, req.body);

      // 2. Update user role to OWNER if they are currently a USER
      if (req.user.role === ROLES.USER) {
        await UserModel.findByIdAndUpdate(req.user._id, { role: RoleEnum.OWNER });
        console.log('User role updated to OWNER');
      }

      res.status(201).json({ message: "Company created successfully", company });
    } catch (error) {
      console.error('Error creating company:', error);
      next(error);
    }
  }
);

router.get(
  "/my",
  authentication,
  authorization([ROLES.COMPANYOWNER, ROLES.HR, ROLES.USER]), // Added USER just in case for demo
  async (req, res, next) => {
    try {
      console.log('Fetching companies for user:', req.user._id, 'Role:', req.user.role);
      const companies = await CompanyModel.find({ createdBy: req.user._id });
      console.log('Found companies:', companies.length);
      res.status(200).json({ companies });
    } catch (error) {
      console.error('Error in /company/my:', error);
      next(error);
    }
  }
);

export default router;

