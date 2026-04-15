
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const questions = await Question.find({ isFreeTrialQuestion: true }).sort({ freeTrialOrder: 1 });
        console.log('--- Trial Questions ---');
        questions.forEach(q => {
            console.log(`Order: ${q.freeTrialOrder} | ID: ${q._id} | Text: ${q.text?.substring(0, 50)}... | Img1: ${q.image} | Img2: ${q.image2}`);
        });

        // Also check if any other questions have the same text/images as the trial ones
        console.log('\n--- Checking for duplicates in ALL questions ---');
        const allQuestions = await Question.find({});
        const trialTexts = questions.map(q => q.text);

        const duplicates = allQuestions.filter(q =>
            !q.isFreeTrialQuestion &&
            trialTexts.includes(q.text)
        );

        if (duplicates.length > 0) {
            console.log(`Found ${duplicates.length} non-trial questions with same text as trial questions.`);
            duplicates.forEach(d => {
                const match = questions.find(q => q.text === d.text);
                console.log(`Non-Trial ID: ${d._id} matches Trial Order: ${match.freeTrialOrder} | Text: ${d.text?.substring(0, 50)}...`);
            });
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}
check();
