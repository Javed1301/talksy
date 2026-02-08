import { z } from 'zod';

// Schema for Login
export const loginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required"),
});

// Schema for Signup
export const signupSchema = z.object({
  email: z
    .string()
    .email("Invalid email format"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username is too long")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

// Types for your Frontend or Controller
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;