import mongoose from 'mongoose';
import { User } from '../models/user.model';
import { Role } from '../types/auth';
import { adminEmail, adminPassword } from '../config/env';
import { hashPassword } from '../utils/password';
import { closeDB, connectDB } from '../config/db';

async function createAdmin() {
    if (!adminEmail) throw new Error('Environment: ADMIN_EMAIL not found');
    if (!adminPassword) throw new Error('Environment: ADMIN_PASSWORD not found');

    await connectDB();

    const hashedPassword = await hashPassword(adminPassword);

    try {
        await User.create({
            email: adminEmail,
            password: hashedPassword,
            role: Role.Admin,
        });
        console.log('Admin created!');
    } catch (err) {
        if (err instanceof mongoose.mongo.MongoServerError && err.code === 11000) {
            console.log('Admin is already created');
            return;
        }
        throw err;
    } finally {
        await closeDB();
    }
}

createAdmin()
    .then(() => {
        process.exit(0);
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
