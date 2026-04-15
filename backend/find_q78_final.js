
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function find78() {
    await mongoose.connect(process.env.MONGO_URI);

    // 1. Check freeTrialOrder
    const qTrial = await Question.findOne({ freeTrialOrder: 78 });
    if (qTrial) {
        console.log("=== Found by freeTrialOrder 78 ===");
        console.log(`ID: ${qTrial._id}`);
        console.log(`Text: ${qTrial.text}`);
        console.log(`Image: ${qTrial.image}`);
    }

    // 2. Check clinical index 78 (1-indexed, so index 77)
    // Actually finding by creation index is better
    const all = await Question.find({}).sort({ createdAt: 1 });
    const q78_abs = all[77];
    if (q78_abs) {
        console.log("\n=== Found by absolute creation index 77 (Question 78) ===");
        console.log(`ID: ${q78_abs._id}`);
        console.log(`Text: ${q78_abs.text}`);
        console.log(`Image: ${q78_abs.image}`);
    }

    // 3. Search for the word "78"
    const qSearch = await Question.find({
        $or: [
            { text: /78/ },
            { "options.explanation": /78/ }
        ]
    });
    console.log(`\nFound ${qSearch.length} questions containing '78'`);

    await mongoose.disconnect();
}
find78();
