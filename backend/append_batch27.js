import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const questions = [
    {
        q: `What is shown here?<br><br><img src="lupus_pernio.jpg" class="zoomable-img" onclick="this.classList.toggle('zoomed')" />`,
        a: `<b>Lupus pernio</b><br><br>-this is cutaneous sarcoidosis<br>-unrelated to SLE or other cutaneous lupus syndromes<br>-violaceous, indurated lesions of face, cheeks, and nose<br>TX: steroids, colchicine, dapsone`,
        c: `Rheumatology`
    },
    {
        q: `A 2-year-old female is admitted for a new stroke (this is her 2nd stroke). She has history of polyarthritis and rash, pictured below. What is this?<br><br><img src="dada2_rash.jpg" class="zoomable-img" onclick="this.classList.toggle('zoomed')" />`,
        a: `<b>DADA2 (Deficiency of Adenosine DeAminase 2)</b><br><br>-pediatric patient with recurrent strokes, vasculitis-like rash (livedo reticularis).<br>TX: TNFi`,
        c: `Rheumatology`
    },
    {
        q: `What would muscle histopathology show in a patient with IBM?`,
        a: `<img src="ibm_histology_ans.jpg" class="zoomable-img" onclick="this.classList.toggle('zoomed')" />`,
        c: `Pathology`
    }
];

const filePath = path.join(__dirname, '..', 'updatedquestion.txt');
const existingInfo = fs.readFileSync(filePath, 'utf8').trimEnd();

const newRows = questions.map(q => q.q + "\t" + q.a + "\t" + q.c).join('\n');
const finalContent = existingInfo + '\n' + newRows + '\n';

fs.writeFileSync(filePath, finalContent, 'utf8');

console.log('✅ Successfully appended batch 27 questions to updatedquestion.txt');
