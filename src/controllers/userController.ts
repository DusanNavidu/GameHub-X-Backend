import { Request, Response } from 'express';
import * as userService from '../services/userService';
import { APIResponse } from '../utils/apiResponse';

export const registerPlayer = async (req: Request, res: Response) => {
    try {
        const user = await userService.registerPlayer(req.body);
        res.status(200).json(new APIResponse(200, "Player Registered Successfully", user));
    } catch (error: any) {
        res.status(400).json(new APIResponse(400, error.message));
    }
};

export const requestOtp = async (req: Request, res: Response) => {
    try {
        await userService.sendOtpService(req.body.email);
        res.status(200).json(new APIResponse(200, "OTP sent to your email successfully"));
    } catch (error: any) {
        res.status(404).json(new APIResponse(404, error.message));
    }
};

export const verifyOtp = async (req: Request, res: Response) => {
    try {
        console.log(`Received OTP verification request for email: ${req.body.email} with OTP: ${req.body.otp}`);
        const response = await userService.verifyOtpAndLoginService(req.body.email, req.body.otp);
        res.status(200).json(new APIResponse(200, "Login Successful", response));
    } catch (error: any) {
        res.status(401).json(new APIResponse(401, error.message));
    }
};

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const response = await userService.refreshTokenService(req.body.refreshToken);
        res.status(200).json(new APIResponse(200, "Token Refreshed Successfully", response));
    } catch (error: any) {
        res.status(403).json(new APIResponse(403, error.message));
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await userService.getAllUsersService();
        res.status(200).json(new APIResponse(200, "Success", users));
    } catch (error: any) {
        res.status(500).json(new APIResponse(500, "Internal Server Error"));
    }
};