
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function updateQ38() {
    await mongoose.connect(process.env.MONGO_URI);

    // The target ID is 69a362f2e212ad97bfa96aae
    const qid = '69a362f2e212ad97bfa96aae';
    const q = await Question.findById(qid);

    if (q && q.options && q.options.length > 0) {
        let correctOpt = q.options.find(o => o.isCorrect === true);
        if (correctOpt) {
            correctOpt.explanation = `1) do combination MMF, belimumab, and CNI (ie. voclosporin).\n2) add anti-CD20 (ie. RTX) to current regimen \n3) referral for investigational therapy.\n<br/>\n" In people with any LN class with refractory disease (i.e., failed two standard therapy courses), we <strong>CONDITIONALLY RECOMMEND</strong> treatment escalation to a more intensive regimen, including addition of anti-CD20 agents, OR.....combination therapy with three non-glucocorticoid immunosuppressives (i.e., MPAA, belimumab and CNI)....OR.... referral for investigational therapy."`;

            await Question.updateOne({ _id: qid }, { $set: { options: q.options } });
            console.log("Successfully updated question!");
        } else {
            console.log("Could not find correct option to update");
        }
    } else {
        console.log("Question not found or missing options");
    }

    await mongoose.disconnect();
}
updateQ38();
