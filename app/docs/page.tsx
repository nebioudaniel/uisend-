import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { BookOpen, Key, Link as LinkIcon, Play, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DocsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SiteHeader />

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-16">
        <div className="mb-14">
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight mb-3">Documentation</h1>
          <p className="text-sm text-gray-500 leading-relaxed max-w-lg">
            Everything you need to set up your personal Telegram tracking assistant.
          </p>
        </div>

        <section className="mb-14">
           <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
              <Key size={18} className="text-gray-400" /> 1. Getting Your Bot Token
           </h2>
           <p className="text-[13px] text-gray-500 leading-relaxed mb-4">
             Before you can use UniSend, you need to create your own personal Telegram Bot. Telegram makes this incredibly easy.
           </p>
           <ol className="list-decimal list-inside text-[13px] text-gray-500 leading-loose space-y-2 ml-2">
              <li>Open Telegram and search for the user <strong>@BotFather</strong>.</li>
              <li>Send the message <code>/newbot</code>.</li>
              <li>Follow the prompts to choose a name and a unique username (ending in "bot").</li>
              <li>BotFather will reply with an API Token that looks something like <code>123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11</code>.</li>
              <li><strong>Copy this token.</strong> You will need it to log in.</li>
           </ol>
        </section>

        <section className="mb-14">
           <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
              <LinkIcon size={18} className="text-gray-400" /> 2. Getting Your Chat ID
           </h2>
           <p className="text-[13px] text-gray-500 leading-relaxed mb-4">
             Your bot needs to know exactly who to send messages to. Your "Chat ID" is your unique number on Telegram.
           </p>
           <ol className="list-decimal list-inside text-[13px] text-gray-500 leading-loose space-y-2 ml-2">
              <li>Open Telegram and search for <strong>@userinfobot</strong>.</li>
              <li>Click "Start" or send any message.</li>
              <li>It will reply with your ID, typically a 9 or 10 digit number like <code>123456789</code>.</li>
              <li><strong>Copy this ID.</strong></li>
           </ol>
        </section>

        <section className="mb-14">
           <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
              <Play size={18} className="text-gray-400" /> 3. Starting the Connection
           </h2>
           <p className="text-[13px] text-gray-500 leading-relaxed mb-4">
             Once you have both exactly right, head to the <Link href="/login" className="text-blue-500 hover:underline">Login Page</Link>. Paste them both in.
           </p>
           <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl mb-6">
              <p className="text-[13px] text-gray-900 font-medium mb-1">Critical Step!</p>
              <p className="text-[12px] text-gray-500 leading-relaxed">
                 You <strong>must</strong> open your new bot in Telegram and send it the <code>/start</code> message before it will be allowed to talk to you. Telegram strictly blocks bots from messaging users who haven't started them first.
              </p>
           </div>
        </section>

        <section className="mb-14">
           <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
              <RefreshCcw size={18} className="text-gray-400" /> 4. The 3-Phase Task System
           </h2>
           <p className="text-[13px] text-gray-500 leading-relaxed mb-4">
             UniSend tasks aren't passive lists; they are interactive.
           </p>
           <ul className="list-disc list-outside text-[13px] text-gray-500 leading-loose space-y-4 ml-6">
              <li><strong>Start:</strong> When a task's time triggers, your bot messages you every 30 seconds. You must visit the dashboard and click "Start" to quiet it. It records the exact time you began.</li>
              <li><strong>Mid-Check:</strong> Exactly halfway through the assigned duration (e.g., at 15 minutes of a 30-minute block), the bot wakes up again. Click "Mid-Check" to stay accountable.</li>
              <li><strong>Finish:</strong> When the total allocated time expires, the final alarm goes off until you mark the task "Done".</li>
           </ul>
        </section>
        
        <div className="mt-20 pt-10 border-t border-gray-100 w-full text-center">
           <p className="text-xs text-gray-400 font-medium mb-6">Have your Token and ID ready?</p>
           <Link href="/login">
             <Button className="h-10 px-8 rounded-xl text-sm font-semibold tracking-tight shadow-sm">
                Connect Bot Now
             </Button>
           </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
