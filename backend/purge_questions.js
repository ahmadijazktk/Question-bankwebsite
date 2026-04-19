
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
    const uris = [
        process.env.MONGO_URI,
        'mongodb://localhost:27017/studybloom'
    ];

    for (const uri of uris) {
        if (!uri) continue;
        console.log(`\n--- Attempting Purge on: ${uri.substring(0, 30)}... ---`);
        try {
            const conn = await mongoose.connect(uri, {
                serverSelectionTimeoutMS: 5000, // FAST FAIL
            });

            const count = await Question.countDocuments({});
            console.log(`Current question count: ${count}`);

            if (count > 0) {
                const result = await Question.deleteMany({});
                console.log(`✅ Successfully deleted ${result.deletedCount} questions.`);
            } else {
                console.log("No questions to delete.");
            }

            await mongoose.disconnect();
        } catch (err) {
            console.error(`❌ Failed to purge this DB: ${err.message}`);
        }
    }
}
purge();
