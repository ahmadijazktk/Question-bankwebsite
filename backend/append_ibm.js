import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const questionText = `What does a biopsy of s-IBM show?`;

const answerText = `<b>Triad of inflammation, invasion of CD8+ lymphocytes of muscle fibers (with MHC I), cytoplasmic and intranuclear inclusions containing amyloid beta and other Alzheimer-type proteins, and segmental loss of cytochrome C oxidase activity in muscle fibers.</b><br><br>-can present with facial muscle involvement. CKs normal or mildly elevated<br>-***weakness of finger flexion and knee extension***<br><br><img src="ibm_pathology.jpg" class="zoomable-img" onclick="this.classList.toggle('zoomed')" />`;

const category = "Neurology";
const row = questionText + "\t" + answerText + "\t" + category;

const filePath = path.join(__dirname, '..', 'updatedquestion.txt');
const existingInfo = fs.readFileSync(filePath, 'utf8').trimEnd();
const finalContent = existingInfo + '\n' + row + '\n';

fs.writeFileSync(filePath, finalContent, 'utf8');

console.log('✅ Successfully appended the s-IBM question to updatedquestion.txt');
