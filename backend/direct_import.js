import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI).then(async () => {
    console.log('✅ Connected to MongoDB');

    // Wipe first
    const db = mongoose.connection.db;
    await db.collection('questions').deleteMany({});
    console.log('🗑️  Wiped existing questions');

    // Read local updatedquestion.txt
    const filePath = path.join(__dirname, '..', 'updatedquestion.txt');
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    const questions = [];
    for (const line of lines) {
        if (!line.trim() || line.startsWith('#')) continue;

        const parts = line.split('\t');
        const text = (parts[0] || '').trim();
        const answer = (parts[1] || '').trim();
        const tagsRaw = (parts[2] || '').trim();
        const image = (parts[3] || '').trim();
        const image2 = (parts[4] || '').trim();

        if (!text || !answer) continue;

        const tags = (tagsRaw || 'Uncategorized').split(' ').filter(t => t.trim());

        // Use the entire space-separated tags string as 'category' so the UI can split and map to multiple categories
        const fullTagsStr = tags.join(' ');

        questions.push({
            text,
            options: [{
                text: answer,
                isCorrect: true,
                explanation: answer
            }],
            category: fullTagsStr,
            tags: tags,
            image: image || undefined,
            image2: image2 || undefined,
            difficulty: 'medium',
            isFreeTrialQuestion: false
        });
    }

    if (questions.length > 0) {
        await db.collection('questions').insertMany(questions);
        console.log(`🚀 Successfully imported ${questions.length} questions directly to MongoDB!`);
    } else {
        console.log('⚠️  No questions found to import.');
    }

    process.exit(0);
}).catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
});
