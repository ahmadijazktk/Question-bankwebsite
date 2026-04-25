import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const questions = [
    {
        q: `What does hemochromatosis arthritis look like on histology?`,
        a: `<b>Brown synovial tissue and cartilage stripped from subchondral bone</b><br><br>*don't forget the "hooked MCP osteophytes on hand xrays*<br><br><img src="hemochromatosis_arthritis.jpg" class="zoomable-img" onclick="this.classList.toggle('zoomed')" />`,
        c: `Radiology`
    },
    {
        q: `Young boy, heavy, night time hip pain. Has pain throughout day. Walks with a limp. All labs are normal. B27 is positive. He has family hx of AxSpa. Xray shows cortical thickening and solitary lesion of long bone of cortex.`,
        a: `<b>Osteoid osteoma, benign</b><br><br>-xray has characteristic radiolucent nidus with thickened cortex<br>-very responsive to NSAIDs<br>-***osteoblastoma is another benign bone tumor. Found in VERTEBRAL ARCH. It is LARGER, and more aggressive appearance causing erosions. Less responsive to NSAIDs<br><br><img src="osteoid_osteoma.jpg" class="zoomable-img" onclick="this.classList.toggle('zoomed')" />`,
        c: `Radiology`
    },
    {
        q: `What would a spine xray look like in a patient with Hyperparathyroidism?`,
        a: `<b>Rugger Jersey spine</b><br><br>-prominent endplate densities at multiple contiguous vertebral levels to produce an alternating sclerotic-lucent-sclerotic appearance<br><br><img src="rugger_jersey_spine.jpg" class="zoomable-img" onclick="this.classList.toggle('zoomed')" />`,
        c: `Radiology`
    },
    {
        q: `What physical exam finding indicates Thoracic outlet syndrome?`,
        a: `<b>Adson test</b><br><br>-usually from accessory 1st rib in neck (look at any chest xray they give you carefully)<br>-test: abduct, then supinate affect arm. Turn head towards affected arm while taking a deep breath and holding. Diminished or absent RADIAL pulse and reproduction of sx is positive***<br><br><img src="adson_test.jpg" class="zoomable-img" onclick="this.classList.toggle('zoomed')" />`,
        c: `Clinical`
    },
    {
        q: `What does a spiculated, periosteal reaction on a long bone (at metaphysis, near the end, but not AT the end) on xray mean in someone with knee pain?`,
        a: `<b>Osteosarcoma</b><br><br>-occurs at METAPHYSIS, ie. the neck of the bone (near end of the bone, but NOT the epiphysis)<br><br><img src="osteosarcoma.jpg" class="zoomable-img" onclick="this.classList.toggle('zoomed')" />`,
        c: `Radiology`
    }
];

const filePath = path.join(__dirname, '..', 'updatedquestion.txt');
const existingInfo = fs.readFileSync(filePath, 'utf8').trimEnd();

const newRows = questions.map(q => q.q + "\t" + q.a + "\t" + q.c).join('\n');
const finalContent = existingInfo + '\n' + newRows + '\n';

fs.writeFileSync(filePath, finalContent, 'utf8');

console.log('✅ Successfully appended the batch 18 questions to updatedquestion.txt');
