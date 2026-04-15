
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const q21 = await Question.findById('69a363b4e212ad97bfa96f78');
        const q22 = await Question.findById('69a363b4e212ad97bfa96f76');

        [q21, q22].forEach(q => {
            if (q) {
                console.log(`ID: ${q._id}`);
                console.log(`Text: ${q.text}`);
                console.log(`Image: ${q.image}`);
                console.log(`Expl: ${q.options?.[0]?.explanation}`);
                console.log('---');
            }
        });

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}
check();
