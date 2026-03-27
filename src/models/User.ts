import mongoose, { Schema, Document } from 'mongoose';

export enum Role { ADMIN = 'ADMIN', PLAYER = 'PLAYER' }
export enum Status { ACTIVE = 'ACTIVE', INACTIVE = 'INACTIVE' }

export interface IUser extends Document {
    fullName: string;
    email: string;
    role: Role;
    status: Status;
    otp?: string;
    otpExpiryTime?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: Object.values(Role), default: Role.PLAYER },
    status: { type: String, enum: Object.values(Status), default: Status.ACTIVE },
    otp: { type: String, default: null },
    otpExpiryTime: { type: Date, default: null },
}, { timestamps: true }); // Mongoose automatically manages createdAt & updatedAt

export default mongoose.model<IUser>('User', UserSchema);