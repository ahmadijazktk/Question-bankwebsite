import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.join(__dirname, '../../../rheumzoom_mongodb_format.json');
const questionsData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

console.log(`Processing ${questionsData.length} questions...`);

let modifiedCount = 0;

questionsData.forEach(q => {
    q.options.forEach(opt => {
        let original = opt.explanation;

        // Bold specific phrases
        const phrasesToBold = [
            "CONDITIONALLY recommend",
            "CONDITIONALLY recommended",
            "STRONGLY recommend",
            "STRONGLY recommended",
            "Strongly recommend AGAINST",
            "STRONGLY RECOMMEND AGAINST",
            "STRONGLY RECOMMENDED",
            "WEAK Rec'd",
            "STRONG REC'D",
            "STRONGLY REC'D"
        ];

        phrasesToBold.forEach(phrase => {
            // Case insensitive match but replace with bolded version
            const regex = new RegExp(phrase, 'gi');
            opt.explanation = opt.explanation.replace(regex, `**${phrase.toUpperCase()}**`);
        });

        if (original !== opt.explanation) {
            modifiedCount++;
        }
    });
});

fs.writeFileSync(jsonPath, JSON.stringify(questionsData, null, 4));
console.log(`✅ Successfully formatted ${modifiedCount} questions in JSON file.`);
