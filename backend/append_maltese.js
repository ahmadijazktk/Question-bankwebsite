import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const questionText = `What do lipid crystals look like on light microscopy?`;

const answerText = `<b>Maltese cross</b><br><br>-look for history of fracture<br><br><img src="maltese_cross_1.jpg" class="zoomable-img" onclick="this.classList.toggle('zoomed')" /><br><br><img src="maltese_cross_2.png" class="zoomable-img" onclick="this.classList.toggle('zoomed')" />`;

const category = "Radiology";
const row = questionText + "\t" + answerText + "\t" + category;

const filePath = path.join(__dirname, '..', 'updatedquestion.txt');
const existingInfo = fs.readFileSync(filePath, 'utf8').trimEnd();
const finalContent = existingInfo + '\n' + row + '\n';

fs.writeFileSync(filePath, finalContent, 'utf8');

console.log('✅ Successfully appended the Maltese cross question to updatedquestion.txt');
