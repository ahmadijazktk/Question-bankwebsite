
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from './src/models/Question.js';

dotenv.config();

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const q8 = await Question.findOne({ freeTrialOrder: 8, isFreeTrialQuestion: true });
    if (q8) {
        console.log("Q8 Order:", q8.freeTrialOrder);
        console.log("Q8 Text:", q8.text);
        console.log("Q8 ShowImage:", q8.showImageWithQuestion);
    } else {
        console.log("Q8 NOT FOUND");
    }
    await mongoose.disconnect();
}

check();
