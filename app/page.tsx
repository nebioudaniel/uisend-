"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, Calendar, Clock, Code, FileText, Zap } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SiteHeader />

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center max-w-2xl mx-auto w-full">
        <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 py-1 mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight leading-none">Telegram Integration</span>
        </div>
        
        <h1 className="text-4xl font-semibold text-gray-900 leading-tight mb-4 tracking-tight max-w-lg">
           Your schedule, managed with ease.
        </h1>
        
        <p className="text-sm text-gray-400 mb-10 max-w-sm leading-relaxed font-medium">
           Plan tasks and receive intelligent reminders on Telegram until you confirm completion. Never miss a deadline again.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3">
           <Link href="/login">
             <Button className="h-10 px-6 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm">
                Start Planning <ArrowRight size={15} />
             </Button>
           </Link>
           <Link href="/features">
             <Button variant="outline" className="h-10 px-6 rounded-xl text-sm font-semibold border-gray-200">
                Explore Features
             </Button>
           </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 mt-24 w-full">
           <div className="flex flex-col items-center text-center gap-3 p-4 rounded-3xl bg-gray-50/50 border border-gray-50">
              <Bot size={20} className="text-indigo-600" />
              <div className="space-y-1">
                 <h3 className="text-xs font-bold text-gray-900 tracking-tight">Bot Driven</h3>
                 <p className="text-[11px] text-gray-500 leading-normal">Smart alerts delivered right to your chat.</p>
              </div>
           </div>
           <div className="flex flex-col items-center text-center gap-3 p-4 rounded-3xl bg-gray-50/50 border border-gray-50">
              <Clock size={20} className="text-emerald-600" />
              <div className="space-y-1">
                 <h3 className="text-xs font-bold text-gray-900 tracking-tight">Middle Checks</h3>
                 <p className="text-[11px] text-gray-500 leading-normal">Confirm tasks halfway through progress.</p>
              </div>
           </div>
           <div className="flex flex-col items-center text-center gap-3 p-4 rounded-3xl bg-gray-50/50 border border-gray-50 col-span-2 sm:col-span-1">
              <Calendar size={20} className="text-rose-600" />
              <div className="space-y-1">
                 <h3 className="text-xs font-bold text-gray-900 tracking-tight">One Interface</h3>
                 <p className="text-[11px] text-gray-500 leading-normal">Dashboard to see it all.</p>
              </div>
           </div>
        </div>

        <div className="mt-20 pt-10 border-t border-dashed border-gray-200 w-full flex flex-col items-center gap-4">
           <div className="flex gap-4">
             <Link href="/how-it-was-built">
               <Button variant="ghost" className="h-8 px-4 rounded-lg text-xs font-bold text-gray-400 hover:text-gray-900">
                 <Code size={14} className="mr-2" /> How I Built This
               </Button>
             </Link>
             <Link href="/docs">
               <Button variant="ghost" className="h-8 px-4 rounded-lg text-xs font-bold text-gray-400 hover:text-gray-900">
                 <FileText size={14} className="mr-2" /> Documentation
               </Button>
             </Link>
           </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
