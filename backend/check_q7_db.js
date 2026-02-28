
import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({
    text: String,
    isFreeTrialQuestion: Boolean,
    freeTrialOrder: Number
}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const q7 = await Question.findOne({ freeTrialOrder: 7 });
    if (q7) {
        console.log("Q7 text:", q7.text);
        console.log("Q7 showImageWithQuestion:", q7.showImageWithQuestion);
    } else {
        console.log("Q7 NOT FOUND");
    }
    await mongoose.disconnect();
}

check();
