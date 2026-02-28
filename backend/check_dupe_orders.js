
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from './src/models/Question.js';

dotenv.config();

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const qs = await Question.find({ isFreeTrialQuestion: true });
    const orders = {};
    qs.forEach(q => {
        if (!orders[q.freeTrialOrder]) orders[q.freeTrialOrder] = [];
        orders[q.freeTrialOrder].push(q.text.substring(0, 30));
    });
    console.log("DUPLICATE ORDERS:");
    Object.keys(orders).forEach(o => {
        if (orders[o].length > 1) {
            console.log(`Order ${o}: ${orders[o].join(' | ')}`);
        }
    });
    await mongoose.disconnect();
}

check();
