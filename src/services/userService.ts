import User, { Role } from '../models/User';
import { sendEmail } from '../utils/emailUtil';
import { generateToken, generateRefreshToken, extractUsernameFromRefreshToken } from '../utils/jwtUtil';
import crypto from 'crypto';

export const registerPlayer = async (data: any) => {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
        throw new Error("Email already exists. Please login instead.");
    }
    const user = await User.create({
        fullName: data.fullName,
        email: data.email,
        role: Role.PLAYER
    });
    return user;
};

export const sendOtpService = async (email: string) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Email not found. Please register an account first.");
    }

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryTime = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    user.otp = generatedOtp;
    user.otpExpiryTime = expiryTime;
    await user.save();

    const emailBody = `Hello ${user.fullName}!\n\nYour GameHubX login clearance code is: ${generatedOtp}\n\nThis is valid for 5 minutes.`;
    await sendEmail(email, "Your GameHubX Terminal Code", emailBody);
};

export const verifyOtpAndLoginService = async (email: string, otp: string) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    if (!user.otp || user.otp !== otp) {
        throw new Error("Incorrect OTP. Please check the code and try again.");
    }

    if (!user.otpExpiryTime || new Date() > user.otpExpiryTime) {
        throw new Error("OTP has expired. Please request a new access code.");
    }

    // Clear OTP
    user.otp = undefined;
    user.otpExpiryTime = undefined;
    await user.save();

    if (user.role === Role.ADMIN) {
        const alertBody = `Hello ${user.fullName},\n\nWe detected a successful Admin login to your GameHubX account just now.`;
        await sendEmail(user.email, "Security Alert: Admin Login Detected", alertBody);
    }

    const accessToken = generateToken(user.email);
    const refreshToken = generateRefreshToken(user.email);

    return { accessToken, refreshToken, role: user.role, id: user._id };
};

export const refreshTokenService = async (token: string) => {
    const email = extractUsernameFromRefreshToken(token);
    if (!email) throw new Error("Invalid or expired refresh token");

    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    const newAccessToken = generateToken(user.email);
    const newRefreshToken = generateRefreshToken(user.email);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken, role: user.role, id: user._id };
};

export const getAllUsersService = async () => {
    return await User.find().select('-otp -otpExpiryTime');
};