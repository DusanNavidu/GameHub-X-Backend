import { Router } from "express";
import { addGame, getAllGames, getGameById, updateGame, toggleGameStatus } from "../controllers/gameController";
import { authenticate } from "../middlewares/auth";
import { requireRole } from "../middlewares/role";
import { Role } from "../models/User";
import { upload } from "../middlewares/upload";

const router = Router();

// Multiple files upload config
const gameUploads = upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'gameFile', maxCount: 1 }
]);

router.get("/", authenticate, getAllGames);
router.get("/:id", authenticate, getGameById);

// Admin only routes
router.post("/", authenticate, requireRole([Role.ADMIN]), gameUploads, addGame);
router.put("/:id", authenticate, requireRole([Role.ADMIN]), updateGame);
router.patch("/:id/status", authenticate, requireRole([Role.ADMIN]), toggleGameStatus);

export default router;