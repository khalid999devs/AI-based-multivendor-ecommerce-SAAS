import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../libs/prisma";

const isAuthenticated = async (req: any, res: Response, next: NextFunction) => {
  try {
    const token =
      req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized! Token missing.",
        succeed: false,
      });
    }

    // verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
      id: string;
      role: "user" | "seller";
    };
    if (!decoded || !decoded.id || !decoded.role) {
      return res.status(401).json({
        message: "Unauthorized! Invalid token.",
        succeed: false,
      });
    }
    const account = await prisma.users.findUnique({
      where: { id: decoded.id },
    });
    req.user = account;

    if (!account) {
      return res.status(401).json({
        message: "Account not found!",
        succeed: false,
      });
    }
    return next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized! Token expired or invalid.",
      succeed: false,
    });
  }
};

export default isAuthenticated;
