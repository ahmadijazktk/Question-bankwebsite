
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({ text: String, options: Array }, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

const BOLD = (text) => `<strong style='color:#000;font-weight:900;'>${text}</strong>`;

async function restore() {
    try {
        console.log("Connecting with 60s timeout...");
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 60000,
            connectTimeoutMS: 60000
        });
        console.log("Connected!");

        const allQs = await Question.find({});
        console.log(`Searching through ${allQs.length} questions.`);
        let updateCount = 0;

        for (const q of allQs) {
            let changed = false;
            const text = q.text || "";

            // 1. Global Cleanup: Remove RheumZoom
            if (q.options) {
                q.options.forEach(opt => {
                    const target = /According to the RheumZoom dataset\.?\s*/gi;
                    if (opt.explanation && target.test(opt.explanation)) {
                        opt.explanation = opt.explanation.replace(target, "").trim();
                        if (opt.explanation === "" && opt.isCorrect) opt.explanation = "Correct Answer.";
                        changed = true;
                    }
                });
            }

            // 2. Cloze formatting
            if (text.includes("{{c1::")) {
                const oldText = q.text;
                q.text = text.replaceAll("{{c1::3-12 months}}", "{{c1...3-12 months}}")
                    .replaceAll("{{c1::3-6 months}}", "{{c1...3-6 months}}");
                if (q.text !== oldText) changed = true;
            }

            // 3. Specific content restoration
            if (text.includes("30 year old female") || text.includes("unable to taper prednisone to \u22645 mg/day")) {
                const newExpl = `In people with SLE who are unable to taper prednisone to \u22645 mg/day, we ${BOLD('CONDITIONALLY RECOMMEND')} initiating or escalating immunosuppressive therapy.<br /><br />Under Musculoskeletal Arthritis in the 2025 ACR SLE Treatment Guideline: "For persistent or recurrent active SLE arthritis on HCQ, regardless of prior/current NSAIDs or short-term glucocorticoid therapy: \u2026We ${BOLD('CONDITIONALLY RECOMMEND')} initial therapy with MTX, MPAA, or AZA, with a low threshold to add or substitute with belimumab or anifrolumab for inadequate response over initial biologic therapy."`;
                q.options.forEach(o => { if (o.isCorrect) o.explanation = newExpl; });
                changed = true;
            }

            if (text.includes("28 year old female") || text.includes("stable on HCQ weight base")) {
                const newExpl = `According to ACR "Hemolytic Anemia : For SYMPTOMATIC autoimmune hemolytic anemia (i.e., ischemic manifestations and/or hemodynamic instability) attributed to SLE: \u2026We ${BOLD('CONDITIONALLY RECOMMEND')} initial glucocorticoid therapy with addition of IVIG and/or anti-CD20 therapy over the addition of conventional immunosuppressive agents."<br /><br />***this is the same answer and treatment for SYMPTOMATIC thrombocytopenia attributed to SLE ***`;
                q.options.forEach(o => { if (o.isCorrect) o.explanation = newExpl; });
                changed = true;
            }

            if (text.includes("34 year old female") || text.includes("active lupus myelitis")) {
                const newExpl = `Why?<br /><br />This is SLE associated transverse myelitis. According to ACR "For active lupus myelitis : \u2026We ${BOLD('CONDITIONALLY RECOMMEND')} initial therapy with pulse/high-dose glucocorticoid and IV CYC over pulse/high-dose glucocorticoid combined with other (non-CYC) immunosuppressive agents."<br /><br />***remember this is according to ACR guidelines. I personally may have chosen IV steroids + RTX and have done so in the past with good results. But the above is ${BOLD("CONDITIONALLY REC'D")} by ACR 2025 guidelines.***`;
                q.options.forEach(o => { if (o.isCorrect) o.explanation = newExpl; });
                changed = true;
            }

            if (text.includes("new onset seizures")) {
                const newExpl = `Seizure : For seizures attributed to active SLE: \u2026We ${BOLD('CONDITIONALLY RECOMMEND')} anti-seizure medication plus glucocorticoid, CYC, MPAA, AZA, and/or anti-CD20 over anti-seizure medication alone.<br /><br />Essentially anti-seizure med plus steroids, CYC, MMF, AZA or RTX.`;
                q.options.forEach(o => { if (o.isCorrect) o.explanation = newExpl; });
                changed = true;
            }

            if (text.includes("retinal toxicity")) {
                q.text = "To minimize retinal toxicity, we conditionally recommend a long-term average daily HCQ dose goal of {{.....}} over a dose goal of {{.....}}";
                q.options.forEach(o => { if (o.isCorrect) o.explanation = "To minimize retinal toxicity, we conditionally recommend a long-term average daily HCQ dose goal of {{c1:: \u22645 mg/kg}} over a dose goal of {{c1:: >5 mg/kg}}"; });
                changed = true;
            }

            if (changed) {
                console.log(`Updated Question: ${q._id} | Header: ${text.substring(0, 40)}`);
                q.markModified('options');
                q.markModified('text');
                await q.save();
                updateCount++;
            }
        }

        console.log(`\nDONE! Restored ${updateCount} questions.`);
        await mongoose.disconnect();
    } catch (err) {
        console.error("FATAL ERROR:", err);
    }
}
restore();
