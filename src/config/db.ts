import mongoose from 'mongoose';
import { mongodbUri } from './env';

export async function connectDB() {
    await mongoose.connect(mongodbUri);
    console.log('MongoDB Connected!');
}

export async function closeDB() {
    await mongoose.disconnect();
    console.log('MongoDB Disconnected!');
}
