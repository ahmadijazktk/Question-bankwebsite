import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.join(__dirname, 'rheumzoom_mongodb_format.json');
const questionsData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

const seen = new Set();
const duplicates = [];
const unique = [];

questionsData.forEach(q => {
    const key = q.text.trim().substring(0, 100).toLowerCase();
    if (seen.has(key)) {
        duplicates.push(q.text.substring(0, 50));
    } else {
        seen.add(key);
        unique.push(q);
    }
});

console.log(`Found ${duplicates.length} duplicate questions in JSON.`);
if (duplicates.length > 0) {
    fs.writeFileSync(jsonPath, JSON.stringify(unique, null, 4));
    console.log(`✅ Removed duplicates. New count: ${unique.length}`);
}
