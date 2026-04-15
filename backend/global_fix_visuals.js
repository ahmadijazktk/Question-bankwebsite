
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function globalFix() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // 1. Convert all occurrences of the problematic filename
        const res1 = await Question.updateMany(
            { image: 'question108_image.jpg' },
            { $set: { image: 'question108_image.png' } }
        );
        console.log(`Updated ${res1.modifiedCount} questions from JPG to PNG.`);

        // 2. Identify all visual questions and enable showImageWithQuestion
        const res2 = await Question.updateMany(
            {
                $or: [
                    { text: /shown here/i },
                    { text: /What is shown/i },
                    { "options.explanation": /See image/i }
                ],
                showImageWithQuestion: { $ne: true }
            },
            { $set: { showImageWithQuestion: true } }
        );
        console.log(`Enabled visibility for ${res2.modifiedCount} visual questions.`);

        // 3. Verify Question 21 specifically
        const q21 = await Question.findById('69a363b4e212ad97bfa96f78');
        if (q21) {
            console.log("Q21 Final Check:");
            console.log(`- Image: ${q21.image}`);
            console.log(`- Visible: ${q21.showImageWithQuestion}`);
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}
globalFix();
