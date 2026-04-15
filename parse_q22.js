
import fs from 'fs';
const dataStr = fs.readFileSync('api_res.json', 'utf8');
const data = JSON.parse(dataStr);
const qs = data.data.questions;

let out = '';
out += "Q20: " + qs[19]._id + " | " + qs[19].text + " | img1: " + qs[19].image + " | img2: " + qs[19].image2 + "\n\n";
out += "Q21: " + qs[20]._id + " | " + qs[20].text + " | img1: " + qs[20].image + " | img2: " + qs[20].image2 + "\n\n";
out += "Q22: " + qs[21]._id + " | " + qs[21].text + " | img1: " + qs[21].image + " | img2: " + qs[21].image2 + "\n\n";
out += "Q23: " + qs[22]._id + " | " + qs[22].text + " | img1: " + qs[22].image + " | img2: " + qs[22].image2 + "\n\n";

fs.writeFileSync('q22_debug.txt', out, 'utf8');
