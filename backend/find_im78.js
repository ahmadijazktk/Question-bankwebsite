
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function findIm78() {
    await mongoose.connect(process.env.MONGO_URI);

    // Search image filename
    const qs = await Question.find({ image: /78/ });
    console.log(`Found ${qs.length} questions matching image /78/`);
    qs.forEach(q => {
        console.log(`\nID: ${q._id}`);
        console.log(`Text: ${q.text.substring(0, 100)}`);
        console.log(`Image: ${q.image}`);
    });

    await mongoose.disconnect();
}
findIm78();
