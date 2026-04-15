
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function deduplicate() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");

        const allQuestions = await Question.find({});
        console.log(`Analyzing ${allQuestions.length} questions...`);

        const signatureMap = new Map();
        const duplicatesToDelete = [];

        // Sort by createdAt descending to keep the newest version of a duplicate if they exist
        allQuestions.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

        allQuestions.forEach(q => {
            const optionsSig = (q.options || []).map(o => o.explanation).join('|');
            // Signature factors in text, explanations, and main images
            const signature = `${q.text}|${optionsSig}|${q.summary}|${q.image}|${q.image2}`;

            if (signatureMap.has(signature)) {
                duplicatesToDelete.push(q._id);
            } else {
                signatureMap.set(signature, q);
            }
        });

        console.log(`Found ${duplicatesToDelete.length} duplicates.`);

        if (duplicatesToDelete.length > 0) {
            console.log("Starting deletion...");
            const result = await Question.deleteMany({ _id: { $in: duplicatesToDelete } });
            console.log(`Successfully removed ${result.deletedCount} duplicates.`);
        }

        // Final fix for visual questions layout
        const visualFix = await Question.updateMany(
            { text: "What do you do?", showImageWithQuestion: { $ne: true } },
            { $set: { showImageWithQuestion: true } }
        );
        console.log(`Ensured visibility for ${visualFix.modifiedCount} visual questions.`);

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await mongoose.disconnect();
    }
}
deduplicate();
