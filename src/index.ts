import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initAdminUser } from './config/initAdmin';
import authRoutes from './routes/authRoutes';
import categoryRoutes from './routes/categoryRoutes';
import gameRoutes from './routes/gameRoutes';
import mongoose from "mongoose";

dotenv.config();

const app = express();
const MONGO_URI = process.env.MONGO_URI as string;

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

app.use(express.json());

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is not defined");
} else {
  mongoose
    .connect(MONGO_URI)
    .then(async () => {
      console.log("✅ DB connected to garage_system_DB");
      try {
         await initAdminUser();
      } catch (e) {
         console.log("Admin check skipped or failed:", e);
      }
    })
    .catch((err) => console.error("❌ DB Connection Error:", err));
}

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