
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function run() {
    await mongoose.connect(process.env.MONGO_URI);

    // Q29 and Q30 IDs based on previous steps
    const q29Id = '69a363b3e212ad97bfa96f62';
    const q30Id = '69a363b3e212ad97bfa96f60';

    const q29 = await Question.findById(q29Id);
    const q30 = await Question.findById(q30Id);

    console.log("--- FINAL VERIFICATION ---");

    if (q29) {
        console.log("\nQUESTION 29 (Correct Option Explanation):");
        console.log(q29.options.find(o => !o.text.includes("Incorrect"))?.explanation);
    }

    if (q30) {
        console.log("\nQUESTION 30 (Correct Option Explanation):");
        console.log(q30.options.find(o => o.explanation.includes("Essentially"))?.explanation);
    }

    await mongoose.disconnect();
}
run();
