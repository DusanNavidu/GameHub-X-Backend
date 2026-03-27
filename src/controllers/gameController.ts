import { Request, Response } from 'express'; // 🔴 Request එක Import කරලා තියෙන්නේ
import * as gameService from '../services/gameService';
import { APIResponse } from '../utils/apiResponse';
import { AuthRequest } from '../middlewares/authMiddleware';

export const uploadGame = async (req: AuthRequest, res: Response) => {
    try {
        const uploaderEmail = req.user.email; 
        const game = await gameService.uploadGameService(req.body, req.files, uploaderEmail);
        res.status(200).json(new APIResponse(200, "Game uploaded successfully", game));
    } catch (error: any) {
        res.status(500).json(new APIResponse(500, "Failed to upload game: " + error.message));
    }
};

export const getAllGames = async (req: Request, res: Response) => {
    try {
        const games = await gameService.getAllGamesService();
        res.status(200).json(new APIResponse(200, "Success", games));
    } catch (error: any) {
        res.status(500).json(new APIResponse(500, error.message));
    }
};

export const updateGame = async (req: AuthRequest, res: Response) => {
    try {
        const game = await gameService.updateGameService(req.params.id as string, req.body, req.files);
        res.status(200).json(new APIResponse(200, "Game updated successfully", game));
    } catch (error: any) {
        res.status(500).json(new APIResponse(500, "Failed to update game: " + error.message));
    }
};

export const toggleGameStatus = async (req: Request, res: Response) => {
    try {
        const game = await gameService.toggleGameStatusService(req.params.id as string);
        res.status(200).json(new APIResponse(200, "Game status updated successfully", game));
    } catch (error: any) {
        res.status(500).json(new APIResponse(500, "Failed to update status: " + error.message));
    }
};