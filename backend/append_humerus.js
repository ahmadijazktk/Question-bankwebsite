import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const questionText = `What does a "high riding humeral head" on shoulder xray typically mean?`;

const answerText = `<b>Rotator cuff tear</b><br><br>-more likely with a large supraspinatus tear<br><br><img src="high_riding_humerus.png" class="zoomable-img" onclick="this.classList.toggle('zoomed')" />`;

const category = "Radiology";
const row = questionText + "\t" + answerText + "\t" + category;

const filePath = path.join(__dirname, '..', 'updatedquestion.txt');
const existingInfo = fs.readFileSync(filePath, 'utf8').trimEnd();
const finalContent = existingInfo + '\n' + row + '\n';

fs.writeFileSync(filePath, finalContent, 'utf8');

console.log('✅ Successfully appended the High riding humeral head question to updatedquestion.txt');
