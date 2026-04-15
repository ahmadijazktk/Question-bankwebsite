
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const imagesDir = path.join(__dirname, '..', 'src', 'images');

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

function getHash(filename) {
    if (!filename) return null;
    const p = path.join(imagesDir, filename);
    if (!fs.existsSync(p)) return null;
    return crypto.createHash('md5').update(fs.readFileSync(p)).digest('hex');
}

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    const questions = await Question.find({});
    console.log(`Analyzing ${questions.length} questions...`);

    const groups = new Map();

    questions.forEach(q => {
        const text = (q.text || "").trim();
        const expl = (q.options?.[0]?.explanation || "").trim();
        const imgHash = getHash(q.image);
        const img2Hash = getHash(q.image2);

        // Signature: Text + Explanation (if not placeholder) + Image Content
        // If explanation is generic, we ignore it for group signature but flag it
        const isGeneric = /Review the provided image|Show Answer/i.test(expl);
        const sig = `${text}||${imgHash}||${img2Hash}${isGeneric ? '' : '||' + expl}`;

        if (!groups.has(sig)) groups.set(sig, []);
        groups.get(sig).push(q);
    });

    for (const [sig, list] of groups.entries()) {
        if (list.length > 1) {
            console.log(`\nDUPLICATE SET (Size ${list.length}):`);
            console.log(`Signature: ${sig.substring(0, 100)}...`);
            list.forEach((q, i) => {
                console.log(`  ${i + 1}. ID: ${q._id} | Img: ${q.image} | Expl: ${q.options?.[0]?.explanation?.substring(0, 50)}... | Created: ${q.createdAt}`);
            });
        }
    }

    await mongoose.disconnect();
}
run();
