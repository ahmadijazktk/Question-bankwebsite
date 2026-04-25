
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const Question = mongoose.models.Question || mongoose.model('Question', new mongoose.Schema({}, { strict: false }));

async function findDupes() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const questions = await Question.find({
            "options.explanation": /color: #000; font-weight: 600;/
        });

        questions.forEach(q => {
            q.options.forEach(opt => {
                if (opt.explanation) {
                    const count = (opt.explanation.match(/color: #000; font-weight: 600;/g) || []).length;
                    if (count > 0) {
                        // Check for actual text duplication
                        // If the text repeats itself
                        const mid = Math.floor(opt.explanation.length / 2);
                        const firstHalf = opt.explanation.substring(0, mid);
                        const secondHalf = opt.explanation.substring(mid);
                        // This is a rough check.

                        // Let's just find any question where the explanation is suspiciously long or has repeated phrases
                        if (opt.explanation.length > 200) {
                            const sentences = opt.explanation.split('. ');
                            if (sentences.length > 2) {
                                const first = sentences[0];
                                if (opt.explanation.indexOf(first, first.length) !== -1) {
                                    console.log(`Potential duplication in QID: ${q._id}`);
                                    console.log(`Snippet: ${opt.explanation.substring(0, 500)}`);
                                }
                            }
                        }
                    }
                }
            });
        });
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}
findDupes();
