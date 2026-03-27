import { Router } from 'express';
import { 
    createCategory, 
    getAllCategories, 
    updateCategory, 
    toggleCategoryStatus 
} from '../controllers/categoryController';
import { authenticate } from '../middlewares/auth';
import { requireRole } from '../middlewares/role';
import { Role } from '../models/User';

const router = Router();

// Get all categories (Auth thibunama athi)
router.get("/", authenticate, getAllCategories);

// Admin-only routes
router.post("/", authenticate, requireRole([Role.ADMIN]), createCategory);
router.put("/:id", authenticate, requireRole([Role.ADMIN]), updateCategory);
router.patch("/:id/status", authenticate, requireRole([Role.ADMIN]), toggleCategoryStatus);

export default router;