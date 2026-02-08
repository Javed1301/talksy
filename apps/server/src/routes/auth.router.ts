// apps/server/src/router/auth.router.ts
import { Router } from 'express';
import { register, login, logout, getMe } from '../controllers/auth.controller.js';

const router = Router();

router.post('/signup', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', getMe);

export default router;