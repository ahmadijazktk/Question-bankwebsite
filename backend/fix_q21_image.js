
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const imagesDir = path.join(__dirname, '..', 'src', 'images');

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function checkIndex21() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // Find the 21st regular question (Position 21 means index 20)
        const q = await Question.find({ isFreeTrialQuestion: { $ne: true } })
            .sort({ createdAt: -1 })
            .skip(20)
            .limit(1);

        if (q.length > 0) {
            const question = q[0];
            console.log("--- QUESTION AT POSITION 21 ---");
            console.log(`ID: ${question._id}`);
            console.log(`Text: ${question.text}`);
            console.log(`Image: ${question.image}`);
            console.log(`Image2: ${question.image2}`);

            if (question.image) {
                const p = path.join(imagesDir, question.image);
                console.log(`Image path: ${p}`);
                console.log(`File exists: ${fs.existsSync(p)}`);
            }

            if (question.image2) {
                const p2 = path.join(imagesDir, question.image2);
                console.log(`Image2 path: ${p2}`);
                console.log(`File exists: ${fs.existsSync(p2)}`);
            }
        } else {
            console.log("No question found at position 21.");
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}
checkIndex21();
