import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const questionText = `What are the xray findings of Hyperparathyroidism?`;

const answerText = `<b>Osteitis fibrosa cystica</b><br><br>-can cause bone pain<br>-subperisosteal bone resorption on RADIAL aspect of middle phalanges, tapering of distal clavicles, a "salt and pepper" appearance of the skull, bone cysts, and.....BROWN TUMORS of long bones<br><br><img src="hpt_skull.jpg" class="zoomable-img" onclick="this.classList.toggle('zoomed')" /><br><br><img src="hpt_phalanges.jpg" class="zoomable-img" onclick="this.classList.toggle('zoomed')" />`;

const category = "Radiology";
const row = questionText + "\t" + answerText + "\t" + category;

const filePath = path.join(__dirname, '..', 'updatedquestion.txt');
const existingInfo = fs.readFileSync(filePath, 'utf8').trimEnd();
const finalContent = existingInfo + '\n' + row + '\n';

fs.writeFileSync(filePath, finalContent, 'utf8');

console.log('✅ Successfully appended the Hyperparathyroidism question to updatedquestion.txt');
