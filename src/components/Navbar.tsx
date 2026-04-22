import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Image from "next/image";
import Link from "next/link";
import { BsLinkedin } from "react-icons/bs";
import { RxGithubLogo } from "react-icons/rx";

export function Navbar() {
  return (
    <nav className="border-b border-[#21262d]">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="MongoDB Logo" width="28" height="28" />
          <span className="font-bold text-lg text-white tracking-tight mr-1">MongoDBMigrate</span>
           <span className="w-1.5 h-1.5 rounded-full bg-[#00ED64] animate-pulse" />
          <Badge className="bg-[#00ED64]/10 text-[#00ED64] border border-[#00ED64]/20 text-[10px] px-2 py-0">v1.4</Badge>
        </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">

            <div className="flex items-center gap-4">
              <Link
                href="https://www.linkedin.com/in/sonu-rai-r12/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-[#0A66C2] hover:text-[#0A66C2]/70 transition-colors"
              >
                <BsLinkedin size={20} />
              </Link>

              <Link
                href="https://github.com/SonuR12"
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