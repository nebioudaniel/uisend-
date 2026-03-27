import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Database, FileTerminal, Network, ServerCrash, Shapes, LayoutDashboard } from "lucide-react";

export default function HowItWasBuiltPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SiteHeader />

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-16">
        <div className="mb-14">
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight mb-3">How I Built This</h1>
          <p className="text-sm text-gray-500 leading-relaxed max-w-lg">
            A deeper look under the hood at the technologies powering UniSend.
          </p>
        </div>

        <section className="mb-14">
           <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Shapes size={18} className="text-gray-400" /> Introduction
           </h2>
           <p className="text-[13px] text-gray-500 leading-relaxed mb-6">
             UniSend was born out of a simple need: standard reminder apps were too easy to dismiss or ignore. I wanted a personal assistant that actively followed up via a platform I checked constantly—Telegram. Here's a breakdown of the core stack that brings it together:
           </p>
        </section>

        <section className="mb-14">
           <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <LayoutDashboard size={18} className="text-gray-400" /> Frontend
           </h2>
           <p className="text-[13px] text-gray-500 leading-relaxed mb-4">
             The user interface is completely built using <strong>Next.js 15 (App Router)</strong> and highly customized via <strong>React 19</strong>. To keep styling clean and minimal, I decided against bulky libraries and opted for <strong>Tailwind CSS</strong> combined with precision headless components from <strong>Shadcn UI</strong>.
           </p>
           <p className="text-[13px] text-gray-500 leading-relaxed mb-4">
             This approach guarantees a lightweight interface, fluid animations, and a professional look that relies entirely on structural borders, micro-interactions, and carefully curated colors rather than drop-shadow overkill.
           </p>
        </section>

        <section className="mb-14">
           <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <ServerCrash size={18} className="text-gray-400" /> Backend Engine
           </h2>
           <p className="text-[13px] text-gray-500 leading-relaxed mb-4">
             The notification heartbeat relies on Next.js <strong>Server Actions</strong> and a dedicated API route (`/api/planner/ping`). The ping route checks active tasks and measures precise math-based UNIX epoch delays.
           </p>
           <p className="text-[13px] text-gray-500 leading-relaxed mb-4">
             By separating the client-side rendering from the notification engine, UniSend ensures that your 30-second reminder intervals don't freeze the client's experience or get blocked by the browser. 
           </p>
        </section>

        <section className="mb-14">
           <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Database size={18} className="text-gray-400" /> Database & Timezone Management
           </h2>
           <p className="text-[13px] text-gray-500 leading-relaxed mb-4">
             Managing state for thousands of precise active timers required a scalable database. The application uses <strong>Neon Database (Serverless Postgres)</strong> connected via the highly robust <strong>Prisma ORM</strong> HTTP adapter.
           </p>
           <p className="text-[13px] text-gray-500 leading-relaxed mb-4">
             To solve complex geographic timezone tracking across different servers and client machines (especially in unique localizations like Ethiopian Time), every task's creation and duration was stripped entirely from calendar objects, serialized into absolute raw millisecond integers, and pinned globally to UTC endpoints on the Vercel architecture. This guarantees flawless accuracy when it rings.
           </p>
        </section>
        
        <section className="mb-14">
           <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Network size={18} className="text-gray-400" /> Telegram Integration
           </h2>
           <p className="text-[13px] text-gray-500 leading-relaxed mb-4">
             The entire reminder system pushes to the official <strong>Telegram Bot API</strong> over secure HTTPS requests. We built a specific verification and connection step required on login to ensure a direct pipeline from the Next.js backend payload straight to the user's pocket application.
           </p>
        </section>
        
      </main>

      <SiteFooter />
    </div>
  );
}
