// Run this script using PM2 or Node if you are hosting on a VPS or Local machine.
// If you deploy on Vercel, the `vercel.json` cron will handle this instead.

import fetch from "node-fetch"; // You may need to install node-fetch if using older node versions

const PING_URL = process.env.PING_URL || "http://localhost:3000/api/planner/ping";
const INTERVAL_MS = 30 * 1000; // 30 seconds

console.log(`[Worker] Starting background worker to ping ${PING_URL} every 30s...`);

setInterval(async () => {
  try {
    const res = await fetch(PING_URL);
    if (!res.ok) {
      console.error(`[Worker] Error pinging server: ${res.statusText}`);
    } else {
      const data = (await res.json()) as any;
      console.log(`[Worker] Ping success. Checked at: ${data.checkedAt}, Pinged tasks: ${data.pinged}`);
    }
  } catch (err) {
    console.error(`[Worker] Failed to ping: ${(err as Error).message}`);
  }
}, INTERVAL_MS);
