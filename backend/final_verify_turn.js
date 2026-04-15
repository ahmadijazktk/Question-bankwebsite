
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function finalVerify() {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("=== VERIFICATION ===");

    const q47 = await Question.findById('69a363b1e212ad97bfa96f3a');
    console.log("\nQ47 ID:", q47?._id);
    console.log("Q47 Expl:", q47?.options[0].explanation);

    const q61 = await Question.findById('69a362f2e212ad97bfa96ab0');
    console.log("\nQ61 ID:", q61?._id);
    console.log("Q61 Expl:", q61?.options[0].explanation);

    const q62 = await Question.findById('69a363afe212ad97bfa96f1c');
    console.log("\nQ62 ID:", q62?._id);
    console.log("Q62 Text (Option):", q62?.options[0].text);

    await mongoose.disconnect();
}
finalVerify();
