import { type Request, type Response } from 'express';
import { prisma } from "../lib/prisma.js";
import { uploadToCloudinary, deleteFromCloudinary, extractPublicId } from "../lib/cloudinary.js";

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { name, about, username } = req.body;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // 1. Fetch current user to check for an existing avatar
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { avatar: true }
    });

    let avatarUrl = currentUser?.avatar;

    // 2. If a new file is uploaded via Multer
    if (req.file) {
      // Delete the old avatar from Cloudinary if it exists
      if (currentUser?.avatar) {
        const oldPublicId = extractPublicId(currentUser.avatar);
        if (oldPublicId) await deleteFromCloudinary(oldPublicId);
      }

      // Upload the new one
      const result = await uploadToCloudinary(req.file.buffer);
      avatarUrl = result.secure_url;
    }

    // 3. Update the database with all fields
    const updateData: any = { name, about, username };

    if (avatarUrl !== undefined) {
        updateData.avatar = avatarUrl;
    }
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: { 
        id: true, 
        name: true, 
        about: true, 
        email: true, 
        avatar: true, 
        username: true, 
        isVerified: true 
      }
    });

    return res.json({ 
      message: "Profile updated successfully",
      user: updatedUser 
    });

  } catch (error: any) {
    // Handle Prisma unique constraint error (P2002) for username
    if (error.code === 'P2002') {
      return res.status(400).json({ error: "Username is already taken" });
    }
    
    console.error("Update Profile Error:", error);
    return res.status(500).json({ error: "Internal server error during update" });
  }
};