
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function checkGen() {
    await mongoose.connect(process.env.MONGO_URI);
    const images = ['q_non_live_vax_gen.png', 'q_question_23.png', 'q_vax_q3_v3.png', 'q_vax_q4_v3.png'];
    const qs = await Question.find({ image: { $in: images } });
    qs.forEach(q => {
        console.log(`\nID: ${q._id}`);
        console.log(`Image: ${q.image}`);
        console.log(`Expl: ${q.options?.[0]?.explanation?.substring(0, 100)}`);
    });
    await mongoose.disconnect();
}
checkGen();
