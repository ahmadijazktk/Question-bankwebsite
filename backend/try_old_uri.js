
import mongoose from 'mongoose';

const OLD_URI = "mongodb+srv://romankhanrk1435rs_db_user:MBxY2R9kXIgYUubQ@cluster0.u4scequ.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0";

async function check() {
    try {
        console.log("Trying OLD URI...");
        await mongoose.connect(OLD_URI, { serverSelectionTimeoutMS: 5000 });
        console.log("OLD URI Connected!");
        await mongoose.disconnect();
    } catch (err) {
        console.error("OLD URI ERROR:", err.message);
    }
}
check();
