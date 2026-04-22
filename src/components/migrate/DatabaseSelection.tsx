import { Database, CheckSquare, Square, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";

type ColPreview = { name: string; collections: number; docs: number; existsInDestination?: boolean };
type Step = "idle" | "previewing" | "previewed" | "migrating" | "done";

interface DatabaseSelectionProps {
  preview: { collections: ColPreview[] } | null;
  step: Step;
  selectedDbs: Set<string>;
  allSelected: boolean;
  toggleAll: () => void;
  toggleDb: (name: string) => void;
  destinationUri: string;
  checkExistingDbs: () => void;
  existingDbs: string[];
}

export function DatabaseSelection({
  preview,
  step,
  selectedDbs,
  allSelected,
  toggleAll,
  toggleDb,
  destinationUri,
  checkExistingDbs,
  existingDbs
}: DatabaseSelectionProps) {
  // Check existing databases when destination URI is provided
  useEffect(() => {
    if (destinationUri && preview && step === "previewed" && existingDbs.length === 0) {
      checkExistingDbs();
    }
  }, [destinationUri, preview?.collections?.length, step]);

  if (!preview || step === "done") return null;

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden mb-4">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#30363d]">
        <div className="flex items-center gap-3">
          <Database size={15} className="text-[#00ED64]" />
          <span className="text-sm font-semibold text-white">Select Databases to Migrate</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-[#00ED64]/10 text-[#00ED64] border-[#00ED64]/20 text-xs">
            {selectedDbs.size} / {preview.collections.length} selected
          </Badge>
          {existingDbs.length > 0 && (
            <Badge className="bg-orange-400/10 text-orange-400 border-orange-400/20 text-xs">
              {existingDbs.length} already exist
            </Badge>
          )}
        </div>
      </div>

      {/* Select All */}
      <div
        onClick={toggleAll}
        className="flex items-center justify-between px-6 py-3 bg-[#0d1117] border-b border-[#21262d] cursor-pointer hover:bg-[#1c2128] transition-colors group"
      >
        <div className="flex items-center gap-3">
          {allSelected
            ? <CheckSquare size={16} className="text-[#00ED64] flex-shrink-0" />
            : <Square size={16} className="text-[#4a5568] group-hover:text-[#8a9bb0] transition-colors flex-shrink-0" />
          }
          <span className="text-xs font-semibold text-[#8a9bb0] group-hover:text-white transition-colors select-none uppercase tracking-wider">
            {allSelected ? "Deselect All" : "Select All"}
          </span>
        </div>
        <span className="text-xs text-[#8a9bb0]">
          {preview.collections.reduce((s, c) => s + (c.docs ?? 0), 0).toLocaleString()} total documents
        </span>
      </div>

      {/* DB List */}
      <div className="divide-y divide-[#21262d] max-h-72 overflow-y-auto database-list-scrollbar">
        {preview.collections.map((db, i) => {
          const checked = selectedDbs.has(db.name);
          const exists = db.existsInDestination;
          return (
            <div
              key={`${db.name}-${i}`}
              onClick={() => toggleDb(db.name)}
              className={`cursor-pointer transition-all ${
                checked ? "bg-[#0d2818]/60 hover:bg-[#0f3020]/70" : "hover:bg-[#1c2128]"
              }`}
            >
              {/* Mobile Layout - Stacked */}
              <div className="flex sm:hidden items-start px-4 py-4">
                <div className="flex items-center gap-3 mt-0.5">
                  {checked
                    ? <CheckSquare size={16} className="text-[#00ED64]/80 flex-shrink-0" />
                    : <Square size={16} className="text-[#4a5568] flex-shrink-0" />
                  }
                  <Database size={15} className={checked ? "text-[#00ED64]/70 flex-shrink-0" : "text-[#8a9bb0] flex-shrink-0"} />
                </div>
                <div className="flex-1 min-w-0 ml-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white truncate" title={db.name}>
                      {db.name}
                    </span>
                    {exists && (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <AlertTriangle size={12} className="text-orange-400" />
                        <Badge className="bg-orange-400/10 text-orange-400 border-orange-400/20 text-xs px-1.5 py-0.5">
                          Already exists
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-[#8a9bb0] mt-1">
                    {db.collections} collections • {(db.docs ?? 0).toLocaleString()} docs
                  </div>
                </div>
              </div>

              {/* Desktop Layout - Horizontal */}
              <div className="hidden sm:flex items-center justify-between px-6 py-3.5">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {checked
                    ? <CheckSquare size={16} className="text-[#00ED64]/80 flex-shrink-0" />
                    : <Square size={16} className="text-[#4a5568] flex-shrink-0" />
                  }
                  <Database size={15} className={checked ? "text-[#00ED64]/70 flex-shrink-0" : "text-[#8a9bb0] flex-shrink-0"} />
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-sm font-medium text-white truncate max-w-[200px]" title={db.name}>
                      {db.name}
                    </span>
                    {exists && (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <AlertTriangle size={12} className="text-orange-400" />
                        <Badge className="bg-orange-400/10 text-orange-400 border-orange-400/20 text-xs px-1.5 py-0.5">
                          Already exists
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-6 text-xs text-[#8a9bb0] flex-shrink-0">
                  <span className="w-24 text-right">{db.collections} {db.collections === 1 ? "collection" : "collections"}</span>
                  <span className="w-24 text-right">{(db.docs ?? 0).toLocaleString()} {(db.docs ?? 0) === 1 ? "document" : "documents"}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}