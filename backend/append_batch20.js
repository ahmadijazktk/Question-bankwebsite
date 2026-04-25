import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const questions = [
    {
        q: `What does muscle biopsy of colchicine look like?`,
        a: `<b>Vacuolar myopathy<br>WHORLED membranous bodies (looks like SPIRALS)</b><br><br><img src="batch20_img1.jpg" class="zoomable-img" onclick="this.classList.toggle('zoomed')" />`,
        c: `Rheumatology`
    },
    {
        q: `What does muscle biopsy of steroid myopathy look like?`,
        a: `<b>Type II fiber atrophy</b><br><br>-stained black, the type 2 fibers look smaller/atrophied<br><br><img src="batch20_img2.jpg" class="zoomable-img" onclick="this.classList.toggle('zoomed')" />`,
        c: `Rheumatology`
    },
    {
        q: `What does muscle biopsy of anti-synthetase syndrome show?`,
        a: `<b>Perimysial inflammation<br>"Perifascicular necrosis"</b><br><br><img src="batch20_img3.jpg" class="zoomable-img" onclick="this.classList.toggle('zoomed')" />`,
        c: `Rheumatology`
    },
    {
        q: `Which type of myositis is associated with "angel wings" sign?`,
        a: `<b>Anti- SAE</b><br><br><img src="batch20_img4.jpg" class="zoomable-img" onclick="this.classList.toggle('zoomed')" />`,
        c: `Rheumatology`
    },
    {
        q: `One way to tell difference between DISH vs. AxSpa on xray?`,
        a: `<b>Look for RADIOLUCENCIES that suggest DISH (black spaces between ossification).</b><br><br><img src="batch20_img5.jpg" class="zoomable-img" onclick="this.classList.toggle('zoomed')" /><br><br>This can be very tricky.`,
        c: `Radiology`
    }
];

const filePath = path.join(__dirname, '..', 'updatedquestion.txt');
const existingInfo = fs.readFileSync(filePath, 'utf8').trimEnd();

const newRows = questions.map(q => q.q + "\t" + q.a + "\t" + q.c).join('\n');
const finalContent = existingInfo + '\n' + newRows + '\n';

fs.writeFileSync(filePath, finalContent, 'utf8');

console.log('✅ Successfully appended batch 20 questions to updatedquestion.txt');
