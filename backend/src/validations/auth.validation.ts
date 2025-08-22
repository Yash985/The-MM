import { z } from "zod";

export const signupSchema = z.object({
  fullName: z.string().min(3, "Name must be atleast 3 characters"),
  email: z.email(),
  password: z.string().min(8, "Password must be atleast 8 characters"),
  phoneNo: z.string().regex(/^[6-9]\d{9}$/, "Invalid phone number"),
});

export type signupType = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export type loginType = z.infer<typeof loginSchema>;
