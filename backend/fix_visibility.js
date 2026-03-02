import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

import Question from './src/models/Question.js';

async function updateQuestions() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const result = await Question.updateMany(
            { text: 'What do you do?', image2: { $exists: true, $ne: null } },
            { $set: { showImageWithQuestion: true } }
        );

        console.log(`Updated ${result.modifiedCount} questions to be visible immediately.`);
        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

updateQuestions();
