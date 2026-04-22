import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/Spinner";
import { Database, CheckCircle } from "lucide-react";

type Step = "idle" | "previewing" | "previewed" | "migrating" | "done";

interface MigrationProgressProps {
  step: Step;
  progress?: number;
  currentDatabase?: string;
  totalDatabases?: number;
  completedDatabases?: number;
}

export function MigrationProgress({ 
  step, 
  progress = 0, 
  currentDatabase, 
  totalDatabases = 0, 
  completedDatabases = 0 
}: MigrationProgressProps) {
  if (step !== "migrating") return null;

  const currentDbNumber = completedDatabases + (currentDatabase ? 1 : 0);

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Spinner />
          <span className="text-sm font-semibold text-white">
            {currentDatabase ? `${currentDbNumber}/${totalDatabases} database migrating...` : "Migration in progress..."}
          </span>
        </div>
        <span className="text-lg font-bold text-[#00ED64]">{Math.round(progress)}%</span>
      </div>
      
      <Progress value={progress} className="h-3 bg-[#21262d] [&>div]:bg-gradient-to-r [&>div]:from-[#00ED64] [&>div]:to-[#00c853] [&>div]:transition-all [&>div]:duration-500" />
      
      <div className="mt-4 space-y-3">
        {currentDatabase && (
          <div className="flex items-center gap-2">
            <Database size={14} className="text-[#00ED64]" />
            <p className="text-sm text-[#8a9bb0]">
              Currently migrating: <span className="text-white font-medium">{currentDatabase}</span>
            </p>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle size={14} className="text-[#00ED64]" />
            <p className="text-sm text-[#8a9bb0]">
              Completed: <span className="text-white font-medium">{completedDatabases}</span> of <span className="text-white font-medium">{totalDatabases}</span> databases
            </p>
          </div>
          
          {progress >= 100 && currentDatabase && (
            <span className="text-xs text-[#00ED64] font-medium animate-pulse">
              Completing {currentDatabase}...
            </span>
          )}
        </div>
        
        <p className="text-xs text-[#4a5568] pt-2 border-t border-[#21262d]">
          This may take a few minutes depending on data size. Do not close this tab.
        </p>
      </div>
    </div>
  );
}