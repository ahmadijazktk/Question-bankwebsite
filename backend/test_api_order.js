
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const API_URL = 'http://localhost:5000/api'; // Assuming local server is running

async function check() {
    try {
        const res = await axios.get(`${API_URL}/questions?limit=50`);
        const qs = res.data.questions;
        console.log(`Retrieved ${qs.length} questions.`);
        qs.forEach((q, i) => {
            console.log(`${i + 1}. ID: ${q._id} | Text: ${q.text?.substring(0, 30)} | Image: ${q.image}`);
        });
    } catch (e) {
        console.error("FAILED to connect to API. Static check instead.");
        // If API fails, I'll just check the DB directly with the same sort as controller
    }
}

check();
