"use client";
import Link from "next/link";
import { ArrowLeft, Database, AlertTriangle } from "lucide-react";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-white font-sans flex flex-col">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* 404 Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-[#161b22] border border-[#30363d] flex items-center justify-center">
                <AlertTriangle size={48} className="text-[#f85149]" />
              </div>
              <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-[#00ED64]/10 border border-[#00ED64]/30 flex items-center justify-center">
                <Database size={20} className="text-[#00ED64]" />
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-white mb-4 tracking-tight">
              404
            </h1>
            <h2 className="text-2xl font-semibold text-white mb-3">
              Page Not Found
            </h2>
            <p className="text-[#8a9bb0] text-lg max-w-md mx-auto leading-relaxed">
              The page you're looking for doesn't exist. It might have been
              moved, deleted, or you entered the wrong URL.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/"
              className="flex items-center gap-2 px-6 py-3 bg-[#00ED64] text-[#0d1117] font-semibold rounded-lg hover:bg-[#00c853] transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Tool
            </Link>
          </div>

          {/* Help Text */}
          <div className="mt-12 p-6 bg-[#161b22] border border-[#30363d] rounded-xl">
            <h3 className="text-sm font-semibold text-white mb-2">
              Need Help?
            </h3>
            <p className="text-xs text-[#8a9bb0] leading-relaxed">
              If you believe this is an error, try refreshing the page or go
              back to the{" "}
              <Link href="/" className="text-[#00ED64] hover:underline">
                homepage
              </Link>{" "}
              to start your MongoDB migration.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
