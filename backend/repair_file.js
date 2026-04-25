import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '..', 'updatedquestion.txt');
let content = fs.readFileSync(filePath, 'utf8');

// The corruption seems to be huge blocks of spaces inside lines or between lines
// Let's split and clean
let lines = content.split('\n');
console.log('Total lines: ' + lines.length);

let cleanedLines = [];

for (let line of lines) {
    // If the line has these massive space blocks, it's likely corrupted
    if (line.match(/\s{50,}/)) {
        console.log('Discarding corrupted line: ' + line.substring(0, 50) + '...');
        continue;
    }

    // Also discard the recently added 3 questions if they are corrupted
    if (line.includes('Plica Syndrome') || line.includes('too many toes') || line.includes('PRES lesions')) {
        console.log('Discarding batch 12 line for re-addition: ' + line.substring(0, 50) + '...');
        continue;
    }

    if (line.trim().length > 0) {
        cleanedLines.push(line.trim());
    }
}

console.log('Cleaned lines: ' + cleanedLines.length);

// Re-add the 3 questions cleanly
const batch12 = [
    {
        q: `middle aged man/woman with popping/clicking of knee, and with pain. ***MEDIAL knee pain***<br>-MRI shows thickened synovial fibrous band.<br>-erosion of articular cartilage of patella and femoral condyle`,
        a: `<b>Plica Syndrome</b><br><br>-thickened, taut, cord like band (normally it should be thin)<br><br><img src="/collection.media/plica_syndrome.jpg" class="zoomable-img" onclick="this.classList.toggle('zoomed')" />`,
        c: `Radiology`
    },
    {
        q: `Dysfunction of what causes "too many toes" sign?`,
        a: `<b>Tibialis posterior tendon</b><br><br>-unable to invert foot, therefore "too many toes" seen from posterior view<br>-medial<br><br><img src="/collection.media/too_many_toes.png" class="zoomable-img" onclick="this.classList.toggle('zoomed')" />`,
        c: `Other`
    },
    {
        q: `How do the PRES lesions appear on MRI (T2)?`,
        a: `<b>Hyperintense in posterior white matter (typically)</b><br><br>clinical presentation can look similar to CNS lupus (as well as PML), but location of lesions and clinical context very important for PRES (CNS SLE lesions typically in frontal lobes/near lateral ventricles)<br><br>TX: anti-HTN, anti-seizure, supportive<br>CARE 2020, q48<br><br><img src="/collection.media/pres_mri.jpg" class="zoomable-img" onclick="this.classList.toggle('zoomed')" />`,
        c: `Radiology`
    }
];

const newRows = batch12.map(q => q.q + "\t" + q.a + "\t" + q.c);
const finalContent = cleanedLines.join('\n') + '\n' + newRows.join('\n') + '\n';

fs.writeFileSync(filePath, finalContent, 'utf8');
console.log('✅ File repaired and batch 12 re-appended correctly.');
