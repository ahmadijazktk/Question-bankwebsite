import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const questionText = `How does hyperparathyroidism xray of hands differ from thyroid acropachy?`;

const answerText = `-HyperPTH causes subperiosteal bone resorption, commonly affecting the RADIAL side of proximal/middle phalanges of the 2nd and 3rd<br>-thyroid acropachy has advanced periostitis.<br><br><img src="hyper_pth_vs_acropachy1.jpg" class="zoomable-img" onclick="this.classList.toggle('zoomed')" /><br><br>Thyroid acropachy below:<br><img src="hyper_pth_vs_acropachy2.png" class="zoomable-img" onclick="this.classList.toggle('zoomed')" /><br>Note fluffy asymmetric periostitis and soft tissue swelling of the 2nd and 3rd fingers, and thumb`;

const category = "Radiology";
const row = questionText + "\t" + answerText + "\t" + category;

const filePath = path.join(__dirname, '..', 'updatedquestion.txt');
const existingInfo = fs.readFileSync(filePath, 'utf8').trimEnd();
const finalContent = existingInfo + '\n' + row + '\n';

fs.writeFileSync(filePath, finalContent, 'utf8');

console.log('✅ Successfully appended the acropachy question to updatedquestion.txt');
