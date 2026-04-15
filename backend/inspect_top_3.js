
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function delQuestions() {
    await mongoose.connect(process.env.MONGO_URI);
    const qs = await Question.find({ text: /.*/ }).sort({ createdAt: -1 }).limit(10);
    console.log(`Checking Top 3 of last 10 issues...`);
    for (let i = 0; i < 3; i++) {
        const q = qs[i];
        console.log(`\nQuestion ${i + 1}:`);
        console.log(`ID: ${q._id}`);
        console.log(`Image: ${q.image}`);
        console.log(`Image2: ${q.image2}`);
        console.log(`Summary: ${q.summary}`);
    }

    // We will check if the user is referring to the top 3 items in the db.
    // Question 1, 2, 3 in recent list? Wait.
    // The user's most recent interaction before "question 1, 2 3 are same" was adding 3 questions:
    // They asked to add visual questions: "the user wants to add new questions to the website. Each question will consist of an image for the question itself and a second, hidden image for the answer, revealed upon clicking a button. The user has provided the images and the question text 'What do you do?'"

    await mongoose.disconnect();
}
delQuestions();
