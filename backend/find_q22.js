
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function checkSpec() {
    await mongoose.connect(process.env.MONGO_URI);
    const qs = await Question.find({ image: /question_2/ });
    console.log(`Found ${qs.length} question_2 images.`);
    qs.forEach((q, i) => {
        console.log(`${i + 1}: ID: ${q._id} | Text: ${q.text?.substring(0, 30)} | Image: ${q.image} | Image2: ${q.image2}`);
    });

    // Also try to find by ID
    const q1 = await Question.findById('69a8c4187b2f91a1db352ae0');
    console.log(`Found by ID 69a8c4187b2f91a1db352ae0: ${q1 ? 'Yes' : 'No'}`);

    await mongoose.disconnect();
}
checkSpec();
