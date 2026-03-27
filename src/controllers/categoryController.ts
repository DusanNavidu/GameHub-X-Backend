import { Request, Response } from 'express';
import Category, { CategoryStatus } from '../models/Category';

// 1. Add Category
export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body;
        const existing = await Category.findOne({ name });
        if (existing) return res.status(400).json({ message: "Category already exists" });

        const category = await Category.create({ name, description });
        res.status(201).json({ message: "Category created", data: category });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// 2. Get All Categories (Admin okkoma dakinawa, Player lata ACTIVE ewa witrak yawanna puluwan)
export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.status(200).json({ data: categories });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// 3. Update Category
export const updateCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const updated = await Category.findByIdAndUpdate(
            id, 
            { name, description }, 
            { new: true }
        );

        if (!updated) return res.status(404).json({ message: "Category not found" });
        res.status(200).json({ message: "Category updated", data: updated });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// 4. Toggle Active/Inactive Status
export const toggleCategoryStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);

        if (!category) return res.status(404).json({ message: "Category not found" });

        // Toggle logic
        category.status = category.status === CategoryStatus.ACTIVE 
            ? CategoryStatus.INACTIVE 
            : CategoryStatus.ACTIVE;

        await category.save();
        res.status(200).json({ message: `Category is now ${category.status}`, data: category });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};