import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from './src/models/Question.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        const questions = await Question.find({
            $or: [
                { text: { $regex: /CONDITIONALLY/i } },
                { 'options.explanation': { $regex: /CONDITIONALLY/i } }
            ]
        });

        console.log(`Found ${questions.length} questions with "CONDITIONALLY"`);
        questions.slice(0, 3).forEach(q => {
            console.log('---');
            console.log('Question:', q.text);
            q.options.forEach((opt, i) => {
                if (opt.explanation.includes('CONDITIONALLY')) {
                    console.log(`Explanation ${i}:`, opt.explanation);
                }
            });
        });

        await mongoose.disconnect();
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
