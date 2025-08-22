import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

type AuthenticatedUser = {
  id: string;
  role: string;
};

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export const isAuthorize = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      res.status(401).json({ success: false, message: "Invalid token" });
      return;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    if (!decoded) {
      res.status(401).json({ success: false, message: "Invalid token" });
      return;
    }
    req.user = decoded as AuthenticatedUser;
    next();
  } catch (err: any) {
    console.log("Error while validating user.", err.message);
    res.status(500).json({ success: false, message: "Invalid Token" });
    return;
  }
};
