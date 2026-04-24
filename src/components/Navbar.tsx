import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import Link from "next/link";
import { BsLinkedin } from "react-icons/bs";
import { RxGithubLogo } from "react-icons/rx";

export function Navbar({
  visitorCount,
}: {
  visitorCount?: number | string | null;
}) {
  return (
    <nav className="border-b border-[#21262d]">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Image
            src="/logo.png"
            alt="MongoDB Logo"
            width="28"
            height="28"
            className="w-5 h-5 sm:w-7 sm:h-7"
          />
          <span className="font-bold text-lg text-white tracking-tight mr-1 hidden min-[420px]:inline">
            MongoDBMigrate
          </span>
          <span className="font-bold text-md text-white tracking-tight mr-1 hidden min-[300px]:inline min-[420px]:hidden">
            DBMigrate
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#00ED64] animate-pulse hidden min-[420px]:inline" />
          <Badge className="bg-[#00ED64]/10 text-[#00ED64] border border-[#00ED64]/20 text-[10px] px-2 py-0">
            v1.5
          </Badge>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-4">
            {visitorCount &&
              (typeof visitorCount === "string" || visitorCount > 0) && (
                <div className="hidden sm:flex justify-center">
                  <div className="inline-flex items-center gap-2 text-xs text-[#8a9bb0] bg-[#161b22] border border-[#21262d] rounded-full px-3 py-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    {typeof visitorCount === "string"
                      ? visitorCount
                      : visitorCount > 2147483647
                        ? `${visitorCount.toLocaleString()}+`
                        : visitorCount.toLocaleString()}{" "}
                    visitors
                  </div>
                </div>
              )}
            <Link
              href={process.env.NEXT_PUBLIC_LINKEDIN_URL!}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-[#0A66C2] hover:text-[#0A66C2]/70 transition-colors"
            >
              <BsLinkedin size={20} />
            </Link>

            <Link
              href={process.env.NEXT_PUBLIC_GITHUB_URL!}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-white hover:text-white/70 transition-colors"
            >
              <RxGithubLogo size={22} />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
