
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function fix() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // Fix Q21 - question108_image.jpg to png
        const q21 = await Question.findById('69a363b4e212ad97bfa96f78');
        if (q21) {
            console.log(`Fixing Q21 (${q21._id}). Changing ${q21.image} to .png`);
            q21.image = 'question108_image.png';
            q21.showImageWithQuestion = true;
            await q21.save();
            console.log("Q21 fixed.");
        }

        // Also fix Q22
        const q22 = await Question.findById('69a363b4e212ad97bfa96f76');
        if (q22) {
            console.log(`Fixing Q22 (${q22._id})`);
            q22.showImageWithQuestion = true;
            await q22.save();
            console.log("Q22 fixed.");
        }

        // Let's also check EVERYTHING else that might be broken
        // Search for any other 'What is shown here?' or 'See image' questions
        const others = await Question.find({
            $or: [
                { text: /shown here/i },
                { "options.explanation": /See image/i }
            ]
        });

        console.log(`Ensuring ${others.length} visual questions are visible...`);
        for (const q of others) {
            if (!q.showImageWithQuestion) {
                q.showImageWithQuestion = true;
                await q.save();
                console.log(`Enabled visibility for ${q._id}`);
            }
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}
fix();
