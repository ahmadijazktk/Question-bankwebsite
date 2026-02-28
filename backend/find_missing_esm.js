
import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from './src/models/Question.js';

dotenv.config();

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected");

    const dbQuestions = await Question.find({ isFreeTrialQuestion: true });
    const dbTexts = new Set(dbQuestions.map(q => q.text));

    const jsonPath = "c:\\Users\\Administrator\\Music\\studyApp (2) (1)\\studyApp (2) (1)\\studyApp\\rheumzoom_mongodb_format.json";
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const jsonTrials = jsonData.filter(q => q.isFreeTrialQuestion);

    console.log(`DB Trial Count: ${dbQuestions.length}`);
    console.log(`JSON Trial Count: ${jsonTrials.length}`);

    jsonTrials.forEach((q, i) => {
        if (!dbTexts.has(q.text)) {
            console.log(`MISSING TRIAL: Order ${q.freeTrialOrder} | ${q.text.substring(0, 100)}...`);
        }
    });

    await mongoose.disconnect();
}

check();
