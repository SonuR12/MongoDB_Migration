import Link from "next/link";
import { BsLinkedin } from "react-icons/bs";
import { RxGithubLogo } from "react-icons/rx";

export default function Footer() {
  return (
    <footer className="pt-6 pb-4 w-full border-t border-[#21262d]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          
          {/* Copyright */}
          <p className="text-xs sm:text-sm text-[#8a9bb0] text-center sm:text-left">
            Migrate MongoDB data between clusters without terminal commands
          </p>

          {/* Creator + Socials */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <span className="text-xs sm:text-sm text-[#8a9bb0]">
              Made by <span className="font-medium text-white">Sonu Rai</span>
            </span>

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
      </div>
    </footer>
  );
}