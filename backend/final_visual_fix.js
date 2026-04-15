
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function finalCleanup() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // 1. Delete the broken question with "See image." explanation and no diagnosis
        const delRes = await Question.deleteOne({ _id: '69a363b4e212ad97bfa96f78' });
        console.log(`Deleted broken question 21: ${delRes.deletedCount}`);

        // 2. Ensure Question 22 (now 21) is visible and uses a working image reference
        // hyperparathyroidism_hand.jpg was working according to logic
        const q22 = await Question.findById('69a363b4e212ad97bfa96f76');
        if (q22) {
            console.log(`Enabling visibility and verifying image for new Question 21: ${q22._id}`);
            q22.showImageWithQuestion = true;
            // Map to the most likely working filename if needed, but let's stick to hyperparathyroidism_hand.jpg
            await q22.save();
        }

        // 3. One more check for ANY same-text duplicates of "What is shown here?"
        // We want to keep ONLY the ones with descriptive explanations.
        const shownHere = await Question.find({ text: /shown here/i });
        console.log(`Reviewing remaining ${shownHere.length} 'What is shown here?' questions...`);

        for (const q of shownHere) {
            const expl = (q.options?.[0]?.explanation || "").trim();
            if (expl.toLowerCase() === "show answer" || expl.toLowerCase() === "see image.") {
                console.log(`Deleting another broken entry: ${q._id}`);
                await Question.deleteOne({ _id: q._id });
            } else {
                console.log(`Keeping: ${q._id} (${q.image})`);
                q.showImageWithQuestion = true;
                await q.save();
            }
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}
finalCleanup();
