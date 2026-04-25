import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '..', 'updatedquestion.txt');
let content = fs.readFileSync(filePath, 'utf8');

// Filter out lines that are just whitespace OR extremely long lines with mostly spaces
let lines = content.split('\n');
console.log('Original line count: ' + lines.length);

let cleanedLines = lines.map(line => {
    // Remove the weird padding if it exists
    return line.replace(/\s{50,}/g, ' ').trim();
}).filter(line => line.length > 0);

console.log('Cleaned line count: ' + cleanedLines.length);

// Let's also check for specific questions and ensure they are formatted correctly
// Plica Syndrome, Too many toes, PRES lesions
const targetedQuestions = [];
const others = [];

for (let line of cleanedLines) {
    if (line.includes('Plica Syndrome') || line.includes('too many toes') || line.includes('PRES lesions') || line.includes('Leonine facies') || line.includes('igg4_histopath')) {
        targetedQuestions.push(line);
    } else {
        others.push(line);
    }
}

console.log('Targeted questions found: ' + targetedQuestions.length);

// Rewrite the file with headers and then all questions
const headers = [
    '#separator:tab',
    '#html:true',
    '#tags column:12'
];

const finalQuestions = [...others.filter(l => !l.startsWith('#')), ...targetedQuestions];
const finalContent = headers.join('\n') + '\n' + finalQuestions.join('\n') + '\n';

fs.writeFileSync(filePath, finalContent, 'utf8');
console.log('✅ File cleaned and rewritten.');
