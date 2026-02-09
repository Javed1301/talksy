import { type Request,type Response } from 'express'; // 👈 Essential for types
import { prisma } from "../lib/prisma.js";

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { name, about } = req.body;
    
    // 1. Get User ID from middleware (ensure your auth middleware is running first)
    const userId = (req as any).user?.id; 

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // 2. Update the user in Prisma
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { 
        name, 
        about 
      },
      select: { 
        id: true, 
        name: true, 
        about: true, 
        email: true, 
        isVerified: true, 
        avatar: true,
        username: true // Added username just in case the frontend needs it
      }
    });

    // 3. Send back the updated user
    return res.json({ 
      message: "Profile updated successfully",
      user: updatedUser 
    });

  } catch (error: any) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({ error: "Failed to update profile" });
  }
};