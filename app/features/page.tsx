import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Copy, KeyRound, MessageSquareCode, Settings2, Smartphone, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SiteHeader />

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-16">
        <div className="mb-12">
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight mb-3">Capabilities</h1>
          <p className="text-sm text-gray-500 leading-relaxed max-w-lg">
            Simple tools designed to keep you focused. No endless email threads, no clunky mobile apps. Just you, your planner, and Telegram.
          </p>
        </div>

        <div className="grid gap-12">
          {/* Feature 1 */}
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-12 h-12 shrink-0 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
               <MessageSquareCode size={20} className="text-indigo-600" />
            </div>
            <div>
               <h2 className="text-base font-semibold text-gray-900 mb-2">Telegram First Notifications</h2>
               <p className="text-[13px] text-gray-500 leading-relaxed mb-4">
                 Unlike traditional planners that rely on easy-to-ignore emails or browser pushes, UniSend hooks directly into your Telegram account. The bot personally messages you at exactly the right time, making it impossible to overlook.
               </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-12 h-12 shrink-0 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
               <Settings2 size={20} className="text-emerald-600" />
            </div>
            <div>
               <h2 className="text-base font-semibold text-gray-900 mb-2">3-Stage Verification</h2>
               <p className="text-[13px] text-gray-500 leading-relaxed mb-4">
                 UniSend doesn't just remind you once. It demands engagement. Tasks have a dedicated "Start", "Mid-Check", and "Finish" phase. If you don't return to the dashboard to confirm, the bot will continue checking in with you every 30 seconds.
               </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-12 h-12 shrink-0 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center">
               <Smartphone size={20} className="text-rose-600" />
            </div>
            <div>
               <h2 className="text-base font-semibold text-gray-900 mb-2">Beautiful Dashboard</h2>
               <p className="text-[13px] text-gray-500 leading-relaxed mb-4">
                 Built using the minimalist Shadcn UI framework, your dashboard gives you an instant overview of all active, pending, and completed phases for the day. Live refresh ensures you're always looking at real-time data.
               </p>
            </div>
          </div>
          
          {/* Feature 4 */}
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-12 h-12 shrink-0 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center">
               <ShieldCheck size={20} className="text-amber-600" />
            </div>
            <div>
               <h2 className="text-base font-semibold text-gray-900 mb-2">Precision Ticking</h2>
               <p className="text-[13px] text-gray-500 leading-relaxed mb-4">
                 With state-of-the-art absolute timezone synchronization, your tasks are stored using raw Unix epochs. This means perfect delivery, whether you're working locally in Addis Ababa or traveling across the world.
               </p>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-10 border-t border-gray-100 w-full text-center">
           <p className="text-xs text-gray-400 font-medium mb-6">Ready to take control of your time?</p>
           <Link href="/login">
             <Button className="h-10 px-8 rounded-xl text-sm font-semibold tracking-tight shadow-sm">
                Get Started
             </Button>
           </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
