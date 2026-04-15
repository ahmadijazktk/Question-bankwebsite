
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function findFinal() {
    await mongoose.connect(process.env.MONGO_URI);

    const qs = await Question.find({ "options.explanation": /recommend/i });
    console.log(`Found ${qs.length} questions with 'recommend' in explanation`);

    qs.forEach(q => {
        let print = false;
        q.options.forEach(o => {
            if (o.explanation &&
                (o.explanation.includes('Strongly recommend AGAINST') ||
                    o.explanation.includes('STRONGLY REC\'D AGAINST') ||
                    o.explanation.includes('STRONGLY RECOMMEND AGAINST'))) {
                print = true;
            }
        });

        if (print) {
            console.log(`\nID: ${q._id}`);
            console.log(`Text: ${q.text.substring(0, 100)}`);
            q.options.forEach((o, i) => console.log(`Opt ${i} Expl: ${o.explanation}`));
        }
    });

    await mongoose.disconnect();
}
findFinal();
