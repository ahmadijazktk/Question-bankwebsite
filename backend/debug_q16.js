
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
    const q16 = jsonData.find(q => q.freeTrialOrder === 16);

    console.log("Q16 Object:", JSON.stringify(q16, null, 2));

    try {
        console.log("Creating Order 16...");
        const res = await Question.create(q16);
        console.log("Success!", res._id);
    } catch (err) {
        console.error("FAIL:", err.message);
        if (err.errors) {
            Object.keys(err.errors).forEach(k => console.log(`  Error on ${k}: ${err.errors[k].message}`));
        }
    }

    await mongoose.disconnect();
}

check();
