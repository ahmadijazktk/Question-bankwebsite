import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const questionText = `What do "gout crystals" look like?<br>What do "pseudogout crystals" look like?`;

const answerText = `<img src="gout_vs_pseudogout.png" class="zoomable-img" onclick="this.classList.toggle('zoomed')" />`;

const category = "Rheumatology";
const row = questionText + "\t" + answerText + "\t" + category;

const filePath = path.join(__dirname, '..', 'updatedquestion.txt');
const existingInfo = fs.readFileSync(filePath, 'utf8').trimEnd();
const finalContent = existingInfo + '\n' + row + '\n';

fs.writeFileSync(filePath, finalContent, 'utf8');

console.log('✅ Successfully appended the Gout vs Pseudogout comparison question to updatedquestion.txt');
