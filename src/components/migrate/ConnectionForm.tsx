import { Eye } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Spinner } from "@/components/Spinner";

type Step = "idle" | "previewing" | "previewed" | "migrating" | "done";

interface ConnectionFormProps {
  sourceUri: string;
  setSourceUri: (uri: string) => void;
  destinationUri: string;
  setDestinationUri: (uri: string) => void;
  step: Step;
  preview: { collections: any[] } | null;
  handlePreview: () => void;
  setStep: (step: Step) => void;
  setPreview: (preview: any) => void;
  setSelectedDbs: (dbs: Set<string>) => void;
  setError: (error: string | null) => void;
  children?: React.ReactNode;
}

export function ConnectionForm({
  sourceUri,
  setSourceUri,
  destinationUri,
  setDestinationUri,
  step,
  preview,
  handlePreview,
  setStep,
  setPreview,
  setSelectedDbs,
  setError,
  children
}: ConnectionFormProps) {
  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden shadow-2xl mb-4">
      {/* Source */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded-full bg-[#00ED64]/10 border border-[#00ED64]/30 flex items-center justify-center">
            <span className="text-[#00ED64] text-[10px] font-bold">S</span>
          </div>
          <label className="text-xs font-semibold text-[#00ED64] uppercase tracking-widest">Source MongoDB Cluster</label>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-[#4a5568] cursor-help text-xs ml-1">ⓘ</span>
            </TooltipTrigger>
            <TooltipContent className="bg-[#161b22] border-[#30363d] text-white text-xs max-w-xs">
              Your old MongoDB cluster connection string. Found in Atlas → Connect → Drivers.
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="mongodb+srv://user:pass@old-cluster.mongodb.net"
            value={sourceUri}
            onChange={(e) => { 
              setSourceUri(e.target.value); 
              setStep("idle"); 
              setPreview(null); 
              setSelectedDbs(new Set()); 
              setError(null); 
            }}
            className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-3 text-sm text-white placeholder-[#4a5568] focus:outline-none focus:border-[#00ED64] transition-colors font-mono"
          />
          <button
            onClick={handlePreview}
            disabled={!sourceUri || step === "previewing" || step === "migrating"}
            className="px-5 py-3 bg-[#21262d] border border-[#30363d] rounded-lg text-xs text-[#00ED64] font-semibold whitespace-nowrap flex items-center gap-2 enabled:hover:bg-[#30363d] transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            {step === "previewing" ? <><Spinner /> Connecting...</> : <><Eye size={13} /> Preview</>}
          </button>
        </div>
        {step === "previewing" && (
          <div className="mt-3 p-3 bg-[#0d1117] border border-[#30363d] rounded-lg">
            <div className="flex items-start gap-2">
              <Spinner />
              <div>
                <p className="text-xs text-[#00ED64] font-medium mb-1">Analyzing your database...</p>
                <p className="text-xs text-[#8a9bb0] leading-relaxed">
                  This may take a moment for large databases or clusters with many collections. 
                  We're counting documents and analyzing your data structure.
                </p>
              </div>
            </div>
          </div>
        )}
        {preview && (
          <div className="mt-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ED64]" />
            <span className="text-xs text-[#00ED64]">Connected · {preview.collections.length} databases found</span>
          </div>
        )}
      </div>

      <Separator className="bg-[#21262d]" />

      {/* Destination */}
      <div className="p-6 pt-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
            <span className="text-blue-400 text-[10px] font-bold">D</span>
          </div>
          <label className="text-xs font-semibold text-blue-400 uppercase tracking-widest">Destination MongoDB Cluster</label>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-[#4a5568] cursor-help text-xs ml-1">ⓘ</span>
            </TooltipTrigger>
            <TooltipContent className="bg-[#161b22] border-[#30363d] text-white text-xs max-w-xs">
              Your new MongoDB cluster where data will be copied to.
            </TooltipContent>
          </Tooltip>
        </div>
        <input
          type="text"
          placeholder="mongodb+srv://user:pass@new-cluster.mongodb.net"
          value={destinationUri}
          onChange={(e) => setDestinationUri(e.target.value)}
          className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-3 text-sm text-white placeholder-[#4a5568] focus:outline-none focus:border-blue-500 transition-colors font-mono"
        />
      </div>
      
      {children}
    </div>
  );
}