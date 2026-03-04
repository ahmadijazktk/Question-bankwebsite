import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

const MONGO_URI = process.env.MONGO_URI;

const optionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    explanation: { type: String, required: false, default: '' },
    isCorrect: { type: Boolean, required: true }
}, { _id: false });

const questionSchema = new mongoose.Schema({
    text: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    options: { type: [optionSchema], required: true },
    summary: { type: String, trim: true },
    diagram: { type: Boolean, default: false },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    image: { type: String, trim: true },
    image2: { type: String, trim: true },
    isFreeTrialQuestion: { type: Boolean, default: false },
    freeTrialOrder: { type: Number },
    showImageWithQuestion: { type: Boolean, default: false }
}, { timestamps: true });

const Question = mongoose.model('Question', questionSchema);

async function addQuestion() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Check for duplicate
        const existing = await Question.findOne({ text: 'What do you do?', image: 'q_preg_plan_1.png' });
        if (existing) {
            console.log('⚠️  Question already exists with ID:', existing._id);
            await mongoose.disconnect();
            return;
        }

        const newQuestion = await Question.create({
            text: 'What do you do?',
            category: 'Pregnancy',
            options: [
                {
                    text: 'Show Answer',
                    isCorrect: true,
                    explanation: 'In RMD patients considering pregnancy who have HIGH disease activity, the strong recommendation is to TREAT to control disease & REASSESS when low disease activity before attempting pregnancy.'
                }
            ],
            summary: 'ACR Reproductive Health Guidelines for Pregnancy Planning: In patients with high disease activity, pregnancy should be delayed. The primary goal is to control the disease first, then reassess when disease activity is low.',
            diagram: true,
            difficulty: 'medium',
            image: 'q_preg_plan_1.png',
            image2: 'a_preg_plan_1.png',
            showImageWithQuestion: true,
            isFreeTrialQuestion: false
        });

        console.log('✅ Question 10 added successfully!');
        console.log('   ID      :', newQuestion._id);
        console.log('   Text    :', newQuestion.text);
        console.log('   Image Q :', newQuestion.image);
        console.log('   Image A :', newQuestion.image2);
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}

addQuestion();
