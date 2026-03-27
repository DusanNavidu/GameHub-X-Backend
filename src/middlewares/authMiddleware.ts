import { Request, Response, NextFunction } from 'express';
import { extractUsername } from '../utils/jwtUtil';
import User from '../models/User';

// Extending Express Request to include user
export interface AuthRequest extends Request {
    user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        res.status(401).json({ statusCode: 401, message: 'Not authorized, no token provided', data: null });
        return;
    }

    const email = extractUsername(token);
    
    if (email) {
        const user = await User.findOne({ email }).select('-otp -otpExpiryTime');
        if (user) {
            req.user = user;
            next();
        } else {
            res.status(401).json({ statusCode: 401, message: 'User not found', data: null });
        }
    } else {
        res.status(401).json({ statusCode: 401, message: 'Not authorized, invalid token', data: null });
    }
};

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        res.status(403).json({ statusCode: 403, message: 'Not authorized as an admin', data: null });
    }
};