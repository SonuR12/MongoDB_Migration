import { ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/Spinner";

type Step = "idle" | "previewing" | "previewed" | "migrating" | "done";
type ColResult = { collection: string; docsMigrated: number };
type ColPreview = { name: string; collections: number; docs: number; existsInDestination?: boolean };

interface MigrateButtonProps {
  sourceUri: string;
  destinationUri: string;
  step: Step;
  selectedDbs: Set<string>;
  results: { results: ColResult[] } | null;
  totalDocs: number;
  handleMigrate: () => void;
  preview: { collections: ColPreview[] } | null;
  isSameCluster?: boolean;
}

export function MigrateButton({
  sourceUri,
  destinationUri,
  step,
  selectedDbs,
  results,
  totalDocs,
  handleMigrate,
  preview,
  isSameCluster = false
}: MigrateButtonProps) {
  // Calculate existing vs new databases
  const selectedDbsArray = Array.from(selectedDbs);
  const existingSelected = selectedDbsArray.filter(dbName => 
    preview?.collections.find(c => c.name === dbName)?.existsInDestination
  );
  const newSelected = selectedDbsArray.filter(dbName => 
    !preview?.collections.find(c => c.name === dbName)?.existsInDestination
  );
  
  const getButtonText = () => {
    if (isSameCluster) return "Cannot migrate to same cluster";
    if (selectedDbs.size === 0) return "Select databases to migrate";
    
    const existingCount = existingSelected.length;
    const newCount = newSelected.length;
    const totalCount = selectedDbs.size;
    
    if (existingCount > 0 && newCount === 0) {
      // Only existing databases selected
      return `Overwrite ${existingCount} database${existingCount > 1 ? "s" : ""}`;
    } else if (existingCount === 0 && newCount > 0) {
      // Only new databases selected
      return `Migrate ${newCount} database${newCount > 1 ? "s" : ""}`;
    } else if (existingCount > 0 && newCount > 0) {
      // Mix of existing and new databases
      return `Migrate ${newCount} + Overwrite ${existingCount}`;
    } else {
      // Fallback
      return `Migrate ${totalCount} database${totalCount > 1 ? "s" : ""}`;
    }
  };
  return (
    <>
      <Separator className="bg-[#21262d]" />
      <div className="p-6 pt-4">
        <button
          onClick={handleMigrate}
          disabled={!sourceUri || !destinationUri || step === "migrating" || step === "previewing" || step === "done" || selectedDbs.size === 0 || isSameCluster}
          className={`w-full font-bold py-3.5 rounded-xl transition-all text-sm tracking-wide flex items-center justify-center gap-1.5 shadow-lg ${
            isSameCluster 
              ? 'bg-red-500/20 text-red-400 border border-red-500/30 cursor-not-allowed' 
              : 'bg-[#00ED64] text-[#0d1117] shadow-[#00ED64]/10 enabled:hover:bg-[#00c853] disabled:bg-[#00684A] disabled:pointer-events-none'
          }`}
        >
          {step === "migrating" ? (
            <><Spinner /> Migrating {selectedDbs.size} database{selectedDbs.size > 1 ? "s" : ""}...</>
          ) : step === "done" && results ? (
            <>Migrated {results.results.length} collection{results.results.length > 1 ? "s" : ""} · {totalDocs.toLocaleString()} documents</>
          ) : (
            <>{getButtonText()}<ArrowRight size={13} /></>
          )}
        </button>
      </div>
    </>
  );
}