
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function deepDeduplicate() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");

        const allQs = await Question.find({});
        console.log(`Analyzing ${allQs.length} questions in DB...`);

        const seen = new Map();
        const toDelete = [];

        for (const q of allQs) {
            const text = (q.text || "").trim();
            const expl = (q.options && q.options[0] && q.options[0].explanation || "").trim();
            const summary = (q.summary || "").trim();

            // Signature: Text + Explanation + Summary
            // We ignore image name because clones often have different names
            const sig = `${text}|||${expl}|||${summary}`;

            if (seen.has(sig)) {
                toDelete.push(q._id);
            } else {
                seen.set(sig, q._id);
            }
        }

        console.log(`Found ${toDelete.length} logical duplicates.`);

        if (toDelete.length > 0) {
            console.log(`Deleting ${toDelete.length} duplicate records...`);
            const res = await Question.deleteMany({ _id: { $in: toDelete } });
            console.log(`Successfully deleted ${res.deletedCount} questions.`);
        } else {
            console.log("No logical duplicates found.");
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}
deepDeduplicate();
