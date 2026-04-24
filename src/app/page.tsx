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
import {
  ConnectionForm,
  MigrateButton,
  ErrorDisplay,
  DatabaseSelection,
  MigrationProgress,
  MigrationResults,
} from "@/components/migrate";

type ColPreview = {
  name: string;
  collections: number;
  docs: number;
  existsInDestination?: boolean;
};
type ColResult = { collection: string; docsMigrated: number };
type Step = "idle" | "previewing" | "previewed" | "migrating" | "done";

// Extract cluster hostname from MongoDB connection string
function extractClusterHost(uri: string): string | null {
  try {
    const match = uri.match(/@([^/]+)/);
    return match ? match[1].split("/")[0] : null;
  } catch {
    return null;
  }
}

export default function Home() {
  const [sourceUri, setSourceUri] = useState("");
  const [destinationUri, setDestinationUri] = useState("");
  const [step, setStep] = useState<Step>("idle");
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<{
    dbName: string;
    collections: ColPreview[];
  } | null>(null);
  const [selectedDbs, setSelectedDbs] = useState<Set<string>>(new Set());
  const [results, setResults] = useState<{
    results: ColResult[];
    sourceDb: string;
    destDb: string;
  } | null>(null);
  const [existingDbs, setExistingDbs] = useState<string[]>([]);
  const [migrationProgress, setMigrationProgress] = useState(0);
  const [currentDatabase, setCurrentDatabase] = useState<string>("");
  const [completedDatabases, setCompletedDatabases] = useState(0);

  const [visitorCount, setVisitorCount] = useState<number | string | null>(
    null,
  );
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  // Check if same cluster
  const sourceHost = extractClusterHost(sourceUri.trim());
  const destHost = extractClusterHost(destinationUri.trim());
  const isSameCluster = Boolean(
    sourceHost &&
    destHost &&
    sourceHost === destHost &&
    sourceUri.trim() &&
    destinationUri.trim(),
  );

  useEffect(() => {
    const seen = sessionStorage.getItem("disclaimer_seen");
    if (!seen) setShowDisclaimer(true);
  }, []);

  useEffect(() => {
    const visited = sessionStorage.getItem("visited");
    if (!visited) {
      fetch("/api/visitors?increment=true")
        .then((r) => r.json())
        .then((d) => {
          setVisitorCount(d.count);
          sessionStorage.setItem("visited", "true");
        })
        .catch(() => {});
    } else {
      fetch("/api/visitors")
        .then((r) => r.json())
        .then((d) => setVisitorCount(d.count))
        .catch(() => {});
    }
  }, []);

  function acceptDisclaimer() {
    sessionStorage.setItem("disclaimer_seen", "1");
    setShowDisclaimer(false);
  }

  const stepIndex = {
    idle: 0,
    previewing: 0,
    previewed: 1,
    migrating: 2,
    done: 3,
  }[step];

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
          sourceDbNames: preview.collections.map((c) => c.name),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setExistingDbs(data.existingDbs || []);
        setPreview((prev) =>
          prev
            ? {
                ...prev,
                collections: prev.collections.map((c) => ({
                  ...c,
                  existsInDestination: data.existingDbs?.includes(c.name),
                })),
              }
            : null,
        );
      }
    } catch (e) {
      // Silently fail
    }
  }

  async function handleMigrate() {
    setStep("migrating");
    setError(null);
    setResults(null);
    setMigrationProgress(0);
    setCurrentDatabase("");
    setCompletedDatabases(0);

    const selectedDbsArray = Array.from(selectedDbs);
    const allResults: ColResult[] = [];

    try {
      // Process each database one by one with real API calls
      for (let i = 0; i < selectedDbsArray.length; i++) {
        const currentDb = selectedDbsArray[i];
        setCurrentDatabase(currentDb);
        setMigrationProgress(0); // Reset to 0% for each database

        // Simulate progress while making the actual API call
        let progress = 0;
        const progressInterval = setInterval(() => {
          progress += Math.random() * 8 + 2; // Slower increments 2-10%
          if (progress < 90) {
            // Don't go above 90% until API responds
            setMigrationProgress(progress);
          }
        }, 400);

        try {
          // Make API call for this specific database
          const res = await fetch("/api/migrate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sourceUri,
              destinationUri,
              selectedDbs: [currentDb], // Only migrate current database
            }),
          });

          clearInterval(progressInterval);
          const data = await res.json();

          if (res.ok || res.status === 207) {
            // Complete progress for this database
            setMigrationProgress(100);

            // Add results from this database
            if (data.results) {
              allResults.push(...data.results);
            }

            // Wait a moment to show 100% completion
            await new Promise((resolve) => setTimeout(resolve, 800));

            // Mark this database as completed
            setCompletedDatabases(i + 1);

            if (data.partialSuccess) {
              setError(`Warning: ${data.error}`);
            }
          } else {
            clearInterval(progressInterval);
            throw new Error(data.error);
          }
        } catch (dbError) {
          clearInterval(progressInterval);
          throw dbError;
        }
      }

      // All databases completed
      setCurrentDatabase("");
      setResults({
        results: allResults,
        sourceDb: selectedDbsArray.join(", "),
        destDb: selectedDbsArray.join(", "),
      });
      setStep("done");
    } catch (e: unknown) {
      setMigrationProgress(0);
      setCurrentDatabase("");
      setCompletedDatabases(0);

      const errorMessage = e instanceof Error ? e.message : "Migration failed.";
      if (
        errorMessage.includes("fetch") ||
        errorMessage.includes("network") ||
        errorMessage.includes("timeout")
      ) {
        setError(
          `${errorMessage} - Migration may have completed successfully. Please check your destination cluster.`,
        );
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
    setStep("idle");
    setResults(null);
    setPreview(null);
    setSourceUri("");
    setDestinationUri("");
    setSelectedDbs(new Set());
    setError(null);
    setExistingDbs([]);
    setMigrationProgress(0);
    setCurrentDatabase("");
    setCompletedDatabases(0);
  }

  function migrateMore() {
    if (results && preview) {
      const migratedNames = new Set(
        results.results.map((r) => r.collection.split("/")[0]),
      );
      setSelectedDbs(
        new Set(
          preview.collections
            .map((c) => c.name)
            .filter((n) => !migratedNames.has(n)),
        ),
      );
    } else {
      setSelectedDbs(new Set());
    }
    setResults(null);
    setExistingDbs([]);
    setMigrationProgress(0);
    setCurrentDatabase("");
    setCompletedDatabases(0);
    setStep("previewed");
  }

  const allSelected = preview
    ? selectedDbs.size === preview.collections.length &&
      preview.collections.length > 0
    : false;
  const totalDocs =
    results?.results.reduce((s, r) => s + r.docsMigrated, 0) ?? 0;

  return (
    <div className="min-h-screen bg-[#0d1117] text-white font-sans">
      <DisclaimerDialog
        open={showDisclaimer}
        onAccept={acceptDisclaimer}
        onClose={() => setShowDisclaimer(false)}
      />
      <Navbar visitorCount={visitorCount} />

      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_260px] gap-6">
          {/* Left sidebar — desktop only */}
          <BeforeMigrationSidebar className="hidden lg:flex sticky top-20 h-fit" />

          {/* Main content */}
          <div className="space-y-4">
            <HeroSection />

            <StepIndicator step={step} />

            {visitorCount &&
              (typeof visitorCount === "string" || visitorCount > 0) && (
                <div className="flex sm:hidden justify-center">
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
                // isSameCluster={isSameCluster}
              />
            </ConnectionForm>

            {error && <ErrorDisplay error={error} />}

            <MigrationProgress
              step={step}
              progress={migrationProgress}
              currentDatabase={currentDatabase}
              totalDatabases={selectedDbs.size}
              completedDatabases={completedDatabases}
            />

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

            <MigrationResults
              step={step}
              results={results}
              totalDocs={totalDocs}
              migrateMore={migrateMore}
              reset={reset}
            />

            {step === "idle" && <InfoCards />}

            {/* < 620px: sidebars stacked at bottom */}
            <div className="flex lg:hidden flex-col gap-4 mt-4">
              <BeforeMigrationSidebar />
              <AfterMigrationSidebar />
            </div>
          </div>

          {/* Right sidebar — desktop only */}
          <AfterMigrationSidebar className="hidden lg:flex sticky top-20 h-fit" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
