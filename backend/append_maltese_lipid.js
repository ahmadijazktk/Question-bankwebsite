import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const questionText = `What is this?<br><br><img src="maltese_cross_lipid.jpg" class="zoomable-img" onclick="this.classList.toggle('zoomed')" />`;

const answerText = `-Lipid crystals<br>-Maltese cross`;

const category = "Pathology";
const row = questionText + "\t" + answerText + "\t" + category;

const filePath = path.join(__dirname, '..', 'updatedquestion.txt');
const existingInfo = fs.readFileSync(filePath, 'utf8').trimEnd();
const finalContent = existingInfo + '\n' + row + '\n';

fs.writeFileSync(filePath, finalContent, 'utf8');

console.log('✅ Successfully appended the Maltese Cross lipid question to updatedquestion.txt');
