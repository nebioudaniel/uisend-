"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { connectTelegram } from "@/app/actions";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Send, Key, User } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [inputTgId, setInputTgId] = useState("");
  const [inputBotToken, setInputBotToken] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputTgId || !inputBotToken) return toast.error("Enter both Bot Token and Chat ID");
    
    setLoading(true);
    const res = await connectTelegram(inputBotToken, inputTgId);
    
    if (res.success) {
      localStorage.setItem("telegramId", inputTgId);
      localStorage.setItem("botToken", inputBotToken);
      toast.success("Connected successfully");
      router.push("/dashboard");
    } else {
      toast.error(res.error || "Login Failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <nav className="border-b border-gray-100 px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-sm font-medium text-gray-900 tracking-tight">UniSend</span>
        </Link>
        <Link href="/" className="text-xs text-gray-500 hover:text-gray-900 border border-gray-100 rounded-lg px-2.5 py-1.5 font-medium transition-all">Back</Link>
      </nav>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-10 text-center">
             <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50/50 mb-6 text-blue-600">
                <Send size={24} />
             </div>
             <h1 className="text-xl font-medium text-gray-900 mb-2">Login to UniSend</h1>
             <p className="text-sm text-gray-400">Enter your Telegram credentials to access dashboard</p>
          </div>
          
          <form onSubmit={handleConnect} className="flex flex-col gap-6">
            <div className="space-y-4">
               <div>
                  <div className="flex items-center gap-2 mb-2 ml-1">
                     <Key size={12} className="text-gray-400" />
                     <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Bot Token</label>
                  </div>
                  <input 
                    type="password" 
                    value={inputBotToken} 
                    onChange={(e) => setInputBotToken(e.target.value)} 
                    placeholder="110201543:AAHdq..." 
                    className="w-full border border-gray-200 rounded-xl px-4 h-11 text-xs focus:outline-none focus:border-gray-400 bg-white transition-all font-medium"
                    required
                  />
                  <p className="text-[10px] text-blue-400 mt-2 ml-1">Get token from <a href="https://t.me/botfather" target="_blank" className="font-bold hover:underline">@BotFather</a></p>
               </div>
               
               <div>
                  <div className="flex items-center gap-2 mb-2 ml-1">
                     <User size={12} className="text-gray-400" />
                     <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block font-bold">Your Chat ID</label>
                  </div>
                  <input 
                    type="text" 
                    value={inputTgId} 
                    onChange={(e) => setInputTgId(e.target.value)} 
                    placeholder="123456789" 
                    className="w-full border border-gray-200 rounded-xl px-4 h-11 text-xs focus:outline-none focus:border-gray-400 bg-white transition-all font-medium"
                    required
                  />
                   <p className="text-[10px] text-blue-400 mt-2 ml-1">Get ID from <a href="https://t.me/userinfobot" target="_blank" className="font-bold hover:underline">@userinfobot</a></p>
               </div>
            </div>

            <Button 
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl text-xs font-bold transition-all active:scale-95"
            >
              {loading ? "Authenticating..." : "Connect Account"}
            </Button>
          </form>

          <footer className="mt-12 text-center text-[10px] text-gray-400 font-medium">
             By logging in, you agree to our <span className="text-gray-900 underline cursor-pointer">Terms of Service</span>
          </footer>
        </div>
      </main>
    </div>
  );
}
