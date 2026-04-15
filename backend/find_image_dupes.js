
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function checkImageTriplets() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const questions = await Question.find({});
    const imageMap = new Map();

    questions.forEach(q => {
        const image = q.image;
        if (image) {
            if (!imageMap.has(image)) imageMap.set(image, []);
            imageMap.get(image).push(q);
        }
    });

    let found = false;
    for (const [image, list] of imageMap.entries()) {
        if (list.length >= 2) { // Show all duplicates
            found = true;
            console.log(`\nImage Duplicate/Triplet (Size ${list.length}):`);
            console.log(`Image: ${image}`);
            list.forEach((q, i) => {
                console.log(`  ${i + 1}: ID: ${q._id} | Text: ${q.text?.substring(0, 50)} | Created: ${q.createdAt}`);
            });
        }
    }

    if (!found) console.log("No duplicate images found.");

    await mongoose.disconnect();
}

checkImageTriplets();
