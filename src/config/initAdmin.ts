import User, { Role, Status } from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

export const initAdminUser = async () => {
    const adminEmail = process.env.ADMIN_EMAIL as string;
    const adminFullName = process.env.ADMIN_FULLNAME as string;

    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
        await User.create({
            fullName: adminFullName,
            email: adminEmail,
            role: Role.ADMIN,
            status: Status.ACTIVE
        });
        console.log(`Default ADMIN user created: Email=${adminEmail}`);
    } else {
        console.log(`System Boot: ADMIN user already exists (${adminEmail})`);
    }
};