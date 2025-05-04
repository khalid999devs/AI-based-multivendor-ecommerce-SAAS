import express, { Router } from "express";
import {
  resetUserPassword,
  userForgotPassword,
  userLogin,
  userRegistration,
  verifyUser,
  verifyUserForgotPasswordOtp,
} from "../controllers/auth.controller";

const router: Router = express.Router();

router.post("/user-registration", userRegistration);
router.post("/verify-user", verifyUser);
router.post("/login-user", userLogin);
router.post("/forgot-password-user", userForgotPassword);
router.post("/verify-forgot-password-user", verifyUserForgotPasswordOtp);
router.post("/reset-password-user", resetUserPassword);

export default router;
