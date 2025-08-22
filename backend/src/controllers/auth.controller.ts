import type { Request, Response } from "express";
import prisma from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  loginSchema,
  signupSchema,
  type loginType,
  type signupType,
} from "../validations/auth.validation.js";

export const Signup = async (req: Request, res: Response) => {
  try {
    const result = signupSchema.safeParse(req.body);
    if (!result.success) {
      const errorMessages = result.error.issues.map((err: any) => {
        return `${err.message}`;
      });
      res.status(400).json({
        success: false,
        message: "Validation Failed",
        errors: errorMessages,
      });
    }
    const { email, password, fullName, phoneNo } = result.data as signupType;
    const user = await prisma.user.findFirst({
      where: { email },
    });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User Already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: fullName,
        phoneNo,
      },
    });
    return res
      .status(201)
      .json({ success: true, message: "User Created successfully" });
  } catch (err: any) {
    console.log("Error while creating user", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Error while creating user." });
  }
};
export const Login = async (req: Request, res: Response) => {
  try {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      const errorMessages = result.error.issues.map((err: any) => {
        return `${err.message}`;
      });
      res.status(400).json({
        success: false,
        message: "Validation Failed",
        errors: errorMessages,
      });
    }
    const { email, password } = result.data as loginType;
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }
    const jwtToken = jwt.sign(
      { user_id: user.id, role: user.role },
      process.env.JWT_SECRET as string
    );
    //If expiry is set:
    //The cookie stays in the browser until that time is reached.
    //This is called a persistent cookie.

    // If expiry is not set (or is undefined):
    // The cookie becomes a session cookie.
    // It only lasts until the browser is closed.
    // It won’t be saved to disk — it’s stored in memory only.
    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: false, //Set to false for local dev without HTTPS
      sameSite: "none",
      maxAge: 30 * 60 * 1000,
    });
    return res
      .status(200)
      .json({ success: true, message: "User Logged-In sucessfully." });
  } catch (err: any) {
    console.log("Error while logging in", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Error while logging user" });
  }
};
