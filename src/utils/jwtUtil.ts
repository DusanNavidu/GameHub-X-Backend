import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET as string;
const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET as string;
const EXPIRATION = process.env.JWT_EXPIRATION || '10d';

export const generateToken = (email: string): string => {
    return jwt.sign({ sub: email }, SECRET_KEY, { expiresIn: EXPIRATION as any });
};

export const generateRefreshToken = (email: string): string => {
    return jwt.sign({ sub: email }, REFRESH_SECRET_KEY, { expiresIn: '7d' });
};

export const extractUsername = (token: string): string | null => {
    try {
        const decoded = jwt.verify(token, SECRET_KEY) as jwt.JwtPayload;
        return decoded.sub as string;
    } catch (error) {
        return null;
    }
};

export const extractUsernameFromRefreshToken = (token: string): string | null => {
    try {
        const decoded = jwt.verify(token, REFRESH_SECRET_KEY) as jwt.JwtPayload;
        return decoded.sub as string;
    } catch (error) {
        return null;
    }
};