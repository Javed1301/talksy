import { type Request, type Response } from 'express';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';
import { signupSchema, loginSchema } from '../validations/auth.validation.js';

/**
 * SIGNUP: Create a new user with Email & Username
 */
export const register = async (req: Request, res: Response) => {
  try {
    // 1. Validate data with Zod
    const validation = signupSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        error: validation.error?.issues[0]?.message ?? "Invalid input" 
      });
    }

    const { email, username, name, password } = validation.data;

    // 2. Check for existing email/username
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] }
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email or Username already taken" });
    }

    // 3. Hash Password
    const hashedPassword = await argon2.hash(password);

    // 4. Create User in PostgreSQL
    const user = await prisma.user.create({
      data: {
        email,
        username,
        name,
        password: hashedPassword,
      },
    });

    // 5. Generate JWT and Set Cookie
    const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET!, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'development' ,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      message: "Registration successful!",
      user: { id: user.id, username: user.username, email: user.email }
    });

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * LOGIN: Authenticate existing user
 */
export const login = async (req: Request, res: Response) => {
  try {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error?.issues[0]?.message });
    }

    const { email, password } = validation.data;

    // 1. Find User
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    // 2. Verify Password
    const isMatch = await argon2.verify(user.password, password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // 3. Generate JWT and Set Cookie
    const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET!, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'development' ,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Welcome back!",
      user: { id: user.id, username: user.username, email: user.email }
    });

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development" ,
      sameSite: "strict",
    });
    
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(200).json({ user: null }); 
      // We return 200 with null user so the frontend knows the check finished
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as { id: string };

    // Fetch user from DB
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { 
        id: true, 
        username: true, 
        email: true, 
        name: true 
      }
    });

    if (!user) {
      return res.status(200).json({ user: null });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error in getMe controller:", error);
    return res.status(200).json({ user: null });
  }
};