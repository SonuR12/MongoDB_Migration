"use client";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { DisclaimerDialog } from "@/components/DisclaimerDialog";
import { StepIndicator } from "@/components/StepIndicator";
import { BeforeMigrationSidebar } from "@/components/BeforeMigrationSidebar";
import { AfterMigrationSidebar } from "@/components/AfterMigrationSidebar";
import { HeroSection } from "@/components/HeroSection";
import { InfoCards } from "@/components/InfoCards";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ConnectionForm, MigrateButton, ErrorDisplay, DatabaseSelection, MigrationProgress, MigrationResults } from "@/components/migrate";

type ColPreview = { name: string; collections: number; docs: number; existsInDestination?: boolean };
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
  const [existingDbs, setExistingDbs] = useState<string[]>([]);

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
    setExistingDbs([]);
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

  async function checkExistingDbs() {
    if (!destinationUri || !preview || existingDbs.length > 0) return;
    try {
      const res = await fetch("/api/check-destination", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          destinationUri, 
          sourceDbNames: preview.collections.map(c => c.name) 
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setExistingDbs(data.existingDbs || []);
        setPreview(prev => prev ? {
          ...prev,
          collections: prev.collections.map(c => ({
            ...c,
            existsInDestination: data.existingDbs?.includes(c.name)
          }))
        } : null);
      }
    } catch (e) {
      // Silently fail
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
      
      if (res.ok || res.status === 207) {
        setResults(data);
        setStep("done");
        if (data.partialSuccess) {
          setError(`Warning: ${data.error}`);
        }
      } else {
        throw new Error(data.error);
      }
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Migration failed.";
      if (errorMessage.includes('fetch') || errorMessage.includes('network') || errorMessage.includes('timeout')) {
        setError(`${errorMessage} - Migration may have completed successfully. Please check your destination cluster.`);
      } else {
        setError(errorMessage);
      }
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
    setSourceUri(""); setDestinationUri(""); setSelectedDbs(new Set()); setError(null); setExistingDbs([]);
  }

  function migrateMore() {
    if (results && preview) {
      const migratedNames = new Set(results.results.map(r => r.collection.split("/")[0]));
      setSelectedDbs(new Set(preview.collections.map(c => c.name).filter(n => !migratedNames.has(n))));
    } else {
      setSelectedDbs(new Set());
    }
    setResults(null);
    setExistingDbs([]);
    setStep("previewed");
  }

  const allSelected = preview ? selectedDbs.size === preview.collections.length && preview.collections.length > 0 : false;
  const totalDocs = results?.results.reduce((s, r) => s + r.docsMigrated, 0) ?? 0;

  return (
    <div className="min-h-screen bg-[#0d1117] text-white font-sans">
      <DisclaimerDialog open={showDisclaimer} onAccept={acceptDisclaimer} onClose={() => setShowDisclaimer(false)} />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-[260px_1fr_260px] gap-6 min-h-screen">
        <div className="sticky top-20 h-fit">
          <BeforeMigrationSidebar />
        </div>

        <div className="min-h-0 max-h-screen overflow-y-auto pr-2 space-y-4 main-content-scrollbar">
          <HeroSection />
          <StepIndicator step={step} />

          <ConnectionForm
            sourceUri={sourceUri}
            setSourceUri={setSourceUri}
            destinationUri={destinationUri}
            setDestinationUri={setDestinationUri}
            step={step}
            preview={preview}
            handlePreview={handlePreview}
            setStep={setStep}
            setPreview={setPreview}
            setSelectedDbs={setSelectedDbs}
            setError={setError}
          >
            <MigrateButton
              sourceUri={sourceUri}
              destinationUri={destinationUri}
              step={step}
              selectedDbs={selectedDbs}
              results={results}
              totalDocs={totalDocs}
              handleMigrate={handleMigrate}
              preview={preview}
            />
          </ConnectionForm>

          {error && <ErrorDisplay error={error} />}

          <DatabaseSelection
            preview={preview}
            step={step}
            selectedDbs={selectedDbs}
            allSelected={allSelected}
            toggleAll={toggleAll}
            toggleDb={toggleDb}
            destinationUri={destinationUri}
            checkExistingDbs={checkExistingDbs}
            existingDbs={existingDbs}
          />

          <MigrationProgress step={step} />

          <MigrationResults
            step={step}
            results={results}
            totalDocs={totalDocs}
            migrateMore={migrateMore}
            reset={reset}
          />

          {step === "idle" && <InfoCards />}
        </div>
        
        <div className="sticky top-20 h-fit">
          <AfterMigrationSidebar />
        </div>
      </main>
      <Footer />
    </div>
  );
}
