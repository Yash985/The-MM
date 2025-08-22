import type { Response, Request } from "express";
import { type AuthenticatedRequest } from "../middlewares/isAuthorize.middleware.js";
import prisma from "../db.js";
export const AllProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany();
    return res.status(200).json({ success: true, message: "Found", products });
  } catch (err: any) {
    console.log("Error while fetching products", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Error while fetching products" });
  }
};
export const AddProduct = (req: AuthenticatedRequest, res: Response) => {};
