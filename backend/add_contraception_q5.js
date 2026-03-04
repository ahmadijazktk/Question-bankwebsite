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
        const existing = await Question.findOne({ text: 'What do you do?', image: 'q_contraception_5.png' });
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
                    explanation: 'In women with SLE and Mod-High disease activity: (1) IUDs, progestin implant, DMPA, or progestin-only pill are strongly recommended OVER combined estrogen-progestin contraceptives. (2) AVOID estrogen patch (conditionally recommended against).'
                }
            ],
            summary: 'ACR Reproductive Health Guidelines for SLE with moderate to high disease activity: Highly effective, non-estrogen options like LARCs/DMPA/progestin-only pills are strongly preferred over combined oral contraceptives. Estrogen patches are conditionally recommended against.',
            diagram: true,
            difficulty: 'hard',
            image: 'q_contraception_5.png',
            image2: 'a_contraception_5.png',
            showImageWithQuestion: true,
            isFreeTrialQuestion: false
        });

        console.log('✅ Question 9 added successfully!');
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
