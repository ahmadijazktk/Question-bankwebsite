
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function findTriplets() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const questions = await Question.find({});
    const map = new Map();

    questions.forEach(q => {
        // Create a signature using text and images
        const sig = `${q.text}|${q.image}|${q.image2}`;
        if (!map.has(sig)) map.set(sig, []);
        map.get(sig).push(q);
    });

    let found = false;
    for (const [sig, list] of map.entries()) {
        if (list.length >= 3) {
            found = true;
            console.log(`\nTriplet Found (Size ${list.length}):`);
            console.log(`Signature: ${sig.substring(0, 100)}`);
            list.forEach((q, i) => {
                console.log(`  ${i + 1}: ID: ${q._id} | Created: ${q.createdAt}`);
            });
        }
    }

    if (!found) {
        console.log("No exact triplets (text + images) found.");
        // Try triplets with just text
        console.log("\nChecking for triplets with same text ONLY...");
        const textMap = new Map();
        questions.forEach(q => {
            const text = q.text || "";
            if (!textMap.has(text)) textMap.set(text, []);
            textMap.get(text).push(q);
        });

        for (const [text, list] of textMap.entries()) {
            if (list.length >= 3 && text.length > 5) { // Avoid empty or very short strings
                console.log(`\nText Triplet Found (Size ${list.length}):`);
                console.log(`Text: ${text.substring(0, 100)}`);
                list.forEach((q, i) => {
                    console.log(`  ${i + 1}: ID: ${q._id} | Image: ${q.image} | Created: ${q.createdAt}`);
                });
            }
        }
    }

    await mongoose.disconnect();
}

findTriplets();
