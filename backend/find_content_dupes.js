
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
        const questions = await Question.find({});

        questions.forEach(q => {
            q.options.forEach((opt, idx) => {
                if (opt.explanation) {
                    // Check if the explanation contains the same text twice
                    // Or if it starts with the Option text and then repeats it
                    if (opt.text && opt.explanation.includes(opt.text)) {
                        // This is common. 
                    }

                    // Specific check: find if any long phrase repeats
                    const text = opt.explanation;
                    if (text.length > 50) {
                        const mid = Math.floor(text.length / 2);
                        const first = text.substring(0, 40);
                        if (text.indexOf(first, 40) !== -1) {
                            console.log(`DUPLICATION DETECTED in QID: ${q._id}, Option: ${idx}`);
                            console.log(`Text: ${text}`);
                            console.log('---');
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
