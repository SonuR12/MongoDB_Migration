import { ArrowLeft, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Step = "idle" | "previewing" | "previewed" | "migrating" | "done";
type ColResult = { collection: string; docsMigrated: number };

interface MigrationResultsProps {
  step: Step;
  results: { results: ColResult[] } | null;
  totalDocs: number;
  migrateMore: () => void;
  reset: () => void;
}

export function MigrationResults({
  step,
  results,
  totalDocs,
  migrateMore,
  reset
}: MigrationResultsProps) {
  if (step !== "done" || !results) return null;

  return (
    <div className="bg-[#161b22] border border-[#00ED64]/40 rounded-2xl overflow-hidden mb-4">
      {/* Success header */}
      <div className="px-6 py-5 bg-gradient-to-r from-[#0d2818] to-[#161b22] border-b border-[#21262d]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#00ED64]/20 border border-[#00ED64]/40 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8L6.5 11.5L13 4.5" stroke="#00ED64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-[#00ED64]">Migration Complete</p>
              <p className="text-xs text-[#8a9bb0]">{results.results.length} collections · {totalDocs.toLocaleString()} documents</p>
            </div>
          </div>
          <Badge className="bg-[#00ED64]/10 text-[#00ED64] border-[#00ED64]/20">Success</Badge>
        </div>
      </div>

      {/* Collection results */}
      <div className="divide-y divide-[#21262d] max-h-64 overflow-y-auto">
        {results.results.map((r) => (
          <div key={r.collection} className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-2">
              <svg width="12" height="12" viewBox="0 0 10 10" fill="none">
                <path d="M1.5 5L4 7.5L8.5 2.5" stroke="#00ED64" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-sm text-white font-mono">{r.collection}</span>
            </div>
            <Badge className="bg-[#21262d] text-[#8a9bb0] border-[#30363d] text-xs">
              {r.docsMigrated.toLocaleString()} docs
            </Badge>
          </div>
        ))}
      </div>

      <div className="px-6 py-4 border-t border-[#21262d] flex items-center justify-between gap-3">
        <button
          onClick={migrateMore}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#30363d] text-xs text-[#8a9bb0] hover:text-white hover:border-[#8a9bb0] transition-colors font-semibold"
        >
          <ArrowLeft size={13} />
          Migrate Other Databases
        </button>
        <button
          onClick={reset}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00ED64]/10 border border-[#00ED64]/30 text-xs text-[#00ED64] hover:bg-[#00ED64]/20 transition-colors font-semibold"
        >
          <RotateCcw size={13} />
          New Migration
        </button>
      </div>
    </div>
  );
}