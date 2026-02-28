
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from './src/models/Question.js';

dotenv.config();

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const qs = (await Question.find({ isFreeTrialQuestion: true })).sort((a, b) => (a.freeTrialOrder || 0) - (b.freeTrialOrder || 0));
    const idx = qs.findIndex(q => q.text.includes("Spine imaging"));
    console.log(`Spine at index ${idx} (Question ${idx + 1}) Order ${qs[idx].freeTrialOrder}`);
    await mongoose.disconnect();
}

check();
