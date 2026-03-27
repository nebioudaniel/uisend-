"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, Calendar, Clock } from "lucide-react";

export default function Home() {
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("telegramId")) {
      setIsLogged(true);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Small Nav */}
      <nav className="border-b border-gray-100 flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-sm font-medium text-gray-900">UniSend</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-xs text-gray-500 hover:text-gray-900">Features</Link>
          {isLogged ? (
            <Link href="/dashboard">
              <Button variant="default" size="sm" className="h-8 rounded-lg text-xs font-semibold">
                 Go to Dashboard
              </Button>
            </Link>
          ) : (
             <div className="flex items-center gap-2">
               <Link href="/login">
                 <Button variant="ghost" size="sm" className="h-8 rounded-lg text-xs font-medium">Log in</Button>
               </Link>
               <Link href="/login">
                 <Button variant="default" size="sm" className="h-8 rounded-lg text-xs font-semibold">Get Started</Button>
               </Link>
             </div>
          )}
        </div>
      </nav>

      {/* Hero Section - Smaller and Cleaner */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center max-w-2xl mx-auto w-full">
        <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 py-1 mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight leading-none">Telegram Integration</span>
        </div>
        
        <h1 className="text-3xl font-medium text-gray-900 leading-tight mb-4 tracking-tight">
           Your schedule, managed with ease.
        </h1>
        
        <p className="text-sm text-gray-400 mb-10 max-w-sm leading-relaxed">
           Plan tasks and receive intelligent reminders on Telegram until you confirm completion.
        </p>
        
        <div className="flex gap-2">
           <Link href="/login">
             <Button className="h-9 px-5 rounded-lg text-xs font-semibold flex items-center gap-2">
                Start Planning <ArrowRight size={14} />
             </Button>
           </Link>
           <Button variant="outline" className="h-9 px-5 rounded-lg text-xs font-semibold">
                Documentation
           </Button>
        </div>

        {/* Small Feature List - No big cards */}
        <div className="grid grid-cols-3 gap-8 mt-20 w-full">
           <div className="flex flex-col items-center text-center gap-3">
              <Bot size={18} className="text-gray-900" />
              <div className="space-y-1">
                 <h3 className="text-xs font-bold text-gray-900">Bot Driven</h3>
                 <p className="text-[11px] text-gray-400 leading-normal">Smart alerts every minute.</p>
              </div>
           </div>
           <div className="flex flex-col items-center text-center gap-3">
              <Clock size={18} className="text-gray-900" />
              <div className="space-y-1">
                 <h3 className="text-xs font-bold text-gray-900">Middle Checks</h3>
                 <p className="text-[11px] text-gray-400 leading-normal">Confirm during progress.</p>
              </div>
           </div>
           <div className="flex flex-col items-center text-center gap-3">
              <Calendar size={18} className="text-gray-900" />
              <div className="space-y-1">
                 <h3 className="text-xs font-bold text-gray-900">One Interface</h3>
                 <p className="text-[11px] text-gray-400 leading-normal">Setup in seconds.</p>
              </div>
           </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-gray-100 flex items-center justify-between px-6 py-6 mt-auto">
        <span className="text-[11px] text-gray-400 font-medium">UniSend © 2026</span>
        <div className="flex gap-6">
           <span className="text-[11px] font-bold text-gray-500 hover:text-gray-900 cursor-pointer">Privacy</span>
           <span className="text-[11px] font-bold text-gray-500 hover:text-gray-900 cursor-pointer">Support</span>
        </div>
      </footer>
    </div>
  );
}
