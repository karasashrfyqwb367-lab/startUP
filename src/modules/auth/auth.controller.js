import { Router } from "express";
import { validitionMiddlware } from "../../middleware/valition.middleware.js";
import * as validotors from "./auth.vaildation.js";
import authService from "./auth.service.js";
const router = Router();
router.post("/signup", validitionMiddlware(validotors.signup), authService.signup);
router.post("/confirmEmail", validitionMiddlware(validotors.confirmEmail), authService.confirmEmail);

router.post("/signup/gmail", validitionMiddlware(validotors.signupWithgmail), authService.signupWithGmail);
router.post("/login/gmail", validitionMiddlware(validotors.signupWithgmail), authService.logWithGmail);
router.post("/login", validitionMiddlware(validotors.login), authService.login);
export default router;
