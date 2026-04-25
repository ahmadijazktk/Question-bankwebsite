import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '..', 'updatedquestion.txt');
let content = fs.readFileSync(filePath, 'utf8');

// Find the RP-ILD line
const lines = content.split('\n');
let foundIndex = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('According to the 2023 ACR guidelines for ILD, are the following recommended FOR or AGAINST as 1st line treatment for RP-ILD')) {
        foundIndex = i;
        break;
    }
}

if (foundIndex !== -1) {
    console.log('Original line found at index ' + foundIndex);

    const questionPart = `According to the 2023 ACR guidelines for ILD, are the following recommended FOR or AGAINST as 1st line treatment for RP-ILD (from Systemic autoimmune rheumatic diseases)?<br><br>Methotrexate? {{……..}}<br>Leflunomide? {{……..}}<br>Azathioprine? {{……..}}<br>TNFi? {{………}}<br>Abatacept? {{……….}}<br>Tocilizumab? {{………}}<br>Nintedanib? {{……….}}<br>Pirfenidone? {{………}}<br>PLEX? {{……….}}`;

    const answerPart = `According to the 2023 ACR guidelines for ILD, are the following recommended FOR or AGAINST as 1st line treatment for RP-ILD (from Systemic autoimmune rheumatic diseases)?<br><br>Methotrexate? <b style="color: blue;">AGAINST</b><br>Leflunomide? <b style="color: blue;">AGAINST</b><br>Azathioprine? <b style="color: blue;">AGAINST</b><br>TNFi? <b style="color: blue;">AGAINST</b><br>Abatacept? <b style="color: blue;">AGAINST</b><br>Tocilizumab? <b style="color: blue;">AGAINST</b><br>Nintedanib? <b style="color: blue;">AGAINST</b><br>Pirfenidone? <b style="color: blue;">AGAINST</b><br>PLEX? <b style="color: blue;">AGAINST</b><br><br>Essentially, the treatment options for RP-ILD are:<br><br>IV steroids, Rituximab, Cyclophosphamide, IVIG, MMF, CNIs, or JAKi<br><br>***if patient has MDA5 RP-ILD, there is a conditional recommendation for "triple therapy", which is:<br><br>IV steroids + 2 of the above options (Rituximab, Cyclophosphamide, IVIG, MMF, CNIs, or JAKi)<br><br><img src="/collection.media/mda5_rp_ild.jpg" class="zoomable-img" onclick="this.classList.toggle('zoomed')" />`;

    const category = 'ILD';

    lines[foundIndex] = questionPart + '\t' + answerPart + '\t' + category;

    fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
    console.log('✅ Successfully updated the question.');
} else {
    console.log('❌ Question not found.');
}
