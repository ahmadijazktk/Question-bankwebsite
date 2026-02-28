
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from './src/models/Question.js';

dotenv.config();

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const qs = await Question.find({ isFreeTrialQuestion: true });
    qs.forEach(q => {
        console.log(`Order: ${q.freeTrialOrder} | ${q.text.substring(0, 100).replace(/\n/g, ' ')}`);
    });
    console.log(`TOTAL TRIAL: ${qs.length}`);
    await mongoose.disconnect();
}

check();
