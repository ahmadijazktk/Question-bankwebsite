
async function check() {
    try {
        const res = await fetch('http://localhost:5000/api/questions?limit=50');
        const data = await res.json();
        const qs = data.data.questions;

        console.log(`Retrieved ${qs.length} questions.`);
        const q21 = qs[20]; // 0-based index
        console.log("Q21 info:");
        console.log(`ID: ${q21._id}`);
        console.log(`Text: ${q21.text}`);
        console.log(`Image: ${q21.image}`);
        console.log(`Image2: ${q21.image2}`);
    } catch (e) {
        console.error("API error", e.message);
    }
}

check();
