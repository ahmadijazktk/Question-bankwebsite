import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '..', 'updatedquestion.txt');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Aggressive cleaning of whitespace corruption
let lines = content.split('\n').map(line => line.replace(/\s{30,}/g, ' ').trim()).filter(line => line.length > 0);

// 2. Fix image paths. Replace src="/collection.media/filename" with src="filename"
// because the server-side processHtml will add the prefix anyway and it is more robust.
let processedLines = lines.map(line => {
    return line.replace(/src="\/collection\.media\/([^"]+)"/gi, 'src="$1"');
});

// 3. Ensure no duplicates of the latest batch if they were already there
// (Actually, since we reset to the commit where I added them, they should be there)

// 4. Force specific categories if needed (though the script already does it)

const headers = [
    '#separator:tab',
    '#html:true',
    '#tags column:12'
];

const finalLines = processedLines.filter(l => !l.startsWith('#'));
const finalContent = headers.join('\n') + '\n' + finalLines.join('\n') + '\n';

fs.writeFileSync(filePath, finalContent, 'utf8');
console.log('✅ File cleaned, paths simplified, and ready for sync.');
