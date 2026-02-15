// apps/server/src/router/auth.router.ts
import { Router } from 'express';
import { register, login, logout, getMe, verifyEmail, requestEmailVerification } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
const router = Router();

router.post('/signup', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', getMe);
router.post('/request-verification', protect, requestEmailVerification);
router.get('/verify', verifyEmail); // Note: No 'protect' here so user can click it logged out

export default router;