import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.join(__dirname, 'rheumzoom_mongodb_format.json');
const questionsData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

console.log(`Applying REFINED formatting to ${questionsData.length} questions...`);

const DARK_BOLD_STYLE = "color: #000; font-weight: 900;";

const applyRefinedFormat = (str) => {
    if (!str) return str;
    let result = str;

    // 1. Line Breaks for ***
    // Replace *** with <br/><br/>*** and text after with another break
    result = result.replace(/\*\*\*/g, "<br /><br />***");

    // 2. Line Breaks for Periods (.)
    // We target a period followed by a space and a capital letter, 
    // to avoid breaking things like "Mr. Smith" or "e.g." too much.
    // However, the user said "where you . ... add a text after it to next line".
    // I'll use a regex that looks for a period followed by a space and some text.
    result = result.replace(/\.\s+([A-Z0-9])/g, ".<br /><br />$1");

    // 3. Guideline Bold Style (Restore this as it's a critical fix)
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
        const regex = new RegExp(`(?<!strong[^>]*>)${phrase}`, 'gi'); // Simple negative lookbehind attempt
        result = result.replace(regex, `<strong style='${DARK_BOLD_STYLE}'>${phrase.toUpperCase()}</strong>`);
    });

    // 4. Cleanup redundant breaks
    result = result.replace(/(<br\s*\/?>\s*){3,}/g, "<br /><br />");

    return result;
};

questionsData.forEach(q => {
    q.text = applyRefinedFormat(q.text);
    q.options.forEach(opt => {
        opt.explanation = applyRefinedFormat(opt.explanation);
    });
});

// Master Overrides for specific questions
const overrides = [
    {
        pattern: /transverse myelitis/i,
        explanation: `Why?<br /><br />This is SLE associated transverse myelitis. According to ACR "For active lupus myelitis : …We <strong style='${DARK_BOLD_STYLE}'>CONDITIONALLY RECOMMEND</strong> initial therapy with pulse/high-dose glucocorticoid and IV CYC over pulse/high-dose glucocorticoid combined with other (non-CYC) immunosuppressive agents."<br /><br />***remember this is according to ACR guidelines. I personally may have chosen IV steroids + RTX and have done so in the past with good results. But the above is <strong style='${DARK_BOLD_STYLE}'>CONDITIONALLY REC'D</strong> by ACR 2025 guidelines.***`
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
console.log(`✅ Refined formatting applied. Brackets are RESTORED.`);
