import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '..', 'updatedquestion.txt');
let content = fs.readFileSync(filePath, 'utf8');

const targetPhrases = [
    "conditionally recommend",
    "CONDITIONALLY REC'D",
    "WEAK Rec'd",
    "STRONG REC'D",
    "STRONGLY REC'D",
    "Strong Recommendation"
];

// Special regex to match the phrases case-insensitively, handling surrounding bold tags potentially
const lines = content.split('\n');
const processedLines = lines.map(line => {
    if (line.startsWith('#') || !line.trim()) return line;

    const columns = line.split('\t');
    if (columns.length < 2) return line;

    let answer = columns[1];

    targetPhrases.forEach(phrase => {
        // Create a regex that finds the phrase, potentially inside <b> tags
        // We want to replace it with <b>PHRASE_UPPERCASE</b>
        // We look for the phrase itself case-insensitively
        const escapedPhrase = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // First, strip existing <b> tags if they surround the phrase exactly to prevent <b><b>
        const stripRegex = new RegExp(`<b>(${escapedPhrase})</b>`, 'gi');
        answer = answer.replace(stripRegex, '$1');

        // Now wrap with <b> and uppercase
        const regex = new RegExp(`(${escapedPhrase})`, 'gi');
        answer = answer.replace(regex, (match) => `<b>${match.toUpperCase()}</b>`);
    });

    columns[1] = answer;
    return columns.join('\t');
});

fs.writeFileSync(filePath, processedLines.join('\n'), 'utf8');

console.log('✅ Successfully reformatted recommendation phrases in all answers.');
