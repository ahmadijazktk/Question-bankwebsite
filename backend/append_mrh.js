import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const questionText = `What is this?<br><br><img src="mrh_hands.jpg" class="zoomable-img" onclick="this.classList.toggle('zoomed')" />`;

const answerText = `<b>Multicentric reticulohistiocytosis (MRH)</b><br><br>*look for a destructive arthritis that will affect the MCPs, PIPs, and DIPs. Can be seronegative. An important clue will be the periungal papules described in the question stem.`;

const category = "Radiology";
const row = questionText + "\t" + answerText + "\t" + category;

const filePath = path.join(__dirname, '..', 'updatedquestion.txt');
const existingInfo = fs.readFileSync(filePath, 'utf8').trimEnd();
const finalContent = existingInfo + '\n' + row + '\n';

fs.writeFileSync(filePath, finalContent, 'utf8');

console.log('✅ Successfully appended the MRH hands question to updatedquestion.txt');
