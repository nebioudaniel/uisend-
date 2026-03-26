import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-sm font-medium text-gray-900">UniSend</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="text-xs text-gray-500 px-3 py-1.5 rounded-lg hover:bg-gray-50"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-800"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 py-1 mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span className="text-xs text-gray-500">
            Telegram · WhatsApp · Email
          </span>
        </div>
        <h1 className="text-3xl font-medium text-gray-900 leading-tight mb-3 max-w-sm">
          One place for all your messages
        </h1>
        <p className="text-sm text-gray-400 mb-8 max-w-xs leading-relaxed">
          Send to Telegram, WhatsApp, and Email at once. Simple, fast, unified.
        </p>
        <div className="flex gap-2">
          <Link
            href="/register"
            className="text-sm bg-gray-900 text-white px-5 py-2 rounded-lg hover:bg-gray-800"
          >
            Get started free
          </Link>
          <Link
            href="#features"
            className="text-sm border border-gray-200 text-gray-600 px-5 py-2 rounded-lg hover:bg-gray-50"
          >
            See how it works
          </Link>
        </div>

        {/* Features */}
        <div
          id="features"
          className="grid grid-cols-3 gap-3 mt-16 max-w-lg w-full"
        >
          {[
            {
              name: "Telegram",
              desc: "Connect your bot token",
              color: "bg-blue-50",
            },
            { name: "WhatsApp", desc: "Via Cloud API", color: "bg-green-50" },
            {
              name: "Email",
              desc: "SMTP or any provider",
              color: "bg-amber-50",
            },
          ].map((f) => (
            <div key={f.name} className={`${f.color} rounded-xl p-4 text-left`}>
              <p className="text-xs font-medium text-gray-800 mb-1">{f.name}</p>
              <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-4 flex items-center justify-between">
        <span className="text-xs text-gray-400">UniSend © 2025</span>
        <div className="flex gap-4">
          <span className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">
            Privacy
          </span>
          <span className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">
            Terms
          </span>
        </div>
      </footer>
    </div>
  );
}
