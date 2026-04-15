
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function findQ1() {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("=== First 5 questions by createdAt ===");
    const qs = await Question.find({}).sort({ createdAt: 1 }).limit(5);
    qs.forEach((q, i) => {
        console.log(`\nIndex ${i} ID: ${q._id}`);
        console.log(`Text: ${q.text?.substring(0, 100)}`);
        console.log(`Image: ${q.image}`);
        console.log(`Image2: ${q.image2}`);
        q.options.forEach((o, j) => {
            console.log(`Opt ${j} Text: ${o.text?.substring(0, 50)}`);
            console.log(`Opt ${j} Expl: ${o.explanation?.substring(0, 100)}`);
        });
    });

    console.log("\n=== First 5 questions by freeTrialOrder ===");
    const qsTrial = await Question.find({ freeTrialOrder: { $exists: true } }).sort({ freeTrialOrder: 1 }).limit(5);
    qsTrial.forEach((q, i) => {
        console.log(`\nTrialOrder ${q.freeTrialOrder} ID: ${q._id}`);
        console.log(`Text: ${q.text?.substring(0, 100)}`);
        q.options.forEach((o, j) => {
            console.log(`Opt ${j} Expl: ${o.explanation?.substring(0, 100)}`);
        });
    });

    // Also search for "live attenuated"
    console.log("\n=== Search for 'live attenuated' ===");
    const qsVac = await Question.find({ text: /live attenuated/i });
    qsVac.forEach((q, i) => {
        console.log(`\nID: ${q._id}`);
        console.log(`Text: ${q.text?.substring(0, 100)}`);
    });

    await mongoose.disconnect();
}
findQ1();
