import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const questionText = `A patient with Hip pain, and the xray shows "beaking" on lateral side of femur means what?`;

const answerText = `<b>Femoral stress fracture</b><br><br><img src="femoral_beaking.jpg" class="zoomable-img" onclick="this.classList.toggle('zoomed')" />`;

const category = "Radiology";
const row = questionText + "\t" + answerText + "\t" + category;

const filePath = path.join(__dirname, '..', 'updatedquestion.txt');
const existingInfo = fs.readFileSync(filePath, 'utf8').trimEnd();
const finalContent = existingInfo + '\n' + row + '\n';

fs.writeFileSync(filePath, finalContent, 'utf8');

console.log('✅ Successfully appended the Femoral beaking question to updatedquestion.txt');
