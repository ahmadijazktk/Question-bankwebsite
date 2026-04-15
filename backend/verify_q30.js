
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

async function verify() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const ids = ['69a363b3e212ad97bfa96f64', '69a363b3e212ad97bfa96f62', '69a363b3e212ad97bfa96f60'];
        const qs = await Question.find({ _id: { $in: ids } });

        console.log(`Found ${qs.length} questions.`);
        qs.forEach(q => {
            console.log(`\nID: ${q._id}`);
            q.options.forEach((o, i) => {
                if (o.explanation && o.explanation.includes('Essentially')) {
                    console.log(`Option ${i}: ${o.explanation}`);
                }
            });
        });
    } finally {
        await mongoose.disconnect();
    }
}
verify();
