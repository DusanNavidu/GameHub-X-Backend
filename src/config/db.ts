import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Vercel වලදී connection එක මතක තියාගන්න variable එකක්
let isConnected = false; 

export const connectDB = async () => {
    if (isConnected) {
        return; // දැනටමත් connect වෙලා නම් ආයේ connect වෙන්න යන්නේ නෑ
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URI as string);
        isConnected = db.connections[0].readyState === 1;
        console.log("✅ MongoDB Connected Successfully!");
    } catch (error: any) {
        console.error("❌ MongoDB Connection Error:", error.message);
        throw new Error("Database connection failed");
    }
};