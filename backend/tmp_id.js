
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function run() {
    await mongoose.connect(process.env.MONGO_URI);

    const q = await Question.findById('69a3631be212ad97bfa96f3c'); // Corrected ID from previous step: f3c at end
    // Wait, the output said ID: 69a363b1e212ad97bfa96f3c. My previous read was 69a363b1...

    // Let's re-verify the ID carefully from the terminal output.
    // "ID: 69a363b1e212ad97bfa96f3c"
}
run();
