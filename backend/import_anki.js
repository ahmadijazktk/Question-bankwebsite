
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

// Schema based on existing Question model
const optionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    explanation: { type: String, default: '' },
    isCorrect: { type: Boolean, required: true }
}, { _id: false });

const questionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    category: { type: String, required: true },
    options: [optionSchema],
    tags: [String],
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Question = mongoose.models.Question || mongoose.model('Question', questionSchema);

async function importAnki() {
    try {
        console.log("🚀 Starting Anki Import...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB.");

        const filePath = path.join(__dirname, '..', 'updatedquestion.txt');
        if (!fs.existsSync(filePath)) {
            console.error(`❌ File not found: ${filePath}`);
            process.exit(1);
        }

        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');

        let importedCount = 0;
        const questionsBatch = [];

        for (let line of lines) {
            line = line.trim();
            if (!line || line.startsWith('#')) continue;

            const parts = line.split('\t').filter(p => p.trim().length > 0);
            if (parts.length < 2) continue;

            const rawQuestion = parts[0];
            const rawAnswer = parts[1];
            const rawTags = parts[2] || 'AnkiImport';

            // Image Source Handling
            const processHtml = (html) => {
                if (!html) return '';
                // Replace <img src="filename.ext"> with <img src="/images/filename.ext">
                // Assuming collection.media contents are now in public/images/
                return html.replace(/<img\s+[^>]*src="([^"]+)"[^>]*>/gi, (match, src) => {
                    // If it already has a path, leave it, else prepend /images/
                    if (src.includes('/') || src.startsWith('http')) return match;
                    return match.replace(src, `/images/${src}`);
                });
            };

            const questionText = processHtml(rawQuestion);
            const answerText = processHtml(rawAnswer);
            const tagArray = rawTags.split(' ').map(t => t.trim()).filter(t => t);
            const primaryCategory = tagArray[0] || 'Uncategorized';

            questionsBatch.push({
                text: questionText,
                category: primaryCategory,
                options: [{
                    text: answerText,
                    isCorrect: true,
                    explanation: ''
                }],
                tags: tagArray,
                createdAt: new Date()
            });

            importedCount++;
        }

        if (questionsBatch.length > 0) {
            console.log(`📥 Inserting ${questionsBatch.length} questions...`);
            await Question.insertMany(questionsBatch);
        }

        console.log(`✅ Successfully imported ${importedCount} questions.`);
        await mongoose.disconnect();
    } catch (err) {
        console.error("❌ Import failed:", err);
    }
}

importAnki();
