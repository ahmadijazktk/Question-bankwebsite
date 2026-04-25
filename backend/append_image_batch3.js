import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const questions = [
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

const filePath = path.join(__dirname, '..', 'updatedquestion.txt');
const existingInfo = fs.readFileSync(filePath, 'utf8').trimEnd();

const newRows = questions.map(q => q.q + "\t" + q.a + "\t" + q.c).join('\n');
const finalContent = existingInfo + '\n' + newRows + '\n';

fs.writeFileSync(filePath, finalContent, 'utf8');

console.log('✅ Successfully appended 3 image questions to updatedquestion.txt');
