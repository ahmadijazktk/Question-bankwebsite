import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const questionText = `What does a muscle biopsy with HCQ toxicity look like?`;

const answerText = `<b>Cytoplasmic vacuoles (Gomori trichrome stain)<br>Curvilinear bodies and myeloid bodies (EM)</b><br><br><img src="hcq_tox_1.jpg" class="zoomable-img" onclick="this.classList.toggle('zoomed')" /><br><img src="hcq_tox_2.jpg" class="zoomable-img" onclick="this.classList.toggle('zoomed')" /><br><br><i>*they may ask a question stem involving a patient taking HCQ who develops CHF symptoms....remember HCQ cardiotoxicity would also show the above histology*</i>`;

const category = "Neurology";
const row = questionText + "\t" + answerText + "\t" + category;

const filePath = path.join(__dirname, '..', 'updatedquestion.txt');
const existingInfo = fs.readFileSync(filePath, 'utf8').trimEnd();
const finalContent = existingInfo + '\n' + row + '\n';

fs.writeFileSync(filePath, finalContent, 'utf8');

console.log('✅ Successfully appended the HCQ question to updatedquestion.txt');
