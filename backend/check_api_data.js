
import axios from 'axios';

async function checkApi() {
    try {
        const response = await axios.get('http://localhost:5000/api/questions?_id=69a363b4e212ad97bfa96f78');
        console.log("Response:", JSON.stringify(response.data, null, 2));
    } catch (err) {
        console.log("API not reachable on 5000 directly. Trying search params...");
        try {
            const res2 = await axios.get('http://localhost:5173/api/questions'); // If proxy exists
            console.log("Proxy on 5173 reached.");
        } catch (err2) {
            console.log("API not reachable.");
        }
    }
}
checkApi();
