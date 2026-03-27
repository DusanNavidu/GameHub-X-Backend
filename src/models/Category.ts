import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

const CategorySchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: false },
}, { timestamps: true });

export default mongoose.model<ICategory>('Category', CategorySchema);