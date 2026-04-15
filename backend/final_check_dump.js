
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

    const q29Id = '69a363b3e212ad97bfa96f62';
    const q30Id = '69a363b3e212ad97bfa96f60';

    const q29 = await Question.findById(q29Id);
    const q30 = await Question.findById(q30Id);

    console.log("Q29 Options Explanations:");
    q29?.options.forEach((o, i) => console.log(`Opt ${i}: ${o.explanation.substring(0, 200)}`));

    console.log("\nQ30 Options Explanations:");
    q30?.options.forEach((o, i) => console.log(`Opt ${i}: ${o.explanation.substring(0, 200)}`));

    await mongoose.disconnect();
}
run();
