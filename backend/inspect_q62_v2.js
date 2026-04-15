
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function inspectQ62() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        process.stdout.write("Connected to DB\n");
        const q = await Question.findById('69a363aee212ad97bfa96f06');
        if (q) {
            process.stdout.write("ID: " + q._id + "\n");
            process.stdout.write("Text: " + q.text + "\n");
            q.options.forEach((o, i) => {
                process.stdout.write("\nOpt " + i + " Text: " + o.text + "\n");
                process.stdout.write("Opt " + i + " Expl: " + o.explanation + "\n");
            });
        } else {
            process.stdout.write("Not found\n");
        }
    } catch (e) {
        process.stdout.write("Error: " + e.toString() + "\n");
    } finally {
        await mongoose.disconnect();
    }
}
inspectQ62();
