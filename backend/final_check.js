
import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from './src/models/Question.js';

dotenv.config();

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected");

    const jsonPath = "c:\\Users\\Administrator\\Music\\studyApp (2) (1)\\studyApp (2) (1)\\studyApp\\rheumzoom_mongodb_format.json";
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const jsonTrials = jsonData.filter(q => q.isFreeTrialQuestion);

    for (const q of jsonTrials) {
        const dbQ = await Question.findOne({ text: q.text });
        if (dbQ) {
            console.log(`Order ${q.freeTrialOrder}: FOUND in DB (${dbQ.category})`);
        } else {
            console.log(`Order ${q.freeTrialOrder}: MISSING in DB!`);
        }
    }

    await mongoose.disconnect();
}

check();
