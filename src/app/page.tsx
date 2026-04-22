"use client";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Zap, Target, Eye, Database, Check, Square, CheckSquare, RotateCcw, ArrowLeft, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type ColPreview = { name: string; collections: number; docs: number };
type ColResult = { collection: string; docsMigrated: number };
type Step = "idle" | "previewing" | "previewed" | "migrating" | "done";



function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  );
}

const STEPS = ["Connect", "Select", "Migrate", "Done"];

export default function Home() {
  const [sourceUri, setSourceUri] = useState("");
  const [destinationUri, setDestinationUri] = useState("");
  const [step, setStep] = useState<Step>("idle");
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ dbName: string; collections: ColPreview[] } | null>(null);
  const [selectedDbs, setSelectedDbs] = useState<Set<string>>(new Set());
  const [results, setResults] = useState<{ results: ColResult[]; sourceDb: string; destDb: string } | null>(null);

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
      {/* Top Nav */}
      <nav className="border-b border-[#21262d] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
            <ellipse cx="20" cy="20" rx="8" ry="18" fill="url(#navleaf)" />
            <path d="M20 2 C20 2 28 10 28 20 C28 30 20 38 20 38" stroke="#00684A" strokeWidth="1.5" fill="none" />
            <defs>
              <linearGradient id="navleaf" x1="12" y1="2" x2="28" y2="38" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#00ED64" />
                <stop offset="100%" stopColor="#00684A" />
              </linearGradient>
            </defs>
          </svg>
          <span className="font-bold text-lg text-white tracking-tight">MongoMigrate</span>
          <Badge className="bg-[#00ED64]/10 text-[#00ED64] border border-[#00ED64]/20 text-[10px] px-2 py-0 ml-1">v0.3</Badge>
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
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-[260px_1fr_260px] gap-6">

        {/* Left Panel — Before Migration */}
        <aside className="hidden lg:flex flex-col gap-4 pt-2">
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-yellow-400" />
              <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest">Before Migrating</span>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-yellow-400 text-[10px] font-bold">1</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-white mb-1">Allow all IPs on Source</p>
                  <p className="text-[11px] text-[#8a9bb0] leading-relaxed">In Atlas, go to <span className="text-white">Network Access</span> on your source cluster and add <code className="text-yellow-400 bg-yellow-400/10 px-1 rounded">0.0.0.0/0</code> to the IP Access List.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-yellow-400 text-[10px] font-bold">2</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-white mb-1">Allow all IPs on Destination</p>
                  <p className="text-[11px] text-[#8a9bb0] leading-relaxed">Do the same on your <span className="text-white">destination cluster</span> — add <code className="text-yellow-400 bg-yellow-400/10 px-1 rounded">0.0.0.0/0</code> so the migration server can connect.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-yellow-400 text-[10px] font-bold">3</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-white mb-1">Check credentials</p>
                  <p className="text-[11px] text-[#8a9bb0] leading-relaxed">Make sure your DB user has <span className="text-white">read access</span> on source and <span className="text-white">read+write</span> on destination.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#161b22] border border-[#21262d] rounded-2xl p-5">
            <p className="text-xs font-bold text-[#8a9bb0] uppercase tracking-widest mb-3">How to add IP in Atlas</p>
            <ol className="space-y-2 text-[11px] text-[#8a9bb0] leading-relaxed list-none">
              <li className="flex gap-2"><span className="text-[#00ED64]">→</span> Open your Atlas project</li>
              <li className="flex gap-2"><span className="text-[#00ED64]">→</span> Click <span className="text-white mx-1">Network Access</span> in sidebar</li>
              <li className="flex gap-2"><span className="text-[#00ED64]">→</span> Click <span className="text-white mx-1">+ Add IP Address</span></li>
              <li className="flex gap-2"><span className="text-[#00ED64]">→</span> Enter <code className="text-yellow-400 bg-yellow-400/10 px-1 rounded">0.0.0.0/0</code> and confirm</li>
            </ol>
          </div>
        </aside>

        {/* Center — main content */}
        <div>
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
            Migrate MongoDB <span className="text-[#00ED64]">without the terminal</span>
          </h1>
          <p className="text-[#8a9bb0] text-base max-w-lg mx-auto">
            No <code className="text-[#00ED64] bg-[#00ED64]/10 px-1 rounded text-sm">mongodump</code>. No <code className="text-[#00ED64] bg-[#00ED64]/10 px-1 rounded text-sm">mongorestore</code>. Just paste, select, and migrate.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-0 mb-10 select-none">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                  i < stepIndex ? "bg-[#00ED64] border-[#00ED64] text-[#0d1117]"
                  : i === stepIndex ? "border-[#00ED64] text-[#00ED64] bg-transparent"
                  : "border-[#30363d] text-[#4a5568] bg-transparent"
                }`}>
                  {i < stepIndex ? (
                    <svg width="12" height="12" viewBox="0 0 10 10" fill="none">
                      <path d="M1.5 5L4 7.5L8.5 2.5" stroke="#0d1117" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : i + 1}
                </div>
                <span className={`text-[10px] ${i === stepIndex ? "text-[#00ED64]" : i < stepIndex ? "text-[#8a9bb0]" : "text-[#4a5568]"}`}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-16 h-px mx-1 mb-4 transition-all ${i < stepIndex ? "bg-[#00ED64]" : "bg-[#30363d]"}`} />
              )}
            </div>
          ))}
        </div>

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
        {step === "idle" && (
          <div className="grid grid-cols-3 gap-3 mt-6">
            {[
              { icon: <ShieldCheck size={20} className="text-[#00ED64]" />, title: "Secure", desc: "Credentials never stored or logged" },
              { icon: <Zap size={20} className="text-[#00ED64]" />, title: "Fast", desc: "Direct driver connection, no middleman" },
              { icon: <Target size={20} className="text-[#00ED64]" />, title: "Selective", desc: "Choose exactly which databases to migrate" },
            ].map((card) => (
              <div key={card.title} className="bg-[#161b22] border border-[#21262d] rounded-xl p-4 text-center">
                <div className="flex justify-center mb-2">{card.icon}</div>
                <p className="text-xs font-semibold text-white mb-1">{card.title}</p>
                <p className="text-[11px] text-[#4a5568]">{card.desc}</p>
              </div>
            ))}
          </div>
        )}
        </div>
        {/* Right Panel — After Migration */}
        <aside className="hidden lg:flex flex-col gap-4 pt-2">
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#00ED64]" />
              <span className="text-xs font-bold text-[#00ED64] uppercase tracking-widest">After Migrating</span>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-[#00ED64]/10 border border-[#00ED64]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[#00ED64] text-[10px] font-bold">1</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-white mb-1">Remove <code className="text-yellow-400 bg-yellow-400/10 px-1 rounded">0.0.0.0/0</code> from Source</p>
                  <p className="text-[11px] text-[#8a9bb0] leading-relaxed">Go back to <span className="text-white">Network Access</span> on your source cluster and delete the <code className="text-yellow-400 bg-yellow-400/10 px-1 rounded">0.0.0.0/0</code> entry.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-[#00ED64]/10 border border-[#00ED64]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[#00ED64] text-[10px] font-bold">2</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-white mb-1">Remove <code className="text-yellow-400 bg-yellow-400/10 px-1 rounded">0.0.0.0/0</code> from Destination</p>
                  <p className="text-[11px] text-[#8a9bb0] leading-relaxed">Do the same on your <span className="text-white">destination cluster</span> — remove the open IP and add only your trusted IPs.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-[#00ED64]/10 border border-[#00ED64]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[#00ED64] text-[10px] font-bold">3</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-white mb-1">Verify your data</p>
                  <p className="text-[11px] text-[#8a9bb0] leading-relaxed">Open <span className="text-white">MongoDB Compass</span> or Atlas and confirm all collections and documents are present on the destination.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-[#00ED64]/10 border border-[#00ED64]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[#00ED64] text-[10px] font-bold">4</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-white mb-1">Rotate your password</p>
                  <p className="text-[11px] text-[#8a9bb0] leading-relaxed">Change your DB user password in <span className="text-white">Atlas → Database Access</span> since it was used in a connection string.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#2d1b1b] border border-[#f85149]/20 rounded-2xl p-5">
            <p className="text-xs font-bold text-[#f85149] uppercase tracking-widest mb-3">Security Reminder</p>
            <p className="text-[11px] text-[#8a9bb0] leading-relaxed">Never leave <code className="text-yellow-400 bg-yellow-400/10 px-1 rounded">0.0.0.0/0</code> open in production. It allows connections from <span className="text-white">any IP in the world</span>.</p>
          </div>
        </aside>
      </main>
    </div>
  );
}
