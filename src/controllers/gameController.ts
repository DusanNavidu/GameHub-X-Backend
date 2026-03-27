import Game from "../models/Game";
import { Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import { AUthRequest } from "../middlewares/auth";

// 1. Add Game (Thumbnail & Game File Upload)
export const addGame = async (req: AUthRequest, res: Response) => {
    try {
        const { title, description, categoryId } = req.body;
        const userId = req.user.sub; // Middleware eken ena user ID eka

        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        
        if (!files?.thumbnail?.[0] || !files?.gameFile?.[0]) {
            return res.status(400).json({ message: "Both thumbnail and game file are required" });
        }

        // Upload Thumbnail (Image)
        const uploadThumbnail: any = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "games/thumbnails" },
                (error, result) => (error ? reject(error) : resolve(result))
            );
            stream.end(files.thumbnail[0].buffer);
        });

        // Upload Game File (Raw file - zip, html, etc.)
        const uploadGameFile: any = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "games/files", resource_type: "raw" },
                (error, result) => (error ? reject(error) : resolve(result))
            );
            stream.end(files.gameFile[0].buffer);
        });

        const newGame = await Game.create({
            title,
            description,
            categoryId,
            thumbnailUrl: uploadThumbnail.secure_url,
            gameUrl: uploadGameFile.secure_url,
            uploadedByUserId: userId
        });

        res.status(201).json({ message: "Game uploaded successfully!", data: newGame });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error during upload" });
    }
};

// 2. Get All Games
export const getAllGames = async (req: Request, res: Response) => {
    try {
        const games = await Game.find().populate('categoryId', 'name').sort({ createdAt: -1 });
        res.status(200).json({ data: games });
    } catch (err) {
        res.status(500).json({ message: "Error fetching games" });
    }
};

// 3. Get Game By ID
export const getGameById = async (req: Request, res: Response) => {
    try {
        const game = await Game.findById(req.params.id).populate('categoryId', 'name');
        if (!game) return res.status(404).json({ message: "Game not found" });
        res.status(200).json({ data: game });
    } catch (err) {
        res.status(500).json({ message: "Error fetching game details" });
    }
};

// 4. Update Game (Details only)
export const updateGame = async (req: Request, res: Response) => {
    try {
        const { title, description, categoryId } = req.body;
        const updatedGame = await Game.findByIdAndUpdate(
            req.params.id,
            { title, description, categoryId },
            { new: true }
        );
        if (!updatedGame) return res.status(404).json({ message: "Game not found" });
        res.status(200).json({ message: "Game updated", data: updatedGame });
    } catch (err) {
        res.status(500).json({ message: "Error updating game" });
    }
};

// 5. Toggle Status (Active/Inactive)
export const toggleGameStatus = async (req: Request, res: Response) => {
    try {
        const game = await Game.findById(req.params.id);
        if (!game) return res.status(404).json({ message: "Game not found" });

        game.status = game.status === "ACTIVE" ? "INACTIVE" as any : "ACTIVE" as any;
        await game.save();

        res.status(200).json({ message: `Game is now ${game.status}`, data: game });
    } catch (err) {
        res.status(500).json({ message: "Error toggling status" });
    }
};