
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function purge() {
    try {
        console.log("Connecting to DB for PURGE...");
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 60000,
            connectTimeoutMS: 60000
        });

        const count = await Question.countDocuments({});
        console.log(`Current question count: ${count}`);

        if (count === 0) {
            console.log("No questions to delete.");
        } else {
            console.log(`Deleting ${count} questions...`);
            const result = await Question.deleteMany({});
            console.log(`Successfully deleted ${result.deletedCount} questions.`);
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error("PURGE FAILED:", err.message);
    }
}
purge();
