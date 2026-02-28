
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const Question = mongoose.model('Question', new mongoose.Schema({
    text: String,
    isFreeTrialQuestion: Boolean,
    freeTrialOrder: Number,
    showImageWithQuestion: Boolean
}, { collection: 'questions' }));

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const qs = await Question.find({ text: /Spine imaging/, isFreeTrialQuestion: true });
    console.log(`Found ${qs.length} trial spine questions:`);
    qs.forEach((q, i) => {
        console.log(`- ID: ${q._id}, Order: ${q.freeTrialOrder}, ShowImage: ${q.showImageWithQuestion}`);
    });
    await mongoose.disconnect();
}

check();
