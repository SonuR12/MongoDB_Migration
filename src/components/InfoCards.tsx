import { ShieldCheck, Zap, Target } from "lucide-react";

export function InfoCards() {
  const cards = [
    { icon: <ShieldCheck size={20} className="text-[#00ED64]" />, title: "Secure", desc: "Credentials never stored or logged" },
    { icon: <Zap size={20} className="text-[#00ED64]" />, title: "Fast", desc: "Direct driver connection, no middleman" },
    { icon: <Target size={20} className="text-[#00ED64]" />, title: "Selective", desc: "Choose exactly which databases to migrate" },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 mt-6">
      {cards.map((card) => (
        <div key={card.title} className="bg-[#161b22] border border-[#21262d] rounded-xl p-4 text-center">
          <div className="flex justify-center mb-2">{card.icon}</div>
          <p className="text-xs font-semibold text-white mb-1">{card.title}</p>
          <p className="text-[11px] text-[#4a5568]">{card.desc}</p>
        </div>
      ))}
    </div>
  );
}