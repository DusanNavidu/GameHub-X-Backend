import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { initAdminUser } from './config/initAdmin';
import authRoutes from './routes/authRoutes';
import categoryRoutes from './routes/categoryRoutes';
import gameRoutes from './routes/gameRoutes';

dotenv.config();

// 🔴 Vercel (Serverless) Initialization 🔴
// සර්වර් එක Cold Start වෙද්දීම මේවා load වෙන්න ඕනේ
connectDB();
initAdminUser();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    credentials: true
}));

app.use((req, res, next) => {
    res.removeHeader('X-Frame-Options');
    next();
});

// Base Route
app.get('/', (req, res) => {
    res.send('GameHub-X API is running smoothly on Vercel! 🚀');
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/games', gameRoutes);

// Local Development එකේදී විතරක් සර්වර් එක Run වෙන්න (Vercel වලදී මේක ඉබේම handle වෙනවා)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
        console.log(`Server running locally on port ${PORT}`);
    });
}

// 🔴 මෙන්න මේ පේළිය අනිවාර්යයි Vercel වලට (Express app එක export කරනවා)
export default app;