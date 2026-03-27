import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { initAdminUser } from './config/initAdmin';
import authRoutes from './routes/authRoutes';
import categoryRoutes from './routes/categoryRoutes';
import gameRoutes from './routes/gameRoutes';

dotenv.config();

// Vercel Serverless Init
connectDB();
initAdminUser();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔴 හරියටම Frontend URL එක CORS වලට දුන්නා 🔴
app.use(
  cors({
    origin: ["https://gamehub-x-fe.vercel.app", "http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use((req, res, next) => {
    res.removeHeader('X-Frame-Options');
    next();
});

app.get('/', (req, res) => {
    res.send('GameHub-X API is running smoothly on Vercel! 🚀');
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/games', gameRoutes);

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
        console.log(`Server running locally on port ${PORT}`);
    });
}

export default app;