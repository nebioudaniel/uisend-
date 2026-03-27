"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function connectTelegram(botToken: string, telegramId: string) {
  if (!botToken || !telegramId) return { error: "Missing fields" };
  const token = botToken.trim();
  const chatId = telegramId.trim();
  
  let user = await prisma.user.findFirst({ where: { telegramId: chatId } });
  if (!user) {
    user = await prisma.user.create({ data: { telegramId: chatId, botToken: token } });
  } else {
    user = await prisma.user.update({ where: { id: user.id }, data: { botToken: token } });
  }
  return { success: true, user };
}

export async function testTelegram(telegramId: string) {
  const user = await prisma.user.findFirst({ where: { telegramId: telegramId.trim() } });
  if (!user || !user.botToken) return { error: "Bot not connected" };
  
  try {
    const resp = await fetch(`https://api.telegram.org/bot${user.botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: user.telegramId,
        text: "🔔 *Bot Test Connection*\n\nYour Telegram connection is working perfectly! I will now send you reminders for your scheduled plans.",
        parse_mode: "Markdown",
      }),
    });
    if (!resp.ok) return { error: await resp.text() };
    return { success: true };
  } catch (err) {
    return { error: String(err) };
  }
}

export async function getTasks(telegramId: string) {
  if (!telegramId) return { tasks: [] };
  const chatId = telegramId.trim();
  const user = await prisma.user.findFirst({ where: { telegramId: chatId } });
  if (!user) return { tasks: [] };
  const tasks = await prisma.task.findMany({
    where: { userId: user.id },
    orderBy: { date: "asc" },
  });
  return { tasks };
}

export async function createTask(data: any, telegramId: string) {
  console.log("[CreateTask] Received timestamp:", data.timestamp, "->", new Date(data.timestamp).toISOString());
  const user = await prisma.user.findFirst({ where: { telegramId } });
  if (!user) return { error: "User not found" };
  await prisma.task.create({
    data: {
      userId: user.id,
      title: data.title,
      description: data.description,
      category: data.category || "work",
      frequency: data.frequency || "once",
      date: new Date(data.timestamp),
      duration: parseInt(data.duration, 10),
      status: "pending",
    },
  });
  revalidatePath("/dashboard");
  return { success: true };
}

// Called when user clicks "Start" in dashboard
export async function startTask(taskId: string) {
  const taskData = await prisma.task.findUnique({
    where: { id: taskId },
    include: { user: true },
  });
  if (!taskData) return { error: "Task not found" };

  await prisma.task.update({
    where: { id: taskId },
    data: { status: "in_progress", startedAt: new Date(), lastPingAt: null },
  });

  if (taskData.user.botToken && taskData.user.telegramId) {
    await fetch(`https://api.telegram.org/bot${taskData.user.botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: taskData.user.telegramId,
        text: `✅ Got it! "${taskData.title}" has started. Good luck!\n\nI'll check in with you halfway through.`,
      }),
    });
  }
  revalidatePath("/dashboard");
  return { success: true };
}

// Called when user clicks mid-point "Confirm" in dashboard
export async function confirmMiddle(taskId: string) {
  const taskData = await prisma.task.findUnique({
    where: { id: taskId },
    include: { user: true },
  });
  if (!taskData) return { error: "Task not found" };

  await prisma.task.update({
    where: { id: taskId },
    data: { middleConfirmedAt: new Date(), lastPingAt: null },
  });

  if (taskData.user.botToken && taskData.user.telegramId) {
    await fetch(`https://api.telegram.org/bot${taskData.user.botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: taskData.user.telegramId,
        text: `👍 Great, keep going with "${taskData.title}"!\n\nI'll notify you when your time is up.`,
      }),
    });
  }
  revalidatePath("/dashboard");
  return { success: true };
}

// Called when user clicks "Finish" in dashboard
export async function finishTask(taskId: string) {
  const taskData = await prisma.task.findUnique({
    where: { id: taskId },
    include: { user: true },
  });
  if (!taskData) return { error: "Task not found" };

  await prisma.task.update({
    where: { id: taskId },
    data: { status: "completed", finishedAt: new Date(), lastPingAt: null },
  });

  if (taskData.user.botToken && taskData.user.telegramId) {
    await fetch(`https://api.telegram.org/bot${taskData.user.botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: taskData.user.telegramId,
        text: `🎉 Excellent work! "${taskData.title}" is marked as complete. Keep it up!`,
      }),
    });
  }
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteTask(taskId: string) {
  await prisma.task.delete({ where: { id: taskId } });
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateTask(taskId: string, data: any) {
  await prisma.task.update({
    where: { id: taskId },
    data: {
      title: data.title,
      description: data.description,
      category: data.category,
      frequency: data.frequency,
      date: new Date(data.timestamp),
      duration: parseInt(data.duration, 10),
    },
  });
  revalidatePath("/dashboard");
  return { success: true };
}
