
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    const q = await Question.findById('69a363b3e212ad97bfa96f60');

    // Write all options to file for clean reading
    const output = q.options.map((o, i) => `=== Opt ${i}: ${o.text} ===\n${o.explanation}`).join('\n\n');
    fs.writeFileSync('q30_expl.txt', output, 'utf8');
    console.log("Written to q30_expl.txt");

    await mongoose.disconnect();
}
run();
