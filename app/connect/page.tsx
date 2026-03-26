"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

type Channel = "telegram" | "whatsapp" | "email";

type ConnectionState = {
  telegram: { token: string; connected: boolean };
  whatsapp: { token: string; connected: boolean };
  email: {
    host: string;
    port: string;
    user: string;
    pass: string;
    connected: boolean;
  };
};

export default function ConnectPage() {
  const router = useRouter();
  const [open, setOpen] = useState<Channel | null>(null);
  const [loading, setLoading] = useState<Channel | null>(null);
  const [state, setState] = useState<ConnectionState>({
    telegram: { token: "", connected: false },
    whatsapp: { token: "", connected: false },
    email: { host: "", port: "587", user: "", pass: "", connected: false },
  });

  async function connect(channel: Channel) {
    setLoading(channel);
    await new Promise((r) => setTimeout(r, 1000));

    setState((prev) => ({
      ...prev,
      [channel]: { ...prev[channel], connected: true },
    }));

    toast.success(
      `${channel.charAt(0).toUpperCase() + channel.slice(1)} connected!`,
    );
    setOpen(null);
    setLoading(null);
  }

  const allConnected = Object.values(state).some((s) => s.connected);

  const channels = [
    {
      id: "telegram" as Channel,
      name: "Telegram",
      desc: "Connect via Bot Token",
      iconBg: "#E6F1FB",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#185FA5">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-2.04 9.61c-.148.658-.54.818-1.095.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.215-3.053 5.56-5.023c.242-.215-.052-.334-.373-.12L7.48 14.48 4.53 13.56c-.65-.203-.663-.65.136-.962l10.87-4.19c.54-.195 1.012.133.836.84z" />
        </svg>
      ),
      fields: (
        <div>
          <label className="text-xs text-gray-500 block mb-1">Bot Token</label>
          <input
            value={state.telegram.token}
            onChange={(e) =>
              setState((p) => ({
                ...p,
                telegram: { ...p.telegram, token: e.target.value },
              }))
            }
            placeholder="110201543:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
          />
          <p className="text-xs text-gray-400 mt-2">
            Get a token from{" "}
            <a
              href="https://t.me/botfather"
              target="_blank"
              className="text-blue-500 hover:underline"
            >
              @BotFather
            </a>{" "}
            on Telegram
          </p>
        </div>
      ),
    },
    {
      id: "whatsapp" as Channel,
      name: "WhatsApp",
      desc: "Connect via Cloud API",
      iconBg: "#EAF3DE",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#3B6D11">
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.137.564 4.14 1.548 5.873L0 24l6.313-1.524A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm6.062 16.429c-.252.708-1.47 1.35-2.03 1.406-.52.05-1.01.243-3.404-.71-2.86-1.14-4.68-4.08-4.82-4.27-.14-.19-1.14-1.52-1.14-2.9 0-1.38.72-2.06 1-2.34.25-.26.55-.32.73-.32l.52.01c.17.008.39-.065.61.46.23.55.79 1.93.86 2.07.07.14.11.3.02.49-.09.19-.14.31-.27.47-.14.17-.29.37-.41.5-.14.14-.28.3-.12.58.16.28.71 1.17 1.53 1.9 1.05.93 1.94 1.22 2.22 1.36.28.14.44.12.6-.07.17-.19.71-.83.9-1.12.19-.28.38-.23.64-.14.26.09 1.65.78 1.93.92.28.14.47.21.54.32.07.12.07.68-.18 1.39z" />
        </svg>
      ),
      fields: (
        <div>
          <label className="text-xs text-gray-500 block mb-1">API Token</label>
          <input
            value={state.whatsapp.token}
            onChange={(e) =>
              setState((p) => ({
                ...p,
                whatsapp: { ...p.whatsapp, token: e.target.value },
              }))
            }
            placeholder="Your WhatsApp Cloud API token"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
          />
          <p className="text-xs text-gray-400 mt-2">
            Get from{" "}
            <a
              href="https://developers.facebook.com"
              target="_blank"
              className="text-blue-500 hover:underline"
            >
              Meta Developer Console
            </a>
          </p>
        </div>
      ),
    },
    {
      id: "email" as Channel,
      name: "Email",
      desc: "Connect via SMTP",
      iconBg: "#FAEEDA",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#BA7517">
          <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
        </svg>
      ),
      fields: (
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500 block mb-1">
                SMTP Host
              </label>
              <input
                value={state.email.host}
                onChange={(e) =>
                  setState((p) => ({
                    ...p,
                    email: { ...p.email, host: e.target.value },
                  }))
                }
                placeholder="smtp.gmail.com"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Port</label>
              <input
                value={state.email.port}
                onChange={(e) =>
                  setState((p) => ({
                    ...p,
                    email: { ...p.email, port: e.target.value },
                  }))
                }
                placeholder="587"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Email</label>
            <input
              value={state.email.user}
              onChange={(e) =>
                setState((p) => ({
                  ...p,
                  email: { ...p.email, user: e.target.value },
                }))
              }
              placeholder="you@gmail.com"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">
              App Password
            </label>
            <input
              type="password"
              value={state.email.pass}
              onChange={(e) =>
                setState((p) => ({
                  ...p,
                  email: { ...p.email, pass: e.target.value },
                }))
              }
              placeholder="••••••••••••"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <nav className="border-b border-gray-100 px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-sm font-medium text-gray-900">UniSend</span>
        </Link>
        {allConnected && (
          <button
            onClick={() => router.push("/dashboard")}
            className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-800"
          >
            Go to dashboard
          </button>
        )}
      </nav>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <h1 className="text-lg font-medium text-gray-900 mb-1">
            Connect your channels
          </h1>
          <p className="text-xs text-gray-400 mb-6">
            Link the platforms you want to send from
          </p>

          <div className="flex flex-col gap-3">
            {channels.map((ch) => {
              const isConnected = state[ch.id].connected;
              const isOpen = open === ch.id;

              return (
                <div
                  key={ch.id}
                  className="border border-gray-200 rounded-xl overflow-hidden"
                >
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: ch.iconBg }}
                      >
                        {ch.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {ch.name}
                        </p>
                        <p className="text-xs text-gray-400">{ch.desc}</p>
                      </div>
                    </div>
                    {isConnected ? (
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span className="text-xs text-green-600">
                          Connected
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => setOpen(isOpen ? null : ch.id)}
                        className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50"
                      >
                        {isOpen ? "Cancel" : "Connect"}
                      </button>
                    )}
                  </div>

                  {isOpen && (
                    <div className="border-t border-gray-100 p-4 bg-gray-50 flex flex-col gap-3">
                      {ch.fields}
                      <button
                        onClick={() => connect(ch.id)}
                        disabled={loading === ch.id}
                        className="bg-gray-900 text-white text-xs py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
                      >
                        {loading === ch.id
                          ? "Connecting..."
                          : `Connect ${ch.name}`}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-xs text-gray-400 text-center mt-6">
            You can always add more channels later in settings
          </p>
        </div>
      </main>
    </div>
  );
}
