import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-gray-100 bg-white flex flex-col sm:flex-row items-center justify-between px-6 py-6 mt-auto">
      <div className="flex flex-col gap-1 items-center sm:items-start mb-4 sm:mb-0">
        <span className="text-[11px] text-gray-400 font-medium">UniSend © {new Date().getFullYear()}</span>
        <span className="text-[10px] text-gray-500 italic tracking-wide">"Learn more, build better"</span>
      </div>
      <div className="flex flex-col gap-1 items-center sm:items-end">
        <span className="text-xs font-semibold text-gray-900 tracking-tight">Developed by Nebiou Daniel</span>
        <div className="flex gap-4 mt-2">
           <Link href="/features" className="text-[11px] font-medium text-gray-500 hover:text-gray-900 transition-colors">Features</Link>
           <Link href="/docs" className="text-[11px] font-medium text-gray-500 hover:text-gray-900 transition-colors">Documentation</Link>
           <Link href="/how-it-was-built" className="text-[11px] font-medium text-gray-500 hover:text-gray-900 transition-colors">How I Built This</Link>
        </div>
      </div>
    </footer>
  );
}
