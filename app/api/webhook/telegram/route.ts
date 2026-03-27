import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.callback_query) {
      const callbackQuery = body.callback_query;
      const data = callbackQuery.data; // e.g. "start_taskId"
      const message = callbackQuery.message;
      const chatId = message.chat.id;

      let responseText = "Got it!";
      let shouldUpdateMessage = true;

      // Extract action and taskId
      const parts = data.split("_");
      const action = parts[0]; // start | middle | finish
      const taskId = action === "finish" ? parts[2] : parts[1];
      const finishFlag = action === "finish" ? parts[1] : null;

      const task = await prisma.task.findUnique({
        where: { id: taskId },
        include: { user: true }
      });

      if (task) {
        let updateData: any = {};
        if (action === "start" && !task.startedAt) {
          updateData = { startedAt: new Date(), status: "in_progress" };
          responseText = "Great! Your task is now marked as Started. Good luck!";
        } else if (action === "middle" && !task.middleConfirmedAt) {
          updateData = { middleConfirmedAt: new Date() };
          responseText = "Awesome! Keep it up!";
        } else if (action === "finish") {
          if (finishFlag === "yes" && !task.finishedAt) {
            updateData = { finishedAt: new Date(), status: "completed" };
            responseText = "Congratulations on finishing your task! 🎉";
          } else if (finishFlag === "no") {
            // They can't finish it yet, maybe postpone or just keep going
            updateData = { status: "pending" }; // Reset or something, maybe extend duration?
            responseText = "No problem. Let's keep working!";
          }
        }

        if (Object.keys(updateData).length > 0) {
          await prisma.task.update({ where: { id: taskId }, data: updateData });

          // Edit message to remove inline keyboard
          await fetch(`https://api.telegram.org/bot${task.user.botToken}/editMessageText`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              message_id: message.message_id,
              text: message.text + `\n\n👉 [Confirmed: ${responseText}]`
            }),
          });
        }

        // Answer callback query
        await fetch(`https://api.telegram.org/bot${task.user.botToken}/answerCallbackQuery`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            callback_query_id: callbackQuery.id,
            text: responseText
          }),
        });
      }

    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Webhook error", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
