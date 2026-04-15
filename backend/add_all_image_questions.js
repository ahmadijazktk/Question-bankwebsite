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

const imageQuestions = [
    {
        text: 'What do you do?',
        category: 'Pregnancy',
        options: [{ text: 'Show Answer', isCorrect: true, explanation: 'For pregnant SLE patients: (1) HCQ is strongly recommended throughout pregnancy. (2) Low-dose aspirin starting before 16 weeks. (3) Monitor for flares and adjust medications.' }],
        summary: 'ACR Reproductive Health Guidelines for SLE patients during pregnancy.',
        diagram: true, difficulty: 'hard',
        image: 'q_preg_1.png', image2: 'a_preg_1.png',
        showImageWithQuestion: true, isFreeTrialQuestion: false
    },
    {
        text: 'What do you do?',
        category: 'Pregnancy',
        options: [{ text: 'Show Answer', isCorrect: true, explanation: 'For Anti-Ro/La (+) patients with no history of NLE: (1) HCQ is strongly recommended. (2) Serial fetal echo from week 16-27 is conditionally recommended. If abnormal fetal echo (1st or 2nd degree heart block), a brief course of DEXAMETHASONE is conditionally recommended. AGAINST Dexamethasone if 3rd degree block.' }],
        summary: 'ACR Reproductive Health Guidelines for Anti-Ro/La (+) patients considering pregnancy.',
        diagram: true, difficulty: 'hard',
        image: 'q_anti_ro_la_1.png', image2: 'a_anti_ro_la_1.png',
        showImageWithQuestion: true, isFreeTrialQuestion: false
    },
    {
        text: 'What do you do?',
        category: 'APS',
        options: [{ text: 'Show Answer', isCorrect: true, explanation: 'For Arterial + Obstetric APS: Treatment involves anticoagulation with warfarin (target INR 2-3) PLUS low-dose aspirin. In refractory cases, consider adding HCQ or switching to DOAC.' }],
        summary: 'ACR APS Guidelines for patients with both arterial and obstetric manifestations.',
        diagram: true, difficulty: 'hard',
        image: 'q_art_ob_aps_1.png', image2: 'a_art_ob_aps_1.png',
        showImageWithQuestion: true, isFreeTrialQuestion: false
    },
    {
        text: 'What do you do?',
        category: 'APS',
        options: [{ text: 'Show Answer', isCorrect: true, explanation: 'For Arterial Thrombotic APS: Warfarin with target INR 2-3 is conditionally recommended over DOAC or higher-intensity warfarin.' }],
        summary: 'ACR APS Guidelines for arterial thrombotic APS management.',
        diagram: true, difficulty: 'hard',
        image: 'q_art_1.png', image2: 'a_art_1.png',
        showImageWithQuestion: true, isFreeTrialQuestion: false
    },
    {
        text: 'What do you do?',
        category: 'APS',
        options: [{ text: 'Show Answer', isCorrect: true, explanation: 'For Arterial Thrombotic APS with recurrent events on warfarin INR 2-3: Consider increasing INR target to 3-4 or adding low-dose aspirin.' }],
        summary: 'ACR APS Guidelines for refractory arterial thrombotic APS.',
        diagram: true, difficulty: 'hard',
        image: 'q_art_2.png', image2: 'a_art_2.png',
        showImageWithQuestion: true, isFreeTrialQuestion: false
    },
    {
        text: 'What do you do?',
        category: 'APS',
        options: [{ text: 'Show Answer', isCorrect: true, explanation: 'For initial Arterial Thrombotic APS management: Anticoagulation with warfarin (INR 2-3) plus antiplatelet therapy.' }],
        summary: 'ACR APS Guidelines for initial arterial APS treatment.',
        diagram: true, difficulty: 'hard',
        image: 'q_art_3.png', image2: 'a_art_3.png',
        showImageWithQuestion: true, isFreeTrialQuestion: false
    },
    {
        text: 'What do you do?',
        category: 'APS',
        options: [{ text: 'Show Answer', isCorrect: true, explanation: 'For Arterial Thrombotic APS: Warfarin is preferred. STRONGLY RECOMMEND AGAINST DOACs for arterial thrombotic APS.' }],
        summary: 'ACR APS Guidelines for arterial thrombotic APS - DOAC warnings.',
        diagram: true, difficulty: 'hard',
        image: 'q_art_thrombotic_aps_1.png', image2: 'a_art_thrombotic_aps_1.png',
        showImageWithQuestion: true, isFreeTrialQuestion: false
    },
    {
        text: 'What do you do?',
        category: 'Contraception',
        options: [{ text: 'Show Answer', isCorrect: true, explanation: 'Contraception in SLE: For stable/low activity SLE without aPL: Combined hormonal contraceptives are conditionally recommended as safe. For active SLE or positive aPL: Progestin-only methods or IUD are recommended.' }],
        summary: 'ACR Guidelines on contraception for SLE patients.',
        diagram: true, difficulty: 'hard',
        image: 'q_contraception_1.png', image2: 'a_contraception_1.png',
        showImageWithQuestion: true, isFreeTrialQuestion: false
    },
    {
        text: 'What do you do?',
        category: 'Contraception',
        options: [{ text: 'Show Answer', isCorrect: true, explanation: 'Contraception choice depends on aPL status and disease activity.' }],
        summary: 'ACR Guidelines on contraception selection.',
        diagram: true, difficulty: 'hard',
        image: 'q_contraception_2.png', image2: 'a_contraception_2.png',
        showImageWithQuestion: true, isFreeTrialQuestion: false
    },
    {
        text: 'What do you do?',
        category: 'Contraception',
        options: [{ text: 'Show Answer', isCorrect: true, explanation: 'Emergency contraception options for SLE patients.' }],
        summary: 'ACR Guidelines on emergency contraception.',
        diagram: true, difficulty: 'hard',
        image: 'q_contraception_3.png', image2: 'a_contraception_3.png',
        showImageWithQuestion: true, isFreeTrialQuestion: false
    },
    {
        text: 'What do you do?',
        category: 'Contraception',
        options: [{ text: 'Show Answer', isCorrect: true, explanation: 'Contraception for aPL-positive patients without APS diagnosis.' }],
        summary: 'ACR Guidelines on contraception for aPL-positive patients.',
        diagram: true, difficulty: 'hard',
        image: 'q_contraception_4.png', image2: 'a_contraception_4.png',
        showImageWithQuestion: true, isFreeTrialQuestion: false
    },
    {
        text: 'What do you do?',
        category: 'Contraception',
        options: [{ text: 'Show Answer', isCorrect: true, explanation: 'Contraception considerations for patients with active nephritis.' }],
        summary: 'ACR Guidelines on contraception with active nephritis.',
        diagram: true, difficulty: 'hard',
        image: 'q_contraception_5.png', image2: 'a_contraception_5.png',
        showImageWithQuestion: true, isFreeTrialQuestion: false
    },
    {
        text: 'What do you do?',
        category: 'HRT',
        options: [{ text: 'Show Answer', isCorrect: true, explanation: 'HRT in RMD patients: Consider risks vs benefits. For SLE: Conditionally recommend against in aPL-positive patients.' }],
        summary: 'ACR Guidelines on hormone replacement therapy in RMD.',
        diagram: true, difficulty: 'hard',
        image: 'q_hrt_1.png', image2: 'a_hrt_1.png',
        showImageWithQuestion: true, isFreeTrialQuestion: false
    },
    {
        text: 'What do you do?',
        category: 'HRT',
        options: [{ text: 'Show Answer', isCorrect: true, explanation: 'HRT considerations for postmenopausal RMD patients.' }],
        summary: 'ACR Guidelines on HRT for postmenopausal patients.',
        diagram: true, difficulty: 'hard',
        image: 'q_hrt_2.png', image2: 'a_hrt_2.png',
        showImageWithQuestion: true, isFreeTrialQuestion: false
    },
    {
        text: 'What do you do?',
        category: 'HRT',
        options: [{ text: 'Show Answer', isCorrect: true, explanation: 'HRT and bone health in RMD patients.' }],
        summary: 'ACR Guidelines on HRT and osteoporosis in RMD.',
        diagram: true, difficulty: 'hard',
        image: 'q_hrt_3.png', image2: 'a_hrt_3.png',
        showImageWithQuestion: true, isFreeTrialQuestion: false
    },
    {
        text: 'What do you do?',
        category: 'HRT',
        options: [{ text: 'Show Answer', isCorrect: true, explanation: 'HRT safety profile in specific RMD conditions.' }],
        summary: 'ACR Guidelines on HRT safety in RMD.',
        diagram: true, difficulty: 'hard',
        image: 'q_hrt_4.png', image2: 'a_hrt_4.png',
        showImageWithQuestion: true, isFreeTrialQuestion: false
    },
    {
        text: 'What do you do?',
        category: 'APS',
        options: [{ text: 'Show Answer', isCorrect: true, explanation: 'For Obstetric APS: Low-dose aspirin + prophylactic heparin during pregnancy is conditionally recommended.' }],
        summary: 'ACR APS Guidelines for obstetric APS management.',
        diagram: true, difficulty: 'hard',
        image: 'q_ob_aps_1.png', image2: 'a_ob_aps_1.png',
        showImageWithQuestion: true, isFreeTrialQuestion: false
    },
    {
        text: 'What do you do?',
        category: 'APS',
        options: [{ text: 'Show Answer', isCorrect: true, explanation: 'For persistent aPL-positive patients WITHOUT APS: Low-dose aspirin is conditionally recommended for primary thrombosis prevention.' }],
        summary: 'ACR Guidelines for aPL-positive patients without APS diagnosis.',
        diagram: true, difficulty: 'hard',
        image: 'q_pos_apl_no_aps_1.png', image2: 'a_pos_apl_no_aps_1.png',
        showImageWithQuestion: true, isFreeTrialQuestion: false
    },
    {
        text: 'What do you do?',
        category: 'APS',
        options: [{ text: 'Show Answer', isCorrect: true, explanation: 'For Thrombotic APS: Warfarin with target INR 2-3 is the standard of care. STRONGLY RECOMMEND AGAINST using DOACs in triple-positive APS.' }],
        summary: 'ACR APS Guidelines for thrombotic APS management.',
        diagram: true, difficulty: 'hard',
        image: 'q_thrombotic_aps_1.png', image2: 'a_thrombotic_aps_1.png',
        showImageWithQuestion: true, isFreeTrialQuestion: false
    }
];

async function addAllImageQuestions() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 30000 });
        console.log('✅ Connected to MongoDB');

        let added = 0;
        let skipped = 0;

        for (const q of imageQuestions) {
            const existing = await Question.findOne({ text: q.text, image: q.image });
            if (existing) {
                console.log(`⏭️  Skipped (already exists): ${q.image}`);
                skipped++;
            } else {
                await Question.create(q);
                console.log(`✅ Added: ${q.image}`);
                added++;
            }
        }

        console.log(`\n📊 Summary: ${added} added, ${skipped} skipped`);
        const total = await Question.countDocuments();
        console.log(`📦 Total questions in database: ${total}`);
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected');
    }
}

addAllImageQuestions();
