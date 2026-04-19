
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const QuestionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);

const BOLD = (text) => `<strong style='color:#000;font-weight:900;'>${text}</strong>`;

async function restore() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB.");

    const allQs = await Question.find({});
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

        // 2. Cloze formatting restore: {{c1::...}} -> {{c1...}}
        if (text.includes("{{c1::")) {
            q.text = text.replaceAll("{{c1::3-12 months}}", "{{c1...3-12 months}}")
                .replaceAll("{{c1::3-6 months}}", "{{c1...3-6 months}}");
            if (q.text !== text) changed = true;
        }

        // 3. Question specific content restoration

        // Q32/Search: "30 year old female" and "SLE (+anti-Smith, +ANA)"
        if (text.includes("30 year old female") && text.includes("anti-Smith") && text.includes("ANA")) {
            const newExpl = `In people with SLE who are unable to taper prednisone to \u22645 mg/day, we ${BOLD('CONDITIONALLY RECOMMEND')} initiating or escalating immunosuppressive therapy.<br /><br />Under Musculoskeletal Arthritis in the 2025 ACR SLE Treatment Guideline: "For persistent or recurrent active SLE arthritis on HCQ, regardless of prior/current NSAIDs or short-term glucocorticoid therapy: \u2026We ${BOLD('CONDITIONALLY RECOMMEND')} initial therapy with MTX, MPAA, or AZA, with a low threshold to add or substitute with belimumab or anifrolumab for inadequate response over initial biologic therapy."`;
            q.options.forEach(o => { if (o.isCorrect) o.explanation = newExpl; });
            changed = true;
        }

        // Q28/Search: "28 year old female" and "stable on HCQ weight base"
        if (text.includes("28 year old female") && text.includes("stable on HCQ")) {
            const newExpl = `According to ACR "Hemolytic Anemia : For SYMPTOMATIC autoimmune hemolytic anemia (i.e., ischemic manifestations and/or hemodynamic instability) attributed to SLE: \u2026We ${BOLD('CONDITIONALLY RECOMMEND')} initial glucocorticoid therapy with addition of IVIG and/or anti-CD20 therapy over the addition of conventional immunosuppressive agents."<br /><br />***this is the same answer and treatment for SYMPTOMATIC thrombocytopenia attributed to SLE ***`;
            q.options.forEach(o => { if (o.isCorrect) o.explanation = newExpl; });
            changed = true;
        }

        // Q26/Search: "34 year old female" and "suspicion of" (Myelitis)
        if (text.includes("34 year old female") && text.includes("suspicion of")) {
            const newExpl = `Why?<br /><br />This is SLE associated transverse myelitis. According to ACR "For active lupus myelitis : \u2026We ${BOLD('CONDITIONALLY RECOMMEND')} initial therapy with pulse/high-dose glucocorticoid and IV CYC over pulse/high-dose glucocorticoid combined with other (non-CYC) immunosuppressive agents."<br /><br />***remember this is according to ACR guidelines. I personally may have chosen IV steroids + RTX and have done so in the past with good results. But the above is ${BOLD("CONDITIONALLY REC'D")} by ACR 2025 guidelines.***`;
            q.options.forEach(o => { if (o.isCorrect) o.explanation = newExpl; });
            changed = true;
        }

        // Q48/Search: "Class 5" and "NEW ONSET/ACTIVE/ FLARE"
        if (text.includes("Class 5") && text.includes("NEW ONSET")) {
            const newExpl = `consisting of pulse intravenous glucocorticoids 250-1000 mg methylprednisolone daily x 1-3 days, followed by oral glucocorticoid \u22640.5 mg/kg/day (maximum dose 40 mg/day) with taper and MPAA (ie. MMF) plus CNI.<br /><br />***if Class V with <1 g/g , we ${BOLD('CONDITIONALLY RECOMMEND')} treatment with glucocorticoids and/or immunosuppressant therapy (MPAA, AZA, or CNI).`;
            q.options.forEach(o => { if (o.isCorrect) o.explanation = newExpl; });
            changed = true;
        }

        // Q50/Search: "40 year old male" and "belimumab" (Proteinuria)
        if (text.includes("40 year old male") && text.includes("belimumab") && text.includes("proteinuria")) {
            const newExpl = `"In people with LN who have not achieved complete renal response, we ${BOLD('STRONGLY RECOMMEND')} quantifying proteinuria at least every 3 months ."<br /><br />***in patients who have sustained complete renal response, it is ${BOLD('STRONGLY RECOMMENDED')} to check proteinuria every 3-6 months for monitoring.`;
            q.options.forEach(o => { if (o.isCorrect) o.explanation = newExpl; });
            changed = true;
        }

        // Q24/Search: "seizures" (Seizure)
        if (text.includes("new onset seizures")) {
            const newExpl = `Seizure : For seizures attributed to active SLE: \u2026We ${BOLD('CONDITIONALLY RECOMMEND')} anti-seizure medication plus glucocorticoid, CYC, MPAA, AZA, and/or anti-CD20 over anti-seizure medication alone.<br /><br />Essentially anti-seizure med plus steroids, CYC, MMF, AZA or RTX.`;
            q.options.forEach(o => { if (o.isCorrect) o.explanation = newExpl; });
            changed = true;
        }

        // Q73/Search: "suspected GCA" and "biopsy"
        if (text.includes("suspected GCA") && text.includes("biopsy")) {
            const newExpl = `For patients with suspected GCA, we ${BOLD('CONDITIONALLY RECOMMEND')} obtaining a temporal artery biopsy specimen within 2 weeks of starting oral GCs over waiting longer than 2 weeks for a biopsy.`;
            q.options.forEach(o => { if (o.isCorrect) o.explanation = newExpl; });
            changed = true;
        }

        // Q34/Search: "retinal toxicity"
        if (text.includes("retinal toxicity")) {
            q.text = "To minimize retinal toxicity, we conditionally recommend a long-term average daily HCQ dose goal of {{.....}} over a dose goal of {{.....}}";
            q.options.forEach(o => {
                if (o.isCorrect) o.explanation = "To minimize retinal toxicity, we conditionally recommend a long-term average daily HCQ dose goal of {{c1:: \u22645 mg/kg}} over a dose goal of {{c1:: >5 mg/kg}}";
            });
            changed = true;
        }

        // Q63, Q64, Q65/Search: "ILD guidelines" or "strongly recommend against"
        if (q.options) {
            q.options.forEach(o => {
                if (o.explanation && /strongly recommend against/i.test(o.explanation)) {
                    o.explanation = o.explanation.replace(/strongly recommend against/gi, BOLD('STRONGLY RECOMMEND AGAINST'));
                    changed = true;
                }
                if (q.text.includes("SSc-ILD") && q.text.includes("MCTD-ILD")) {
                    o.explanation = `"For people with SSc-ILD and MCTD-ILD, we ${BOLD('CONDITIONALLY RECOMMEND')} tocilizumab as a first-line ILD treatment option."<br /><br />"For people with SSc-ILD, we ${BOLD('CONDITIONALLY RECOMMEND')} nintedanib as a first-line ILD treatment option."`;
                    changed = true;
                }
            });
        }

        if (changed) {
            console.log(`Matched and Updated: ${q._id} | Snippet: ${text.substring(0, 50)}`);
            q.markModified('options');
            q.markModified('text');
            await q.save();
            updateCount++;
        }
    }

    console.log(`\nRestoration complete! Updated ${updateCount} questions.`);
    await mongoose.disconnect();
}
restore();
