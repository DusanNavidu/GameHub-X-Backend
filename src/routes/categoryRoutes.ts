import express from 'express';
import { createCategory, getAllCategories } from '../controllers/categoryController';
import { protect, adminOnly } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', protect, adminOnly, createCategory);
router.get('/', getAllCategories);

export default router;