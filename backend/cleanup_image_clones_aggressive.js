
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
    if (!fs.existsSync(p)) return 'MISSING_' + filename;
    return crypto.createHash('md5').update(fs.readFileSync(p)).digest('hex');
}

async function cleanup() {
    await mongoose.connect(process.env.MONGO_URI);
    const questions = await Question.find({ text: /What do you do\??/i });
    console.log(`Found ${questions.length} 'What do you do?' questions.`);

    const groups = new Map();

    questions.forEach(q => {
        const h = getHash(q.image);
        if (!h) return; // Ignore questions with no image content for this pass

        if (!groups.has(h)) groups.set(h, []);
        groups.get(h).push(q);
    });

    const toDelete = [];

    for (const [hash, list] of groups.entries()) {
        if (list.length > 1) {
            console.log(`\nDuplicate Image Content Found (Hash: ${hash.substring(0, 10)}...):`);

            // Prioritize the one with the longest/most descriptive explanation
            list.sort((a, b) => {
                const explA = (a.options?.[0]?.explanation || "").trim();
                const explB = (b.options?.[0]?.explanation || "").trim();
                const isGenA = /Review the provided image|Show Answer/i.test(explA);
                const isGenB = /Review the provided image|Show Answer/i.test(explB);

                if (!isGenA && isGenB) return -1;
                if (isGenA && !isGenB) return 1;

                return explB.length - explA.length;
            });

            console.log(`Keeping: ${list[0]._id} (Img: ${list[0].image}, Expl: ${list[0].options?.[0]?.explanation?.substring(0, 30)}...)`);
            for (let i = 1; i < list.length; i++) {
                console.log(`Deleting: ${list[i]._id} (Img: ${list[i].image}, Expl: ${list[i].options?.[0]?.explanation?.substring(0, 30)}...)`);
                toDelete.push(list[i]._id);
            }
        }
    }

    if (toDelete.length > 0) {
        console.log(`\nProceeding to delete ${toDelete.length} image clons questions...`);
        const res = await Question.deleteMany({ _id: { $in: toDelete } });
        console.log(`Deleted ${res.deletedCount} items.`);
    } else {
        console.log("\nNo image clones found to delete.");
    }

    await mongoose.disconnect();
}
cleanup();
