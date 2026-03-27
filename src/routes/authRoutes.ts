import express, { Router } from 'express';
import { refreshToken, getMyProfile, register, requestOTP, verifyOTP } from '../controllers/userController';
import { authenticate } from '../middlewares/auth';
import { requireRole } from '../middlewares/role';
import { Role } from '../models/User';

const router = Router()

router.get(
  "/me", 
  authenticate, 
  getMyProfile
);

router.post(
  "/refresh", 
  refreshToken
)

router.post(
    "/register", 
    register
);

router.post(
    "/login-request", 
    requestOTP
);

router.post(
    "/login-verify", 
    verifyOTP
);

export default router;