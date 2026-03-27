import express from 'express';
import { registerPlayer, requestOtp, verifyOtp, refreshToken, getAllUsers } from '../controllers/userController';
import { protect, adminOnly } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/register', registerPlayer);
router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtp);
router.post('/refresh-token', refreshToken);

// Protected Admin Route
router.get('/users', protect, adminOnly, getAllUsers);

export default router;