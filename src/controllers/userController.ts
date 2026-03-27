import { Request, Response } from "express";
import User, { IUser, Role, Status } from "../models/User";
import { signAccessToken, signRefreshToken } from "../utils/tokens";
import { AUthRequest } from "../middlewares/auth";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
dotenv.config();

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS 
    }
});

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Token required" });
    }

    const payload: any = jwt.verify(token, JWT_REFRESH_SECRET);
    const user = await User.findById(payload.sub);
    if (!user) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }
    const accessToken = signAccessToken(user);

    res.status(200).json({
      accessToken,
    });
  } catch (err) {
    res.status(403).json({ message: "Invalid or expire token" });
  }
};

export const getMyProfile = async (req: AUthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  const user = await User.findById(req.user.sub).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const { email, fullName, _id, role } = user as IUser;

  res.status(200).json({ 
    message: "ok", 
    data: { id: _id, email, fullName, role }
  });
};

export const verifyOTP = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.otp !== otp || !user.otpExpiryTime || user.otpExpiryTime < new Date()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        user.otp = undefined;
        user.otpExpiryTime = undefined;
        await user.save();

        const accessToken = signAccessToken(user);
        const refreshToken = signRefreshToken(user);

        res.status(200).json({
            message: "Login successful",
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Login failed", error });
    }
};

export const requestOTP = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found. Please register first." });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins valid

        user.otp = otp;
        user.otpExpiryTime = otpExpiry;
        await user.save();

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your GameHub-X Login OTP",
            text: `Your OTP is: ${otp}. It will expire in 10 minutes.`
        });

        res.status(200).json({ message: "OTP sent to your email!" });
    } catch (error) {
        res.status(500).json({ message: "Error sending OTP", error });
    }
};

export const register = async (req: Request, res: Response) => {
    try {
        const { fullName, email } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        const newUser = await User.create({
            fullName,
            email,
            role: Role.PLAYER,
            status: Status.ACTIVE
        });

        res.status(201).json({ message: "Registration successful!", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const getAllPlayers = async (req: Request, res: Response) => {
    try {
        const players = await User.find({ role: Role.PLAYER })
                                  .select("-otp -otpExpiryTime")
                                  .sort({ createdAt: -1 });
        res.status(200).json({ data: players });
    } catch (error) {
        res.status(500).json({ message: "Server error fetching players", error });
    }
};

export const toggleUserStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role === Role.ADMIN) {
            return res.status(403).json({ message: "Cannot modify ADMIN status" });
        }

        user.status = user.status === Status.ACTIVE ? Status.INACTIVE : Status.ACTIVE;
        await user.save();

        res.status(200).json({ message: `Player is now ${user.status}`, data: user });
    } catch (error) {
        res.status(500).json({ message: "Server error toggling status", error });
    }
};