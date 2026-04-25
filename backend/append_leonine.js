import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const questionText = `Deep glabellar furrowing (aka Leonine facies) is typically seen in which scleroderma mimic?`;

const answerText = `<b>Scleromyxedema</b><br><br>-side point: Leonine facies also seen in MRH<br><br><img src="/collection.media/leonine_facies.jpg" class="zoomable-img" onclick="this.classList.toggle('zoomed')" />`;

const category = "Other";
// wait, the image URL starts with /collection.media/ and CSS class "zoomable-img" or we can rely on standard CSS. Wait, the user said "click on image it will get begger like a zoom effect". Last time I added class="zoomable-img" onclick="this.classList.toggle('zoomed')". But then they said "after clicking on reveaing answe below the asnwer box the image will also be shown but make sure when someone click on image it will get begger like a zoom effect". Actually, Exam.tsx has a built-in zoom feature for questions!
// Oh wait! In Exam.tsx, there's logic that if `question.imageSrc` is present, it renders it with a Zoom dialog! But the backend expects `image` and `image2` fields, not just HTML embedded images. Wait! The user's format for Anki is `Question \t Answer \t Category`. If they want built-in zoom, we can just use the HTML `<img ...>` tag with the CSS class I previously added, OR we can append the image path to a 4th column if the backend supports it. The backend currently maps question/options/category.
// Let's stick strictly to embedding it in the answer text because that's what we did last time and it is simpler for raw HTML questions.

const row = questionText + "\t" + answerText + "\t" + category;

const filePath = path.join(__dirname, '..', 'updatedquestion.txt');
const existingInfo = fs.readFileSync(filePath, 'utf8').trimEnd();
const finalContent = existingInfo + '\n' + row + '\n';

fs.writeFileSync(filePath, finalContent, 'utf8');

console.log('✅ Successfully appended the Leonine facies question to updatedquestion.txt');
