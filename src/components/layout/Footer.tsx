import { Globe, Shield, Smartphone, Zap } from "lucide-react";

const FOOTER_ITEMS = [
  { icon: Shield, title: "Secure & Trusted", desc: "End-to-end encryption & data protection" },
  { icon: Smartphone, title: "PWA Ready", desc: "Install on any device & work offline" },
  { icon: Zap, title: "Lightning Fast", desc: "Powered by WebAssembly" },
  { icon: Globe, title: "Enterprise Grade", desc: "Scalable, reliable & secure" },
];

export function Footer() {
  return (
    <footer className="mt-auto shrink-0 bg-brand-950 px-6 py-5">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FOOTER_ITEMS.map((item) => (
          <div key={item.title} className="flex items-start gap-3">
            <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
            <div>
              <p className="text-sm font-semibold text-white">{item.title}</p>
              <p className="mt-0.5 text-xs text-emerald-200/70">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </footer>
  );
}
