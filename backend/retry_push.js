import { execSync } from 'child_process';

async function pushWithRetry(retries = 10) {
    for (let i = 1; i <= retries; i++) {
        console.log(`🚀 Attempt ${i} of ${retries}...`);
        try {
            execSync('git push origin main', { stdio: 'inherit' });
            console.log('✅ Push successful!');
            return true;
        } catch (error) {
            console.warn(`❌ Attempt ${i} failed. Retrying in 10s...`);
            await new Promise(resolve => setTimeout(resolve, 10000));
        }
    }
    console.error('💥 All attempts failed.');
    return false;
}

pushWithRetry();
