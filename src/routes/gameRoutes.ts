import express from 'express';
import { uploadGame, getAllGames, updateGame, toggleGameStatus } from '../controllers/gameController';
import { protect, adminOnly } from '../middlewares/authMiddleware';
import { upload } from '../middlewares/uploadMiddleware';

const router = express.Router();

// field වල නම් හරියටම Spring Boot එකේ වගේමයි (thumbnail, gameFile)
router.post('/upload', protect, adminOnly, upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'gameFile', maxCount: 1 }]), uploadGame);

router.get('/', getAllGames);

router.put('/:id', protect, adminOnly, upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'gameFile', maxCount: 1 }]), updateGame);

router.patch('/:id/status', protect, adminOnly, toggleGameStatus);

export default router;