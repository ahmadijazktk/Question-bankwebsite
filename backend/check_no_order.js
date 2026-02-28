
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from './src/models/Question.js';

dotenv.config();

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const qs = await Question.find({ isFreeTrialQuestion: true });
    qs.forEach(q => {
        if (q.freeTrialOrder === undefined || q.freeTrialOrder === null) {
            console.log(`NO ORDER: ${q.text.substring(0, 100)}`);
        }
    });
    await mongoose.disconnect();
}

check();
