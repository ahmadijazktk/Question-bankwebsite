import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const questionText = `What is shown here?<br><br><img src="alkaptonuria_spine.png" class="zoomable-img" onclick="this.classList.toggle('zoomed')" />`;

const answerText = `<b>Onchronosis/alkaptonuria, in the spine</b><br><br>*Normal spine will NOT have white opacification in the intervertebral spaces.`;

const category = "Radiology";
const row = questionText + "\t" + answerText + "\t" + category;

const filePath = path.join(__dirname, '..', 'updatedquestion.txt');
const existingInfo = fs.readFileSync(filePath, 'utf8').trimEnd();
const finalContent = existingInfo + '\n' + row + '\n';

fs.writeFileSync(filePath, finalContent, 'utf8');

console.log('✅ Successfully appended the Alkaptonuria question (image in question) to updatedquestion.txt');
