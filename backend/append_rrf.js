import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const questionText = `IV pulse methylprednisolone<br>Rituximab<br>Cyclophosphamide<br>IVIG<br>MMF<br>CNI<br>JAKi<br><br>"For people with SARD and RP-ILD, we conditionally recommend pulse intravenous methylprednisolone as a first-line RP-ILD treatment."<br><br>"For people with SARD and RP-ILD, we conditionally recommend rituximab, cyclophosphamide, IVIG, mycophenolate, CNI, and JAK inhibitors as first-line RP-ILD treatment options."<br><br>Think of MDA5-associated RP-ILD`;

const answerText = `"Ragged red fibers" on Gomori trichrome stain<br><br><img src="ragged_red_fibers.jpg" class="zoomable-img" onclick="this.classList.toggle('zoomed')" />`;

const category = "Rheumatology";
const row = questionText + "\t" + answerText + "\t" + category;

const filePath = path.join(__dirname, '..', 'updatedquestion.txt');
const existingInfo = fs.readFileSync(filePath, 'utf8').trimEnd();
const finalContent = existingInfo + '\n' + row + '\n';

fs.writeFileSync(filePath, finalContent, 'utf8');

console.log('✅ Successfully appended the RP-ILD / Ragged red fibers question to updatedquestion.txt');
