import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.join(__dirname, 'rheumzoom_mongodb_format.json');
const questionsData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

console.log(`Restoring all fixes in ${questionsData.length} questions...`);

const BOLD = (text) => `<strong style='color:#000;font-weight:900;'>${text}</strong>`;

const fixes = [
    {
        pattern: /transverse myelitis/i,
        content: `Why?<br /><br />This is SLE associated transverse myelitis. According to ACR "For active lupus myelitis : \u2026We ${BOLD('CONDITIONALLY RECOMMEND')} initial therapy with pulse/high-dose glucocorticoid and IV CYC over pulse/high-dose glucocorticoid combined with other (non-CYC) immunosuppressive agents."<br /><br />***remember this is according to ACR guidelines. I personally may have chosen IV steroids + RTX and have done so in the past with good results. But the above is ${BOLD("CONDITIONALLY REC'D")} by ACR 2025 guidelines.***`
    },
    {
        pattern: /seizures attributed to active SLE/i,
        content: `Seizure : For seizures attributed to active SLE: \u2026We ${BOLD('CONDITIONALLY RECOMMEND')} anti-seizure medication plus glucocorticoid, CYC, MPAA, AZA, and/or anti-CD20 over anti-seizure medication alone.<br /><br />Essentially anti-seizure med plus steroids, CYC, MMF, AZA or RTX.`
    },
    {
        pattern: /tapering the prednisone to a dose of/i,
        content: `"In people with SLE with stable controlled SLE on prednisone >5 mg/day: ...We <strong>STRONGLY RECOMMEND</strong> tapering the prednisone to a dose of ≤5 mg daily (and ideally to zero) within 6 months."\n<br/>\n"In people with SLE: …We <strong>STRONGLY RECOMMEND</strong> routine treatment with HCQ unless contraindicated."\n<br/>\nThese are from the 2025 ACR Guideline for the Treatment of Systemic Lupus Erythematosus (SLE)`
    },
    {
        pattern: /MMF \+ belimumab/i,
        content: `-MMF + belimumab)\n<br/>\n…or \n<br/>\n-MMF + CNI (calcineurin inhibitor)\n<br/>\n...or \n<br/>\n-Low dose CYC (Euro-Lupus Nephritis Trial) + belimumab (MMF substituted for CYC after CYC course complete) “<strong>CONDITIONALLY RECOMMEND</strong>" \n<br/>\nIt get's more specific than this actually, but you can break it down easily: \n<br/>\npick MMF + CNI if patient has proteinuria ≥3g/g (or if patient has Class 5 involvement)\n<br/>\npick MMF + belimumab if patient has extra-renal symptoms \n<br/>\n***ACR does not state any specific scenario to prioritize Low dose CYC. Only that if you choose CYC, you use the Euro-Lupus trial dosing (ie. Low dose CYC).`
    },
    {
        pattern: /SSc-ILD and MCTD-ILD/i,
        content: `"For people with SSc-ILD and MCTD-ILD, we ${BOLD('CONDITIONALLY RECOMMEND')} tocilizumab as a first-line ILD treatment option."<br /><br />"For people with SSc-ILD, we ${BOLD('CONDITIONALLY RECOMMEND')} nintedanib as a first-line ILD treatment option."`
    }
];

let specificModified = 0;
let globalModified = 0;

questionsData.forEach(q => {
    q.options.forEach(opt => {
        // 1. Apply specific fixes if found in text or explanation
        fixes.forEach(fix => {
            if (fix.pattern.test(q.text) || fix.pattern.test(opt.explanation)) {
                if (opt.isCorrect || opt.text === "Show Answer") {
                    opt.explanation = fix.content;
                    specificModified++;
                }
            }
        });

        // 2. Apply global regex formatting for guidelines
        const phrasesToBold = [
            "CONDITIONALLY recommend",
            "CONDITIONALLY recommended",
            "STRONGLY recommend",
            "STRONGLY recommended",
            "Strongly recommend AGAINST",
            "STRONGLY RECOMMEND AGAINST",
            "STRONGLY RECOMMENDED",
            "WEAK Rec'd",
            "STRONG REC'D",
            "STRONGLY REC'D"
        ];

        phrasesToBold.forEach(phrase => {
            const regex = new RegExp(phrase, 'gi');
            if (regex.test(opt.explanation)) {
                // Only replace if not already wrapped in <strong> or **
                if (!opt.explanation.includes(`<strong>${phrase.toUpperCase()}</strong>`) &&
                    !opt.explanation.includes(`**${phrase.toUpperCase()}**`)) {
                    opt.explanation = opt.explanation.replace(regex, `<strong>${phrase.toUpperCase()}</strong>`);
                    globalModified++;
                }
            }
        });
    });
});

fs.writeFileSync(jsonPath, JSON.stringify(questionsData, null, 4));
console.log(`✅ Specific fixes applied: ${specificModified}`);
console.log(`✅ Global formatting applied: ${globalModified}`);
console.log(`✅ Source file successfully restored.`);
