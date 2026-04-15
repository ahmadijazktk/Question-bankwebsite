
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function updateQ40() {
    await mongoose.connect(process.env.MONGO_URI);

    // Target ID identified: 69a363b1e212ad97bfa96f48
    const qid = '69a363b1e212ad97bfa96f48';
    const q = await Question.findById(qid);

    if (q && q.options && q.options.length > 0) {
        let options = q.options;
        // In this case, there's only one option with explanation or the first one is the "Show Answer" one.
        // Let's find the correct one or update all if it's a "Show Answer" type.
        let modified = false;

        for (let opt of options) {
            // Check if it's the one we want to update (usually isCorrect: true)
            if (opt.isCorrect === true || opt.text === 'Show Answer') {
                opt.explanation = `Choice of 3rd drug (ie. belimumab or CNI) based on extra-renal symtoms (choose belimumab) vs. proteinuria (choose CNI such as voclosporin). \n<br/>\n*Could also consider switching MMF to low dose CYC (ELNT) plus belimumab \n<br/>\n"In people with ACTIVE/NEW ONSET/FLARE of Class III/IV (with or without Class V) lupus nephritis who have undergone DUAL immunosuppressive therapy (glucocorticoids plus either CYC or MPAA) and achieved a partial renal response , we <strong>CONDITIONALLY RECOMMEND</strong> escalating therapy to a TRIPLE immunosuppressive regimen .”`;
                modified = true;
            }
        }

        if (modified) {
            await Question.updateOne({ _id: qid }, { $set: { options: options } });
            console.log("Successfully updated question 40!");
        } else {
            console.log("No options modified");
        }
    } else {
        console.log("Question not found or missing options");
    }

    await mongoose.disconnect();
}
updateQ40();
