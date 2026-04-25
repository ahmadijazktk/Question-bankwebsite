import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const questionText = `Describe what you see in each of the 4 histology images (Hint: skin)?<br><br><img src="cutaneous_lupus_histology.jpg" class="zoomable-img" onclick="this.classList.toggle('zoomed')" />`;

const answerText = `***<b>Top left:</b> vacuolar changes at basal layer (the white circles)<br><b>Top right:</b> blue is mucin deposition<br><b>Bottom left:</b> basement membrane thickening with lymphocytic infiltrate<br><b>Bottom right:</b> lymphocytes around adnexal structures (sweat glands)<br>***all these typical of <b>Cutaneous lupus</b>*****`;

const category = "Pathology";
const row = questionText + "\t" + answerText + "\t" + category;

const filePath = path.join(__dirname, '..', 'updatedquestion.txt');
const existingInfo = fs.readFileSync(filePath, 'utf8').trimEnd();
const finalContent = existingInfo + '\n' + row + '\n';

fs.writeFileSync(filePath, finalContent, 'utf8');

console.log('✅ Successfully appended the Cutaneous Lupus histology question (image in question) to updatedquestion.txt');
