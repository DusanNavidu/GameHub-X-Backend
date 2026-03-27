import { Request, Response } from 'express';
import * as categoryService from '../services/categoryService';
import { APIResponse } from '../utils/apiResponse';

export const createCategory = async (req: Request, res: Response) => {
    try {
        const category = await categoryService.createCategoryService(req.body);
        res.status(200).json(new APIResponse(200, "Category created", category));
    } catch (error: any) {
        res.status(400).json(new APIResponse(400, error.message));
    }
};

export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const categories = await categoryService.getAllCategoriesService();
        res.status(200).json(new APIResponse(200, "Success", categories));
    } catch (error: any) {
        res.status(500).json(new APIResponse(500, error.message));
    }
};