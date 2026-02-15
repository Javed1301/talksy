import { Router } from 'express';
import { updateProfile } from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/multer.middleware.js';
const router = Router();

router.put('/update', protect, upload.single('avatar'), updateProfile);

export default router;