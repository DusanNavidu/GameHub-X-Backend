import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db'; // 🔴 db.ts එක අනිවාර්යයෙන් Import කරන්න
import { initAdminUser } from './config/initAdmin';
import authRoutes from './routes/authRoutes';
import categoryRoutes from './routes/categoryRoutes';
import gameRoutes from './routes/gameRoutes';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: ["https://gamehub-x-fe.vercel.app", "http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// 🔴 VERCEL FIX: Database Middleware 🔴
// හැම API Request එකක්ම යන්න කලින් Database එක Connect වෙලාද කියලා මේකෙන් බලනවා.
// Connect වෙලා නැත්නම්, Connect වෙනකම් බලන් ඉඳලා තමයි ඉස්සරහට යවන්නේ.
app.use(async (req, res, next) => {
    try {
        await connectDB(); // db.ts එකේ function එක call කරනවා
        
        // Database connect වුණාට පස්සේ Admin ඉන්නවද බලනවා
        try {
            await initAdminUser();
        } catch (e) {
            console.log("Admin check skipped or failed:", e);
        }

        next(); // ඔක්කොම හරි නම් විතරක් Request එක Routes වලට යවනවා
    } catch (error) {
        console.error("Database connection middleware failed:", error);
        res.status(500).json({ message: "Database connection failed. Please try again." });
    }
});

app.get('/', (req, res) => {
    res.send('GameHub-X API is running smoothly on Vercel! 🚀');
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/games', gameRoutes);

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running locally on port ${PORT}`);
  });
}

export default app;