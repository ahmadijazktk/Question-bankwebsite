
import mongoose from 'mongoose';

async function addLocal() {
    try {
        await mongoose.connect('mongodb://localhost:27017/studybloom');
        console.log("Connected to LOCAL DB.");

        const Question = mongoose.model('Question', new mongoose.Schema({}, { strict: false }));

        const questionText = `-Young female with inflammatory infiltrate of SubQ adipose tissue that comes and goes<br>-Bx shows inflammation in adipose tissue, both in septal and lobular pattern, mononuclear cell infiltrate with multiple fat laden macrophages without any vasculitis.`;

        const answerText = `Weber Christian disease (WCD)<br>-aka Relapsing Febrile Nodular Panniculitis<br>-remember that erythema nodosum does not have inflammation in lobule, but rather only septa`;

        const newQuestion = new Question({
            text: questionText,
            category: "Dermatopathology",
            options: [{
                text: "Show Answer",
                explanation: answerText,
                isCorrect: true
            }],
            tags: ["Pathology", "WCD"],
            isFreeTrialQuestion: true
        });

        await newQuestion.save();
        console.log("✅ Question added to LOCAL successfully!");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
addLocal();
