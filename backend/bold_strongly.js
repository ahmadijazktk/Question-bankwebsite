
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function boldStrongly() {
    await mongoose.connect(process.env.MONGO_URI);

    const qs = await Question.find({});
    let updatedCount = 0;

    for (let q of qs) {
        let modified = false;

        let newOptions = [];
        if (q.options && Array.isArray(q.options)) {
            for (let opt of q.options) {
                let changedOpt = false;

                // We want to find "STRONGLY recommend" and replace it with "<strong>STRONGLY RECOMMEND</strong>"
                if (opt.explanation && /strongly recommend/i.test(opt.explanation)) {
                    // avoid double bolding
                    let tempExpl = opt.explanation.replace(/<strong>STRONGLY<\/strong> recommend/gi, 'strongly recommend');
                    tempExpl = tempExpl.replace(/<strong>STRONGLY RECOMMEND<\/strong>/gi, 'strongly recommend');

                    if (/strongly recommend/i.test(tempExpl) || opt.explanation !== tempExpl) {
                        opt.explanation = tempExpl.replace(/strongly recommend/gi, '<strong>STRONGLY RECOMMEND</strong>');
                        changedOpt = true;
                    }
                }

                if (changedOpt) {
                    modified = true;
                }
                newOptions.push(opt);
            }
        }

        if (modified) {
            await Question.updateOne({ _id: q._id }, { $set: { options: newOptions } });
            updatedCount++;
            console.log(`Updated Question ID: ${q._id}`);
        }
    }

    console.log(`Successfully updated ${updatedCount} questions.`);
    await mongoose.disconnect();
}
boldStrongly();
