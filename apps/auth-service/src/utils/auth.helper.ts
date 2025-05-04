import crypto from "crypto";
import { ValidationError } from "../../../../packages/error-handler";
import redis from "../../../../packages/libs/redis";
import { sendEmail } from "./sendMail";
import { NextFunction, Request, Response } from "express";
import prisma from "../../../../packages/libs/prisma";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegistrationData = (
  data: any,
  userType: "user" | "seller"
) => {
  const { name, email, password, phone_number, country } = data;

  if (
    !name ||
    !email ||
    !password ||
    (userType === "seller" && (!phone_number || !country))
  ) {
    throw new ValidationError(`Missing required fields!`);
  }

  if (!emailRegex.test(email)) {
    throw new ValidationError(`Invalid email format!`);
  }
};

export const checkOtpRestrictions = async (
  email: string,
  next: NextFunction
) => {
  if (await redis.get(`otp_lock:${email}`)) {
    throw new ValidationError(
      "Account locked due to multiple failed attempts! Try again after 30 minutes."
    );
  }

  if (await redis.get(`otp_spam_lock:${email}`)) {
    throw new ValidationError(
      "Too many OTP requests! Please wait 1 hour before requesting a new OTP."
    );
  }

  if (await redis.get(`otp_cooldown:${email}`)) {
    throw new ValidationError(
      "Please wait 1 minute before requesting another OTP!"
    );
  }
};

export const trackOTPRequests = async (email: string, next: NextFunction) => {
  const otpRequestKey = `otp_request_count:${email}`;
  let otpRequests = parseInt((await redis.get(otpRequestKey)) || "0");
  otpRequests++;
  if (otpRequests > 2) {
    await redis.set(`otp_spam_lock:${email}`, "locked", "EX", 60 * 60);
    throw new ValidationError(
      "Too many OTP requests! Please wait 1 hour before requesting a new OTP."
    );
  }

  await redis.set(otpRequestKey, otpRequests, "EX", 60 * 60); // tracking request for 1 hour
};

export const sendOtp = async (
  email: string,
  name: string,
  template: string
) => {
  const otp = crypto.randomInt(1000, 9999).toString();
  await sendEmail(email, "Verify Your Email", template, { name, otp });
  await redis.set(`otp:${email}`, otp, "EX", 60 * 5);
  await redis.set(`otp_cooldown:${email}`, "true", "EX", 60);
};

export const verifyOtp = async (
  email: string,
  otp: string,
  next: NextFunction
) => {
  const storedOtp = await redis.get(`otp:${email}`);
  if (!storedOtp) {
    throw new ValidationError("Invalid or expired OTP!");
  }
  const failedAttemptsKey = `otp_attempts:${email}`;
  let failedAttempts = parseInt((await redis.get(failedAttemptsKey)) || "0");

  if (storedOtp !== otp) {
    failedAttempts++;
    if (failedAttempts > 2) {
      await redis.set(`otp_lock:${email}`, "locked", "EX", 60 * 30); //lock for 30 minutes
      await redis.del(`otp:${email}`, failedAttemptsKey);
      throw new ValidationError(
        "Account locked due to multiple failed attempts! Try again after 30 minutes."
      );
    }
    await redis.set(failedAttemptsKey, failedAttempts, "EX", 5 * 60);
    throw new ValidationError(
      `Incorrect OTP. ${3 - failedAttempts} attempts left.`
    );
  }

  await redis.del(`otp:${email}`, failedAttemptsKey);
};

export const handleForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
  userType: "user" | "seller"
) => {
  try {
    const { email } = req.body;
    if (!email) throw new ValidationError("Email is required!");

    // find user/seller in DB
    const user =
      userType === "user" &&
      (await prisma.users.findUnique({ where: { email } }));

    if (!user)
      throw new ValidationError(`${userType} not found with this email!`);

    // check otp restrictions
    await checkOtpRestrictions(email, next);
    await trackOTPRequests(email, next);

    // Generate OTP and send email
    await sendOtp(email, user.name, "forgot-password-user-mail");

    res.status(200).json({
      succeed: true,
      message: `OTP sent to ${email}. Please verify your account.`,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return next(new ValidationError("Email and OTP are required!"));
    }
    await verifyOtp(email, otp, next);
    return res.status(200).json({
      succeed: true,
      message: "OTP verified successfully.",
    });
  } catch (error) {
    return next(error);
  }
};
