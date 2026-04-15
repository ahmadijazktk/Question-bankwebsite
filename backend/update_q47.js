
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function updateQ47() {
    await mongoose.connect(process.env.MONGO_URI);

    const qid = '69a363b1e212ad97bfa96f3a';
    const q = await Question.findById(qid);

    if (q && q.options && q.options.length > 0) {
        let options = q.options;
        const newExpl = `-MMF + belimumab)\n<br/>\n…or \n<br/>\n-MMF + CNI (calcineurin inhibitor)\n<br/>\n...or \n<br/>\n-Low dose CYC (Euro-Lupus Nephritis Trial) + belimumab (MMF substituted for CYC after CYC course complete) “<strong>CONDITIONALLY RECOMMEND</strong>" \n<br/>\nIt get's more specific than this actually, but you can break it down easily: \n<br/>\npick MMF + CNI if patient has proteinuria ≥3g/g (or if patient has Class 5 involvement)\n<br/>\npick MMF + belimumab if patient has extra-renal symptoms \n<br/>\n***ACR does not state any specific scenario to prioritize Low dose CYC. Only that if you choose CYC, you use the Euro-Lupus trial dosing (ie. Low dose CYC).`;

        let modified = false;
        for (let opt of options) {
            if (opt.isCorrect === true || opt.text === "Show Answer") {
                opt.explanation = newExpl;
                modified = true;
            }
        }

        if (modified) {
            await Question.updateOne({ _id: qid }, { $set: { options: options } });
            console.log("Successfully updated question 47!");
        } else {
            console.log("No options updated");
        }
    } else {
        console.log("Question not found");
    }

    await mongoose.disconnect();
}
updateQ47();
