import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from './config/db';
import { initAdminUser } from './config/initAdmin';
import authRoutes from './routes/authRoutes';
import categoryRoutes from './routes/categoryRoutes';
import gameRoutes from './routes/gameRoutes';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Spring Boot 'WebConfig' & 'SecurityConfig' equivalent
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    credentials: true
}));

// Equivalent to .frameOptions(frameOptions -> frameOptions.disable())
app.use((req, res, next) => {
    res.removeHeader('X-Frame-Options');
    next();
});

// Equivalent to ResourceHandler for Uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Base Route
app.get('/', (req, res) => {
    res.send('GameHub-X API is running smoothly on Vercel! 🚀');
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/games', gameRoutes);

// Start Server
const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    
    // Connect to MongoDB
    await connectDB();
    
    // Initialize Default Admin (CommandLineRunner equivalent)
    await initAdminUser();
});