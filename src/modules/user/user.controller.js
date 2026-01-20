// routes/users.routes.ts
import { Router } from "express";
import { authentication } from "../../middleware/authecation.middleware.js";
import { authorization } from "../../middleware/authorization.js";
import * as userservice from "./user.service.js";

import { RoleEnum } from "../../DB/model/User.model.js";

const router = Router();

// هذا route خاص بالمستخدم العادي فقط
router.get(
  "/profile",
  authentication,
  userservice.profile
);

// مثال route خاص بالـ Admin
// router.post(
//   "/admin/dashboard",
//    authentication,
//   authorization([RoleEnum.ADMIN]),
//   userservice.adminDashboard
// );



export default router;
