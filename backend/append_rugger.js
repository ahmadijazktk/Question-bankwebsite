import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const questionText = `What is shown here?<br><br><img src="rugger_spine_q.jpg" class="zoomable-img" onclick="this.classList.toggle('zoomed')" />`;

const answerText = `<b>Rugger Jersey Spine, from Hyperparathyroidism</b><br><br><img src="rugger_spine_a.jpg" class="zoomable-img" onclick="this.classList.toggle('zoomed')" />`;

const category = "Radiology";
const row = questionText + "\t" + answerText + "\t" + category;

const filePath = path.join(__dirname, '..', 'updatedquestion.txt');
const existingInfo = fs.readFileSync(filePath, 'utf8').trimEnd();
const finalContent = existingInfo + '\n' + row + '\n';

fs.writeFileSync(filePath, finalContent, 'utf8');

console.log('✅ Successfully appended the Rugger Jersey Spine visual question to updatedquestion.txt');
