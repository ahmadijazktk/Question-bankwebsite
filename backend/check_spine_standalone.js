
const mongoose = require('mongoose');
const URI = 'mongodb+srv://romankhanrk1435rs_db_user:MBxY2R9kXIgYUubQ@cluster0.u4scequ.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0';

const Question = mongoose.model('Question', new mongoose.Schema({
    text: String,
    isFreeTrialQuestion: Boolean,
    freeTrialOrder: Number,
    showImageWithQuestion: Boolean
}, { collection: 'questions' }));

async function check() {
    await mongoose.connect(URI);
    const qs = await Question.find({ text: /Spine imaging/, isFreeTrialQuestion: true });
    console.log(`Found ${qs.length} trial spine questions:`);
    qs.forEach((q, i) => {
        console.log(`- ID: ${q._id}, Order: ${q.freeTrialOrder}, ShowImage: ${q.showImageWithQuestion}`);
    });
    await mongoose.disconnect();
}

check();
