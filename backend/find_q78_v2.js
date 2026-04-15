
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', QuestionSchema);

async function checkPreg() {
    await mongoose.connect(process.env.MONGO_URI);

    // Check Pregnancy category
    const pregCount = await Question.countDocuments({ category: 'Pregnancy' });
    console.log(`Pregnancy category count: ${pregCount}`);

    const qs = await Question.find({ category: 'Pregnancy' }).sort({ createdAt: 1 });
    if (qs.length >= 78) {
        const q78 = qs[77];
        console.log("=== Question 78 in Pregnancy category ===");
        console.log(`ID: ${q78._id}`);
        console.log(`Text: ${q78.text.substring(0, 100)}`);
        console.log(`Image: ${q78.image}`);
    }

    // Check Free Trial 
    const freeCount = await Question.countDocuments({ category: 'Free Trial' });
    console.log(`Free Trial category count: ${freeCount}`);

    // Check the questions that have images recently
    const recentWithImages = await Question.find({ image: { $ne: null } }).sort({ createdAt: -1 }).limit(10);
    console.log("\nRecent questions with images:");
    recentWithImages.forEach(q => console.log(`ID: ${q._id} | Text: ${q.text.substring(0, 50)} | Image: ${q.image}`));

    await mongoose.disconnect();
}
checkPreg();
