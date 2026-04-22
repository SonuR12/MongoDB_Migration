import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/Spinner";

type Step = "idle" | "previewing" | "previewed" | "migrating" | "done";

interface MigrationProgressProps {
  step: Step;
}

export function MigrationProgress({ step }: MigrationProgressProps) {
  if (step !== "migrating") return null;

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 mb-4">
      <div className="flex items-center gap-3 mb-4">
        <Spinner />
        <span className="text-sm font-semibold text-white">Migration in progress...</span>
      </div>
      <Progress value={undefined} className="h-1.5 bg-[#21262d] [&>div]:bg-[#00ED64]" />
      <p className="text-xs text-[#4a5568] mt-3">This may take a few minutes depending on data size. Do not close this tab.</p>
    </div>
  );
}