
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function findMatchV2() {
    await mongoose.connect(process.env.MONGO_URI);

    const qs = await Question.find({});

    for (let q of qs) {
        if (!q.options) continue;
        for (let i = 0; i < q.options.length; i++) {
            const o = q.options[i];
            const sText = o.text || "";
            const sExpl = o.explanation || "";

            // Check descriptions provided by user
            if (sExpl.includes('Strongly recommend AGAINST') || sExpl.includes('STRONGLY RECOMMEND AGAINST')) {
                console.log(`\nPotential Q61 | ID: ${q._id}`);
                console.log(`Expl line: ${sExpl}`);
            }

            if (sText.includes('False, this is STRONGLY REC\'D AGAINST')) {
                console.log(`\nPotential Q62 | ID: ${q._id}`);
                console.log(`Text line: ${sText}`);
            }

            if (sExpl.includes('False, this is STRONGLY REC\'D AGAINST')) {
                console.log(`\nPotential Q62 in Explanation | ID: ${q._id}`);
                console.log(`Expl line: ${sExpl}`);
            }
        }
    }

    await mongoose.disconnect();
}
findMatchV2();
