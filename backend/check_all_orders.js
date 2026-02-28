
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from './src/models/Question.js';

dotenv.config();

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const qs = await Question.find({ isFreeTrialQuestion: true });
    qs.sort((a, b) => (a.freeTrialOrder || 0) - (b.freeTrialOrder || 0));
    console.log(`TOTAL: ${qs.length}`);
    for (let i = 0; i < qs.length; i++) {
        console.log(`${i + 1}: Order ${qs[i].freeTrialOrder} | SHOWIMAGE ${qs[i].showImageWithQuestion} | ${qs[i].text.substring(0, 40).replace(/\n/g, ' ')}`);
    }
    await mongoose.disconnect();
}

check();
