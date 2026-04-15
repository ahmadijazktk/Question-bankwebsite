
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

console.log("MONGO_URI length:", process.env.MONGO_URI?.length);

async function test() {
    console.log("Connecting...");
    try {
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
        console.log("Connected!");
        await mongoose.disconnect();
        console.log("Disconnected!");
    } catch (err) {
        console.error("Link error:", err.message);
    }
}
test();
