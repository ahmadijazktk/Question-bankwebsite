import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const questionText = `What is this?<br><br><img src="oci_pelvis.png" class="zoomable-img" onclick="this.classList.toggle('zoomed')" />`;

const answerText = `<b>Osteiitis condensans ilii</b><br><br>-typically from mulitparous women, athletes. From mechanical stress across the joint.<br><br>This is hard.<br>X-ray shows sclerosis at the ILIAC border of the SI joint.<br>***A typical radiographic finding to distinguish OCI from other causes (AxSpa) is the <b>TRIANGULAR SHAPE</b> of sclerosis at the ILIAC border with preserved joint space.`;

const category = "Radiology";
const row = questionText + "\t" + answerText + "\t" + category;

const filePath = path.join(__dirname, '..', 'updatedquestion.txt');
const existingInfo = fs.readFileSync(filePath, 'utf8').trimEnd();
const finalContent = existingInfo + '\n' + row + '\n';

fs.writeFileSync(filePath, finalContent, 'utf8');

console.log('✅ Successfully appended the OCI pelvis question to updatedquestion.txt');
