import Category from '../models/Category';

export const createCategoryService = async (data: any) => {
    const existing = await Category.findOne({ name: data.name });
    if (existing) {
        throw new Error("Category already exists!");
    }
    const category = await Category.create({
        name: data.name,
        description: data.description
    });
    // 🔴 id එක map කරලා යවනවා
    return { ...category.toObject(), id: category._id };
};

export const getAllCategoriesService = async () => {
    const categories = await Category.find();
    // 🔴 Frontend එකට යවද්දී හැම category එකකම _id එක id විදිහට යවනවා
    return categories.map(cat => {
        return {
            ...cat.toObject(),
            id: cat._id
        };
    });
};