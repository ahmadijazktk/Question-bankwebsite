
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const Question = mongoose.models.Question || mongoose.model('Question', new mongoose.Schema({}, { strict: false }));

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB");

        const newQuestion = {
            text: "What do you do?",
            category: "Vaccinations",
            options: [
                {
                    text: "Show Answer",
                    isCorrect: true,
                    explanation: "For patients taking <strong>Prednisone ≤ 10 mg daily</strong>: It is <strong style='color: #000; font-weight: 600;'>STRONGLY RECOMMENDED</strong> to give both Influenza and other non-live attenuated vaccinations."
                }
            ],
            summary: "ACR 2022 Vaccination Guidelines: Managing non-live vaccinations for patients on low-dose glucocorticoids (≤10mg daily).",
            difficulty: "medium",
            diagram: true,
            image: "q_vaccine_row1.png",
            image2: "a_vaccine_row1.png",
            showImageWithQuestion: true,
            isFreeTrialQuestion: false
        };

        const existing = await Question.findOne({ image: "q_vaccine_row1.png" });
        if (existing) {
            console.log("⏭️ Question already exists.");
        } else {
            await Question.create(newQuestion);
            console.log("✅ Successfully added the new Vaccine image question.");
        }

    } catch (err) {
        console.error("❌ Error:", err);
    } finally {
        await mongoose.disconnect();
    }
}

run();
