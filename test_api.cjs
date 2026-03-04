
const http = require('http');

http.get('http://localhost:5000/api/questions?limit=50', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        try {
            const parsed = JSON.parse(data);
            const qs = parsed.data.questions;
            console.log("Total: ", qs.length);
            const q21 = qs[20];
            console.log("Q21: ", q21._id, q21.text, q21.image, q21.image2);
        } catch (e) { console.log(e); }
    });
}).on('error', e => console.error(e));
