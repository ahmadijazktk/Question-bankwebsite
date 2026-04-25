
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const Question = mongoose.models.Question || mongoose.model('Question', new mongoose.Schema({}, { strict: false }));

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const q = await Question.findById('69ebcbcb82f7572d9af88b58');
        fs.writeFileSync('specific_q.json', JSON.stringify(q, null, 2));
        console.log("Written to specific_q.json");
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}
run();
