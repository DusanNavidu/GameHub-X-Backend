import Game from '../models/Game';
import User from '../models/User';
import Category from '../models/Category';
import { Status } from '../models/User';
import { uploadToCloudinary } from '../utils/cloudinaryUtil';

export const uploadGameService = async (data: any, files: any, uploaderEmail: string) => {
    const uploader = await User.findOne({ email: uploaderEmail });
    if (!uploader) throw new Error("Uploader not found.");

    const category = await Category.findById(data.categoryId);
    if (!category) throw new Error("Selected category does not exist.");

    let thumbnailUrl = '';
    let gameUrl = '';

    if (files?.thumbnail?.[0]) {
        thumbnailUrl = await uploadToCloudinary(files.thumbnail[0].buffer, 'GameHubX/thumbnails', 'image');
    } else {
        throw new Error("Thumbnail is required.");
    }

    if (files?.gameFile?.[0]) {
        gameUrl = await uploadToCloudinary(files.gameFile[0].buffer, 'GameHubX/games', 'auto');
    } else {
        throw new Error("Game file is required.");
    }

    const newGame = await Game.create({
        title: data.title,
        description: data.description,
        categoryId: category._id,
        thumbnailUrl: thumbnailUrl,
        gameUrl: gameUrl,
        uploadedByUserId: uploader._id,
        status: Status.ACTIVE
    });

    // 🔴 Frontend එකට යවද්දී id කියලා යවනවා
    return { ...newGame.toObject(), id: newGame._id };
};

export const getAllGamesService = async () => {
    const games = await Game.find().populate('categoryId', 'name').sort({ createdAt: -1 });
    return games.map(game => {
        const gameObj = game.toObject();
        return {
            ...gameObj,
            id: game._id, // 🔴 React Map එකටයි Edit/Status Toggle එකටයි මේක අත්‍යවශ්‍යයි
            categoryName: (gameObj.categoryId as any)?.name,
            categoryId: (gameObj.categoryId as any)?._id
        };
    });
};

export const updateGameService = async (id: string, data: any, files: any) => {
    const game = await Game.findById(id);
    if (!game) throw new Error(`Game not found with id: ${id}`);

    if (data.title) game.title = data.title;
    if (data.description) game.description = data.description;
    if (data.categoryId) {
        const category = await Category.findById(data.categoryId);
        if (!category) throw new Error("Selected category does not exist.");
        game.categoryId = category.id;
    }

    if (files?.thumbnail?.[0]) {
        game.thumbnailUrl = await uploadToCloudinary(files.thumbnail[0].buffer, 'GameHubX/thumbnails', 'image');
    }
    
    if (files?.gameFile?.[0]) {
        game.gameUrl = await uploadToCloudinary(files.gameFile[0].buffer, 'GameHubX/games', 'auto');
    }

    await game.save();
    return { ...game.toObject(), id: game._id };
};

export const toggleGameStatusService = async (id: string) => {
    const game = await Game.findById(id);
    if (!game) throw new Error(`Game not found with id: ${id}`);

    game.status = game.status === Status.ACTIVE ? Status.INACTIVE : Status.ACTIVE;
    await game.save();
    return { ...game.toObject(), id: game._id };
};