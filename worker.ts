// Run this script locally or on a VPS to keep notifications checking every 10s.
// Command: npm run worker

const PING_URL = process.env.PING_URL || "http://localhost:3000/api/planner/ping";
const INTERVAL_MS = 10 * 1000; // 10 seconds

console.log(`[Worker] Starting background worker to ping ${PING_URL} every 10s...`);

setInterval(async () => {
  try {
    const res = await fetch(PING_URL);
    if (!res.ok) {
      console.error(`[Worker] Error pinging server: ${res.statusText}`);
    } else {
      const data = (await res.json()) as Record<string, unknown>;
      console.log(`[Worker] Ping success. Checked at: ${data.checkedAt}, Pinged tasks: ${data.pinged}`);
    }
  } catch (err) {
    console.error(`[Worker] Failed to ping: ${(err as Error).message}`);
  }
}, INTERVAL_MS);
