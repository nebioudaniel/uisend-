"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("telegramId")) {
      setIsLogged(true);
    }
  }, []);

  return (
    <nav className="border-b border-gray-100 flex items-center justify-between px-6 py-3 bg-white sticky top-0 z-50">
      <div className="flex items-center gap-2 cursor-pointer">
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <Link href="/" className="text-sm font-medium text-gray-900 tracking-tight hover:opacity-80">UniSend</Link>
      </div>
      <div className="flex items-center gap-6">
        <Link href="/features" className="text-xs text-gray-500 font-medium hover:text-gray-900 transition-colors">Features</Link>
        <Link href="/docs" className="text-xs text-gray-500 font-medium hover:text-gray-900 transition-colors">Docs</Link>
        <Link href="/how-it-was-built" className="text-xs text-gray-500 font-medium hover:text-gray-900 transition-colors hidden sm:block">How I Made This</Link>
        
        {isLogged ? (
          <Link href="/dashboard">
            <Button variant="default" size="sm" className="h-8 shadow-xs rounded-lg text-xs font-semibold px-4">
              Dashboard
            </Button>
          </Link>
        ) : (
           <div className="flex items-center gap-2">
             <Link href="/login">
               <Button variant="ghost" size="sm" className="h-8 rounded-lg text-xs font-medium px-4">Log in</Button>
             </Link>
             <Link href="/login">
               <Button variant="default" size="sm" className="h-8 shadow-xs rounded-lg text-xs font-semibold px-4">Get Started</Button>
             </Link>
           </div>
        )}
      </div>
    </nav>
  );
}
