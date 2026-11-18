import { User, Roles } from '../models/User';
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
            role: Roles.Admin,
        });
        console.log('Admin created!');
    } catch (err) {
        if ((err as any).code === 11000) {
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
