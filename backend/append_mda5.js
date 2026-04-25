import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const questionText = `A patient shows you these hands below. She has trouble breathing and intermitent mild weakness in her thighs. <br>What is this? (Be specific)<br><br><img src="mda5_hands.jpg" class="zoomable-img" onclick="this.classList.toggle('zoomed')" />`;

const answerText = `<b>Anti-MDA5 dermatomyositis</b><br><br>-associated with ulcerated Gottron's papules and rapidily progressive ILD (RP-ILD).<br>-considered to be a type of amyopathic (hypomyopathic) myositis....hence the mild weakness in thighs.`;

const category = "Rheumatology";
const row = questionText + "\t" + answerText + "\t" + category;

const filePath = path.join(__dirname, '..', 'updatedquestion.txt');
const existingInfo = fs.readFileSync(filePath, 'utf8').trimEnd();
const finalContent = existingInfo + '\n' + row + '\n';

fs.writeFileSync(filePath, finalContent, 'utf8');

console.log('✅ Successfully appended the Anti-MDA5 question to updatedquestion.txt');
