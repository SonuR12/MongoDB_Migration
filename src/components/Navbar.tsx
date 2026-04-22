import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Image from "next/image";

export function Navbar() {
  return (
    <nav className="border-b border-[#21262d]">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="MongoDB Logo" width="28" height="28" />
          <span className="font-bold text-lg text-white tracking-tight">MongoDBMigrate</span>
          <Badge className="bg-[#00ED64]/10 text-[#00ED64] border border-[#00ED64]/20 text-[10px] px-2 py-0 ml-1">v1.4</Badge>
        </div>
        <div className="flex items-center gap-4 text-xs text-[#8a9bb0]">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5 cursor-default">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ED64] animate-pulse" />
                <span>Secure · In-memory only</span>
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-[#161b22] border-[#30363d] text-white text-xs">
              Connection strings are never stored or logged
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </nav>
  );
}