import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

// Import the Question model
import Question from './src/models/Question.js';

// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/studybloom', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

// Seed questions from JSON file
const seedQuestions = async () => {
    try {
        console.log('🔄 Starting to seed RheumZoom questions...\n');

        // Read the JSON file
        const jsonPath = path.join(__dirname, '../../../rheumzoom_mongodb_format.json');
        const questionsData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

        console.log(`📖 Found ${questionsData.length} questions to import\n`);

        // Optional: Clear existing questions (comment out if you want to keep existing data)
        const deleteResult = await Question.deleteMany({});
        console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing questions\n`);

        // Insert questions
        let successCount = 0;
        let errorCount = 0;
        const errors = [];

        for (let i = 0; i < questionsData.length; i++) {
            try {
                const question = questionsData[i];

                // Validate that the question has at least one correct answer
                const hasCorrectAnswer = question.options.some(opt => opt.isCorrect === true);
                if (!hasCorrectAnswer) {
                    throw new Error('No correct answer found in options');
                }

                // Create and save the question
                await Question.create(question);
                successCount++;

                // Progress indicator
                if ((i + 1) % 50 === 0) {
                    console.log(`   Processed ${i + 1}/${questionsData.length} questions...`);
                }
            } catch (error) {
                errorCount++;
                errors.push({
                    questionNumber: i + 1,
                    questionText: questionsData[i].text.substring(0, 50) + '...',
                    error: error.message
                });
            }
        }

        console.log('\n📊 Import Summary:');
        console.log(`   ✅ Successfully imported: ${successCount} questions`);
        console.log(`   ❌ Failed to import: ${errorCount} questions`);

        if (errors.length > 0 && errors.length <= 10) {
            console.log('\n⚠️  Errors encountered:');
            errors.forEach(err => {
                console.log(`   Question ${err.questionNumber}: ${err.questionText}`);
                console.log(`   Error: ${err.error}\n`);
            });
        } else if (errors.length > 10) {
            console.log(`\n⚠️  Too many errors to display (${errors.length} total)`);
            console.log('   First 5 errors:');
            errors.slice(0, 5).forEach(err => {
                console.log(`   Question ${err.questionNumber}: ${err.error}`);
            });
        }

        // Get statistics
        const stats = await Question.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            }
        ]);

        console.log('\n📈 Questions by Category:');
        stats.forEach(stat => {
            console.log(`   ${stat._id}: ${stat.count}`);
        });

        const difficultyStats = await Question.aggregate([
            {
                $group: {
                    _id: '$difficulty',
                    count: { $sum: 1 }
                }
            }
        ]);

        console.log('\n📊 Questions by Difficulty:');
        difficultyStats.forEach(stat => {
            console.log(`   ${stat._id}: ${stat.count}`);
        });

        console.log('\n✨ Seeding completed successfully!');
        console.log('🎓 Your study app is now ready with RheumZoom flashcards!\n');

    } catch (error) {
        console.error('❌ Error seeding questions:', error);
        throw error;
    }
};

// Main execution
const main = async () => {
    try {
        await connectDB();
        await seedQuestions();
        await mongoose.connection.close();
        console.log('👋 Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Fatal error:', error);
        process.exit(1);
    }
};

// Run the script
main();
