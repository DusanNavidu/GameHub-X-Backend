import express, { Router } from 'express';
import { refreshToken, getMyProfile, register, requestOTP, verifyOTP, toggleUserStatus, getAllPlayers } from '../controllers/userController';
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

router.get(
  "/players", 
  authenticate, 
  requireRole([Role.ADMIN]), 
  getAllPlayers
);

router.patch(
  "/:id/status", 
  authenticate, 
  requireRole([Role.ADMIN]), 
  toggleUserStatus
);

export default router;