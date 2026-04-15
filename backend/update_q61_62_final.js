
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function updateQ61_62() {
    await mongoose.connect(process.env.MONGO_URI);

    // Q61 Update
    const q61_id = '69a362f2e212ad97bfa96ab0';
    const q61 = await Question.findById(q61_id);
    if (q61) {
        let modified = false;
        q61.options.forEach(o => {
            if (o.explanation) {
                const oldText = "Strongly recommend AGAINST.";
                if (o.explanation.includes(oldText)) {
                    o.explanation = o.explanation.replace(oldText, "STRONGLY RECOMMEND AGAINST.");
                    modified = true;
                }
                // Check if it's already in tags
                if (o.explanation.includes("<strong>STRONGLY RECOMMEND</strong> AGAINST.")) {
                    o.explanation = o.explanation.replace("<strong>STRONGLY RECOMMEND</strong> AGAINST.", "<strong>STRONGLY RECOMMEND AGAINST</strong>.");
                    modified = true;
                }
            }
        });
        if (modified) {
            await Question.updateOne({ _id: q61_id }, { $set: { options: q61.options } });
            console.log("Updated Q61");
        }
    }

    // Q62 Update
    const q62_id = '69a363afe212ad97bfa96f1c';
    const q62 = await Question.findById(q62_id);
    if (q62) {
        let modified = false;
        q62.options.forEach(o => {
            if (o.text && o.text.includes("STRONGLY REC'D AGAINST")) {
                o.text = o.text.replace("STRONGLY REC'D AGAINST", "STRONGLY RECOMMEND AGAINST");
                modified = true;
            }
        });
        if (modified) {
            await Question.updateOne({ _id: q62_id }, { $set: { options: q62.options } });
            console.log("Updated Q62");
        }
    }

    await mongoose.disconnect();
}
updateQ61_62();
