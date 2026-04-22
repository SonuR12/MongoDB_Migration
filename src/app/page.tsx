"use client";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { DisclaimerDialog } from "@/components/DisclaimerDialog";
import { StepIndicator } from "@/components/StepIndicator";
import { BeforeMigrationSidebar } from "@/components/BeforeMigrationSidebar";
import { AfterMigrationSidebar } from "@/components/AfterMigrationSidebar";
import { HeroSection } from "@/components/HeroSection";
import { InfoCards } from "@/components/InfoCards";
import { Spinner } from "@/components/Spinner";
import { Eye, Database, CheckSquare, Square, RotateCcw, ArrowLeft, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Navbar } from "@/components/Navbar";

type ColPreview = { name: string; collections: number; docs: number };
type ColResult = { collection: string; docsMigrated: number };
type Step = "idle" | "previewing" | "previewed" | "migrating" | "done";

export default function Home() {
  const [sourceUri, setSourceUri] = useState("");
  const [destinationUri, setDestinationUri] = useState("");
  const [step, setStep] = useState<Step>("idle");
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ dbName: string; collections: ColPreview[] } | null>(null);
  const [selectedDbs, setSelectedDbs] = useState<Set<string>>(new Set());
  const [results, setResults] = useState<{ results: ColResult[]; sourceDb: string; destDb: string } | null>(null);

  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("disclaimer_seen");
    if (!seen) setShowDisclaimer(true);
  }, []);

  function acceptDisclaimer() {
    sessionStorage.setItem("disclaimer_seen", "1");
    setShowDisclaimer(false);
  }

  const stepIndex = { idle: 0, previewing: 0, previewed: 1, migrating: 2, done: 3 }[step];

  async function handlePreview() {
    setStep("previewing");
    setError(null);
    setPreview(null);
    setResults(null);
    setSelectedDbs(new Set());
    try {
      const res = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceUri }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPreview(data);
      setSelectedDbs(new Set(data.collections.map((c: ColPreview) => c.name)));
      setStep("previewed");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to connect.");
      setStep("idle");
    }
  }

  async function handleMigrate() {
    setStep("migrating");
    setError(null);
    setResults(null);
    try {
      const res = await fetch("/api/migrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceUri, destinationUri, selectedDbs: Array.from(selectedDbs) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResults(data);
      setStep("done");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Migration failed.");
      setStep("previewed");
    }
  }

  function toggleDb(name: string) {
    setSelectedDbs((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  }

  function toggleAll() {
    if (!preview) return;
    const all = preview.collections.map((c) => c.name);
    setSelectedDbs(selectedDbs.size === all.length ? new Set() : new Set(all));
  }

  function reset() {
    setStep("idle"); setResults(null); setPreview(null);
    setSourceUri(""); setDestinationUri(""); setSelectedDbs(new Set()); setError(null);
  }

  function migrateMore() {
    // keep URIs and preview, just deselect migrated DBs and go back to select step
    if (results && preview) {
      const migratedNames = new Set(results.results.map(r => r.collection.split("/")[0]));
      setSelectedDbs(new Set(preview.collections.map(c => c.name).filter(n => !migratedNames.has(n))));
    } else {
      setSelectedDbs(new Set());
    }
    setResults(null);
    setStep("previewed");
  }

  const allSelected = preview ? selectedDbs.size === preview.collections.length && preview.collections.length > 0 : false;
  const totalDocs = results?.results.reduce((s, r) => s + r.docsMigrated, 0) ?? 0;
  const totalPreviewDocs = preview?.collections.filter(c => selectedDbs.has(c.name)).reduce((s, c) => s + (c.docs ?? 0), 0) ?? 0;

  return (
    <div className="min-h-screen bg-[#0d1117] text-white font-sans">
      <DisclaimerDialog open={showDisclaimer} onAccept={acceptDisclaimer} onClose={() => setShowDisclaimer(false)} />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-[260px_1fr_260px] gap-6">
        <BeforeMigrationSidebar />

        <div>
          <HeroSection />
          <StepIndicator step={step} />

        {/* Main Card */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden shadow-2xl mb-4">
          {/* Source */}
          <div className="p-6 pb-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded-full bg-[#00ED64]/10 border border-[#00ED64]/30 flex items-center justify-center">
                <span className="text-[#00ED64] text-[10px] font-bold">S</span>
              </div>
              <label className="text-xs font-semibold text-[#00ED64] uppercase tracking-widest">Source Cluster</label>
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
                  onChange={(e) => { setSourceUri(e.target.value); setStep("idle"); setPreview(null); setSelectedDbs(new Set()); setError(null); }}
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
              <label className="text-xs font-semibold text-blue-400 uppercase tracking-widest">Destination Cluster</label>
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

          <Separator className="bg-[#21262d]" />

          {/* Migrate Button */}
          <div className="p-6 pt-4">
            <button
              onClick={handleMigrate}
              disabled={!sourceUri || !destinationUri || step === "migrating" || step === "previewing" || step === "done" || selectedDbs.size === 0}
              className="w-full bg-[#00ED64] text-[#0d1117] font-bold py-3.5 rounded-xl transition-all text-sm tracking-wide flex items-center justify-center gap-1.5 shadow-lg shadow-[#00ED64]/10 enabled:hover:bg-[#00c853] disabled:bg-[#00684A] disabled:pointer-events-none"
            >
              {step === "migrating" ? (
                <><Spinner /> Migrating {selectedDbs.size} database{selectedDbs.size > 1 ? "s" : ""}...</>
              ) : step === "done" && results ? (
                <>Migrated {results.results.length} collection{results.results.length > 1 ? "s" : ""} · {totalDocs.toLocaleString()} documents</>
              ) : selectedDbs.size > 0 ? (
                <>Migrate {selectedDbs.size} database{selectedDbs.size > 1 ? "s" : ""}<ArrowRight size={13} /></>
              ) : "Select databases to migrate"}
            </button>

          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-[#2d1b1b] border border-[#f85149] rounded-xl p-4 text-[#f85149] text-sm flex gap-3 items-start mb-4">
            <span className="text-lg leading-none">⚠</span>
            <div>
              <p className="font-semibold mb-0.5">Connection Error</p>
              <p className="text-xs opacity-80">{error}</p>
            </div>
          </div>
        )}

        {/* Database Selection Panel */}
        {preview && step !== "done" && (
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
            <div className="divide-y divide-[#21262d] max-h-72 overflow-y-auto">
              {preview.collections.map((db, i) => {
                const checked = selectedDbs.has(db.name);
                return (
                  <div
                    key={`${db.name}-${i}`}
                    onClick={() => toggleDb(db.name)}
                    className={`flex items-center justify-between px-6 py-3.5 cursor-pointer transition-all ${
                      checked ? "bg-[#0d2818] hover:bg-[#0f3020]" : "hover:bg-[#1c2128]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {checked
                        ? <CheckSquare size={16} className="text-[#00ED64] flex-shrink-0" />
                        : <Square size={16} className="text-[#4a5568] flex-shrink-0" />
                      }
                      <Database size={15} className={checked ? "text-[#00ED64]" : "text-[#8a9bb0]"} />
                      <span className="text-sm font-medium text-white">
                        {db.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-xs text-[#8a9bb0] w-24 text-right">{db.collections} {db.collections === 1 ? "collection" : "collections"}</span>
                      <span className="text-xs text-[#8a9bb0] w-24 text-right">{(db.docs ?? 0).toLocaleString()} {(db.docs ?? 0) === 1 ? "document" : "documents"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Migration in progress */}
        {step === "migrating" && (
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 mb-4">
            <div className="flex items-center gap-3 mb-4">
              <Spinner />
              <span className="text-sm font-semibold text-white">Migration in progress...</span>
            </div>
            <Progress value={undefined} className="h-1.5 bg-[#21262d] [&>div]:bg-[#00ED64]" />
            <p className="text-xs text-[#4a5568] mt-3">This may take a few minutes depending on data size. Do not close this tab.</p>
          </div>
        )}

        {/* Results */}
        {step === "done" && results && (
          <div className="bg-[#161b22] border border-[#00ED64]/40 rounded-2xl overflow-hidden mb-4">
            {/* Success header */}
            <div className="px-6 py-5 bg-gradient-to-r from-[#0d2818] to-[#161b22] border-b border-[#21262d]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#00ED64]/20 border border-[#00ED64]/40 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8L6.5 11.5L13 4.5" stroke="#00ED64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#00ED64]">Migration Complete</p>
                    <p className="text-xs text-[#8a9bb0]">{results.results.length} collections · {totalDocs.toLocaleString()} documents</p>
                  </div>
                </div>
                <Badge className="bg-[#00ED64]/10 text-[#00ED64] border-[#00ED64]/20">Success</Badge>
              </div>

              {/* From → To */}
              {/* <div className="mt-4 flex items-center gap-3 bg-[#0d1117] rounded-lg px-4 py-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Database size={14} className="text-[#4a5568]" />
                  <span className="text-xs text-[#8a9bb0] truncate font-mono">{results.sourceDb}</span>
                </div>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0">
                  <path d="M4 10 L16 10 M11 5 L16 10 L11 15" stroke="#00ED64" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                  <span className="text-xs text-[#8a9bb0] truncate font-mono">{results.destDb}</span>
                  <Database size={14} className="text-[#00ED64]" />
                </div>
              </div> */}
            </div>

            {/* Collection results */}
            <div className="divide-y divide-[#21262d] max-h-64 overflow-y-auto">
              {results.results.map((r) => (
                <div key={r.collection} className="flex items-center justify-between px-6 py-3">
                  <div className="flex items-center gap-2">
                    <svg width="12" height="12" viewBox="0 0 10 10" fill="none">
                      <path d="M1.5 5L4 7.5L8.5 2.5" stroke="#00ED64" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-sm text-white font-mono">{r.collection}</span>
                  </div>
                  <Badge className="bg-[#21262d] text-[#8a9bb0] border-[#30363d] text-xs">
                    {r.docsMigrated.toLocaleString()} docs
                  </Badge>
                </div>
              ))}
            </div>

            <div className="px-6 py-4 border-t border-[#21262d] flex items-center justify-between gap-3">
              <button
                onClick={migrateMore}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#30363d] text-xs text-[#8a9bb0] hover:text-white hover:border-[#8a9bb0] transition-colors font-semibold"
              >
                <ArrowLeft size={13} />
                Migrate Other Databases
              </button>
              <button
                onClick={reset}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00ED64]/10 border border-[#00ED64]/30 text-xs text-[#00ED64] hover:bg-[#00ED64]/20 transition-colors font-semibold"
              >
                <RotateCcw size={13} />
                New Migration
              </button>
            </div>
          </div>
        )}

        {/* Info cards */}
        {step === "idle" && <InfoCards />}
        </div>
        <AfterMigrationSidebar />
      </main>
    </div>
  );
}
