import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const questionText = `What would histopath of IgG4 tissue show?`;

const answerText = `<b>a dense lymphoplasmacytic infiltrate with elevated levels of IgG4 positive plasma cells and mild to moderate eosinophilia organized in a storiform fibrosis</b><br><br>-it is POLYCLONAL.....not monoclonal<br><br><img src="/collection.media/igg4_histopath.png" class="zoomable-img" onclick="this.classList.toggle('zoomed')" />`;

const category = "Radiology";
const row = questionText + "\t" + answerText + "\t" + category;

const filePath = path.join(__dirname, '..', 'updatedquestion.txt');
const existingInfo = fs.readFileSync(filePath, 'utf8').trimEnd();
const finalContent = existingInfo + '\n' + row + '\n';

fs.writeFileSync(filePath, finalContent, 'utf8');

console.log('✅ Successfully appended the IgG4 question to updatedquestion.txt');
