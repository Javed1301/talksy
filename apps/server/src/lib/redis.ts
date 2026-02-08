import { createClient } from 'redis';

const redis = createClient({
    // Use 'redis' if running inside Docker Compose, or 'localhost' if running locally
    url: process.env.REDIS_URL || 'redis://localhost:6379' 
});

redis.on('error', (err) => console.log('❌ Redis Client Error', err));
redis.on('connect', () => console.log('✅ Redis Connected'));

// Self-invoking connection to handle top-level await cleanly
(async () => {
    if (!redis.isOpen) {
        await redis.connect();
    }
})();

export default redis;