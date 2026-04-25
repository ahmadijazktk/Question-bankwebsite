import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const questionText = `According to the 2023 ACR guidelines for ILD, are the following recommended FOR or AGAINST as 1st line treatment for RP-ILD (from Systemic autoimmune rheumatic diseases)?<br><br>Methotrexate? {{c1::AGAINST}}<br>Leflunomide? {{c1::AGAINST}}<br>Azathioprine? {{c1::AGAINST}}<br>TNFi? {{c1::AGAINST}}<br>Abatacept? {{c1::AGAINST}}<br>Tocilizumab? {{c1::AGAINST}}<br>Nintedanib? {{c1::AGAINST}}<br>Pirfenidone? {{c1::AGAINST}}<br>PLEX? {{c1::AGAINST}}`;

const answerText = `<b>Essentially, the treatment options for RP-ILD are:</b><br><br>IV steroids, Rituximab, Cyclophosphamide, IVIG, MMF, CNIs, or JAKi<br><br>***if patient has MDA5 RP-ILD, there is a conditional recommendation for "triple therapy", which is:<br><br>IV steroids + 2 of the above options (Rituximab, Cyclophosphamide, IVIG, MMF, CNIs, or JAKi)<br><br><img src="/images/mda5_rp_ild.jpg" class="zoomable-img" onclick="this.classList.toggle('zoomed')" />`;

const category = "ILD";
const row = questionText + "\t" + answerText + "\t" + category;

const filePath = path.join(__dirname, '..', 'updatedquestion.txt');
const existingInfo = fs.readFileSync(filePath, 'utf8').trimEnd();
const finalContent = existingInfo + '\n' + row + '\n';

fs.writeFileSync(filePath, finalContent, 'utf8');

console.log('✅ Successfully appended the image question to updatedquestion.txt');
