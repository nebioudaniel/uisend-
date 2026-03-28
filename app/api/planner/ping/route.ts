import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import fs from "fs";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const THIRTY_SECONDS = 30 * 1000;
const LOG_FILE = "/tmp/ping_logs.txt";

function logToFile(msg: string) {
  console.log(msg);
  try {
    fs.appendFileSync(LOG_FILE, `${new Date().toISOString()} ${msg}\n`);
  } catch (e) {}
}

export async function GET() {
  const now = new Date();
  const nowMs = now.getTime();
  logToFile(`[Ping] Checking tasks at ${now.toISOString()} (${nowMs})`);

  const tasks = await prisma.task.findMany({
    where: { status: { in: ["pending", "in_progress"] } },
    include: { user: true },
  });

  logToFile(`[Ping] Found ${tasks.length} active tasks`);

  let pinged = 0;

  for (const task of tasks) {
    const { user } = task;
    if (!user.botToken || !user.telegramId) {
      logToFile(`[Ping] task ${task.id} has missing botToken or telegramId`);
      continue;
    }

    const startMs = new Date(task.date).getTime();
    const durationMs = task.duration * 60 * 1000;
    const midMs = startMs + durationMs / 2;
    const endMs = startMs + durationMs;
    const lastPingMs = task.lastPingAt ? new Date(task.lastPingAt).getTime() : 0;

    logToFile(`[Ping] Task: "${task.title}"`);
    logToFile(`[Ping]   - now: ${nowMs}, start: ${startMs}, mid: ${midMs}, end: ${endMs}`);
    logToFile(`[Ping]   - lastPingMs: ${lastPingMs}, diff: ${nowMs - lastPingMs}`);

    // We check if now is past startMs. 
    // If there is a slight drift (e.g. 5 seconds) we don't care, we ping if nowMs >= startMs.
    if (nowMs < startMs) {
      logToFile(`[Ping]   - Not time yet (starts in ${Math.round((startMs - nowMs) / 1000)}s)`);
      continue;
    }

    // Must wait at least 30s. 
    // CRITICAL: If lastPingMs is in the future relative to now (clock mismatch), 
    // we bypass the wait so we can reset lastPingAt to a correct value.
    const diff = nowMs - lastPingMs;
    if (lastPingMs > 0 && diff > 0 && diff < THIRTY_SECONDS) {
      logToFile(`[Ping]   - Wait time (30s) not elapsed (${Math.round(diff / 1000)}s)`);
      continue;
    }

    const details = `\n📋 *Plan*: ${task.category || 'Personal'}${task.description ? '\n📝 *Notes*: ' + task.description : ''}`;

    let message = "";

    // ── PHASE 1: Pending & Not Started ──
    if (task.status === "pending" && !task.startedAt) {
      logToFile(`[Ping]   - Phase 1: Pending & Not Started`);
      message = `⏰ *TIME TO START*\n🚀 Task: *"${task.title}"*${details}\n\n👉 *ACTION NEEDED*: Go to your dashboard and click *START* to silence this! (30s interval)`;
    }

    // ── PHASE 2: Midpoint ──
    else if (
      task.status === "in_progress" &&
      task.startedAt &&
      !task.middleConfirmedAt &&
      nowMs >= midMs &&
      nowMs < endMs
    ) {
      logToFile(`[Ping]   - Phase 2: Halfway point reached`);
      const elapsed = Math.round((nowMs - startMs) / 60000);
      message = `⏱️ *HALFWAY CHECK-IN*\n🏃 Task: *"${task.title}"*${details}\n⏱️ *Elapsed*: ${elapsed}/${task.duration} minutes.\n\n👉 *ACTION NEEDED*: Go to your dashboard and click *MID-CHECK* to confirm! (30s interval)`;
    }

    // ── PHASE 3: Finish ──
    else if (task.status === "in_progress" && nowMs >= endMs && !task.finishedAt) {
      logToFile(`[Ping]   - Phase 3: Time's up`);
      message = `🏁 *TIME'S UP - FINISH NOW*\n🎯 Task: *"${task.title}"*${details}\n\n👉 *ACTION NEEDED*: Go to your dashboard and click *FINISH* to complete this! (30s interval)`;
    }

    if (message) {
      pinged++;
      logToFile(`[Ping]   - Sending Telegram msg: "${message.substring(0, 30)}..."`);
      try {
        const resp = await fetch(`https://api.telegram.org/bot${user.botToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: user.telegramId,
            text: message,
            parse_mode: "Markdown",
          }),
        });

        if (!resp.ok) {
          const errText = await resp.text();
          logToFile(`[Ping]   - Telegram Error: ${resp.status} - ${errText}`);
        } else {
          logToFile(`[Ping]   - Sent successfully`);
          await prisma.task.update({
            where: { id: task.id },
            data: { lastPingAt: now },
          });
        }
      } catch (err) {
        logToFile(`[Ping]   - ERROR: ` + JSON.stringify(err));
      }
    } else {
      logToFile(`[Ping]   - No message to send`);
    }
  }

  return NextResponse.json({ success: true, pinged, checkedAt: now });
}
