
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function findSpecifics() {
    await mongoose.connect(process.env.MONGO_URI);

    const q61 = await Question.find({ "options.explanation": /Strongly recommend AGAINST/ });
    const q62 = await Question.find({ "options.explanation": /STRONGLY REC'D AGAINST/ });

    console.log(`Q61 matches: ${q61.length}`);
    q61.forEach(q => console.log(`ID: ${q._id} | Text: ${q.text.substring(0, 50)} | Expl: ${q.options.map(o => o.explanation).join(' | ')}`));

    console.log(`Q62 matches: ${q62.length}`);
    q62.forEach(q => console.log(`ID: ${q._id} | Text: ${q.text.substring(0, 50)} | Expl: ${q.options.map(o => o.explanation).join(' | ')}`));

    // Also just list 60-65 to see
    const all = await Question.find({}).sort({ createdAt: 1 }); // or just any order
    // But index in DB is hard to say.

    await mongoose.disconnect();
}
findSpecifics();
