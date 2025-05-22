import express, { Router } from "express";
import {
  createShop,
  createStripeConnectLink,
  getSeller,
  getUser,
  refreshToken,
  registerSeller,
  resetUserPassword,
  sellerLogin,
  userForgotPassword,
  userLogin,
  userRegistration,
  verifySeller,
  verifyUser,
  verifyUserForgotPasswordOtp,
} from "../controllers/auth.controller";
import isAuthenticated from "../../../../packages/middleware/isAuthenticated";

const router: Router = express.Router();

router.post("/user-registration", userRegistration);
router.post("/verify-user", verifyUser);
router.post("/login-user", userLogin);
router.post("/refresh-token", refreshToken);
router.get("/logged-in-user", isAuthenticated, getUser);
router.post("/forgot-password-user", userForgotPassword);
router.post("/verify-forgot-password-user", verifyUserForgotPasswordOtp);
router.post("/reset-password-user", resetUserPassword);

router.post("/seller-registration", registerSeller);
router.post("/verify-seller", verifySeller);
router.post("/create-shop", createShop);
router.post("/create-stripe-link", createStripeConnectLink);
router.post("/login-seller", sellerLogin);
router.get("/logged-in-seller", isAuthenticated, getSeller);

export default router;
