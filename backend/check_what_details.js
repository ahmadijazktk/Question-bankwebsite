
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function checkDetails() {
    await mongoose.connect(process.env.MONGO_URI);
    const ids = ['69a8c6ce5dfe45eec677bfe7', '69a8c4187b2f91a1db352ae0', '69a8c4187b2f91a1db352ade'];
    for (const id of ids) {
        const q = await Question.findById(id);
        console.log(`\nID: ${q._id}`);
        console.log(`Text: ${q.text}`);
        console.log(`Image: ${q.image}`);
        console.log(`Image2: ${q.image2}`);
        console.log(`Explanation: ${q.options[0]?.explanation}`);
    }
    await mongoose.disconnect();
}
checkDetails();
