type Step = "idle" | "previewing" | "previewed" | "migrating" | "done";

const STEPS = ["Connect", "Select", "Migrate", "Done"];

interface StepIndicatorProps {
  step: Step;
}

export function StepIndicator({ step }: StepIndicatorProps) {
  const stepIndex = { idle: 0, previewing: 0, previewed: 1, migrating: 2, done: 3 }[step];

  return (
    <div className="flex items-center justify-center gap-0 mb-10 select-none">
      {STEPS.map((s, i) => (
        <div key={s} className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
              i < stepIndex ? "bg-[#00ED64] border-[#00ED64] text-[#0d1117]"
              : i === stepIndex ? "border-[#00ED64] text-[#00ED64] bg-transparent"
              : "border-[#30363d] text-[#4a5568] bg-transparent"
            }`}>
              {i < stepIndex ? (
                <svg width="12" height="12" viewBox="0 0 10 10" fill="none">
                  <path d="M1.5 5L4 7.5L8.5 2.5" stroke="#0d1117" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : i + 1}
            </div>
            <span className={`text-[10px] ${i === stepIndex ? "text-[#00ED64]" : i < stepIndex ? "text-[#8a9bb0]" : "text-[#4a5568]"}`}>{s}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`w-16 h-px mx-1 mb-4 transition-all ${i < stepIndex ? "bg-[#00ED64]" : "bg-[#30363d]"}`} />
          )}
        </div>
      ))}
    </div>
  );
}