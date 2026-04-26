
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

// Define Schema EXACTLY as in src/models/Question.js
const optionSchema = new mongoose.Schema({
    text: String,
    explanation: String,
    isCorrect: Boolean
}, { _id: false });

const questionSchema = new mongoose.Schema({
    text: String,
    category: String,
    options: [optionSchema],
    difficulty: { type: String, default: 'medium' },
    image: String,
    image2: String,
    isFreeTrialQuestion: { type: Boolean, default: false },
    showImageWithQuestion: { type: Boolean, default: false }
}, { timestamps: true });

const Question = mongoose.models.Question || mongoose.model('Question', questionSchema);

async function addQuestion() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB");

        const newQuestion = {
            text: "What do lipid crystals look like on light microscopy?",
            category: "clinical", // Defaulting to clinical as per existing bank patterns
            options: [
                {
                    text: "Maltese cross",
                    explanation: "Maltese cross - look for history of fracture",
                    isCorrect: true
                },
                {
                    text: "Rhomboid shape",
                    explanation: "Incorrect. Rhomboid shapes are characteristic of CPPD.",
                    isCorrect: false
                }
            ],
            image: "lipid_crystals.jpg", // Using the existing image in /public/
            difficulty: "medium",
            isFreeTrialQuestion: false,
            showImageWithQuestion: true // Usually image questions show the image with the question
        };

        const created = await Question.create(newQuestion);
        console.log("🚀 Question added successfully!");
        console.log("ID:", created._id);

    } catch (err) {
        console.error("❌ Error adding question:", err);
    } finally {
        await mongoose.disconnect();
        console.log("👋 Disconnected.");
    }
}

addQuestion();
