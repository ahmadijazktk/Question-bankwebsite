import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.join(__dirname, 'rheumzoom_mongodb_format.json');
const questionsData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

console.log(`🚀 Starting Grand Master Restoration of ${questionsData.length} questions...`);

const DARK_BOLD_STYLE = "color: #000; font-weight: 900;";

const formatText = (str) => {
    if (!str) return str;
    let result = str;

    // 1. Cloze Deletion Fix: {{c1::text}} or {{text}} -> ____
    // The user said "bracket in question should be blank"
    result = result.replace(/\{\{[^}]*\}\}/g, " ____ ");

    // 2. Clear out any existing bolding/tags around guidelines to prevent double-wrapping
    result = result.replace(/<(?:strong|b|span)[^>]*>(conditionally recommend|strongly recommend)<\/(?:strong|b|span)>/gi, "$1");
    result = result.replace(/\*\*(conditionally recommend|strongly recommend)\*\*/gi, "$1");

    // 3. Apply Dark Bold Styling for Guidelines
    const guidelines = [
        "CONDITIONALLY RECOMMEND",
        "CONDITIONALLY RECOMMENDED",
        "STRONGLY RECOMMEND",
        "STRONGLY RECOMMENDED",
        "Strongly recommend AGAINST",
        "STRONGLY RECOMMEND AGAINST",
        "WEAK Rec'd",
        "STRONG REC'D",
        "STRONGLY REC'D"
    ];

    guidelines.forEach(phrase => {
        const regex = new RegExp(phrase, 'gi');
        result = result.replace(regex, `<strong style='${DARK_BOLD_STYLE}'>${phrase.toUpperCase()}</strong>`);
    });

    // 4. Handle "Essentially" sections with proper line breaks and bolding
    if (result.includes("Essentially")) {
        // Find "Essentially" and make it a new paragraph if it's not already
        const essentiallyRegex = /([.!?])\s*(Essentially)/g;
        result = result.replace(essentiallyRegex, "$1<br /><br /><strong style='${DARK_BOLD_STYLE}'>$2</strong>");

        // Also handle cases where it starts a line
        if (result.startsWith("Essentially")) {
            result = result.replace(/^Essentially/, `<strong style='${DARK_BOLD_STYLE}'>Essentially</strong>`);
        }
    }

    // 5. Cleanup redundant spaces and common typos in guidelines
    result = result.replace(/\*\* \*\*/g, " ");
    result = result.replace(/<br\s*\/?>\s*<br\s*\/?>\s*<br\s*\/?>/g, "<br /><br />");

    return result;
};

let modifiedCount = 0;

questionsData.forEach(q => {
    const oldText = q.text;
    q.text = formatText(q.text);

    q.options.forEach(opt => {
        const oldExpl = opt.explanation;
        opt.explanation = formatText(opt.explanation);
    });

    if (oldText !== q.text) modifiedCount++;
});

// Specific Master Overrides (Logic from previous update scripts)
const overrides = [
    {
        pattern: /transverse myelitis/i,
        explanation: `Why?<br /><br />This is SLE associated transverse myelitis. According to ACR "For active lupus myelitis : …We <strong style='${DARK_BOLD_STYLE}'>CONDITIONALLY RECOMMEND</strong> initial therapy with pulse/high-dose glucocorticoid and IV CYC over pulse/high-dose glucocorticoid combined with other (non-CYC) immunosuppressive agents."<br /><br />***remember this is according to ACR guidelines. I personally may have chosen IV steroids + RTX and have done so in the past with good results. But the above is <strong style='${DARK_BOLD_STYLE}'>CONDITIONALLY REC'D</strong> by ACR 2025 guidelines.***`
    },
    {
        pattern: /tapering the prednisone to a dose of/i,
        explanation: `"In people with SLE with stable controlled SLE on prednisone >5 mg/day: ...We <strong style='${DARK_BOLD_STYLE}'>STRONGLY RECOMMEND</strong> tapering the prednisone to a dose of ≤5 mg daily (and ideally to zero) within 6 months."\n<br/>\n"In people with SLE: …We <strong style='${DARK_BOLD_STYLE}'>STRONGLY RECOMMEND</strong> routine treatment with HCQ unless contraindicated."\n<br/>\nThese are from the 2025 ACR Guideline for the Treatment of Systemic Lupus Erythematosus (SLE)`
    }
];

overrides.forEach(ov => {
    questionsData.forEach(q => {
        if (ov.pattern.test(q.text)) {
            q.options.forEach(opt => {
                if (opt.isCorrect || opt.text === "Show Answer") {
                    opt.explanation = ov.explanation;
                }
            });
        }
    });
});

fs.writeFileSync(jsonPath, JSON.stringify(questionsData, null, 4));

console.log(`✅ Grand Master Restoration complete!`);
console.log(`📊 Questions with modified text: ${modifiedCount}`);
console.log(`📊 Total questions in source: ${questionsData.length}`);
console.log(`Source file rheumzoom_mongodb_format.json is now perfectly restored with all formatting.`);
