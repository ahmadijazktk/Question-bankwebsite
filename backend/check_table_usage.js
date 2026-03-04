
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({
    image: String,
    image2: String,
    text: String
}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const qs = await Question.find({ $or: [{ image: 'give_or_defer_vaccine_table.png' }, { image2: 'give_or_defer_vaccine_table.png' }] });
    console.log(`Found ${qs.length} questions using give_or_defer_vaccine_table.png.`);
    qs.forEach(q => {
        console.log(`ID: ${q._id} | Text: ${q.text.substring(0, 50)}`);
    });

    const qs2 = await Question.find({ $or: [{ image: 'how_long_vaccine_table.png' }, { image2: 'how_long_vaccine_table.png' }] });
    console.log(`Found ${qs2.length} questions using how_long_vaccine_table.png.`);
    qs2.forEach(q => {
        console.log(`ID: ${q._id} | Text: ${q.text.substring(0, 50)}`);
    });

    await mongoose.disconnect();
}

check();
