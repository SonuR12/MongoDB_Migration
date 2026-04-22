interface ErrorDisplayProps {
  error: string;
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  const isSSLError =
    error.includes("SSL routines") ||
    error.includes("tlsv1 alert internal error");
  // Force destination error detection for migration errors
  const isMigrationError =
    window.location.pathname === "/" &&
    error.includes("SSL") &&
    !error.toLowerCase().includes("source");
  const isDestinationError =
    error.toLowerCase().includes("destination") ||
    error.toLowerCase().includes("dest") ||
    error.includes("destinationUri") ||
    isMigrationError;
  const isSourceError =
    error.toLowerCase().includes("source") ||
    error.toLowerCase().includes("src");

  let errorTitle = "Connection Error";
  if (isDestinationError) {
    errorTitle = "Destination Connection Error";
  } else if (isSourceError) {
    errorTitle = "Source Connection Error";
  }

  return (
    <div className="bg-[#2d1b1b] border border-[#f85149] rounded-xl p-4 text-[#f85149] text-sm flex gap-3 items-start mb-4">
      <span className="text-lg leading-none">⚠</span>
      <div className="flex-1">
        <p className="font-semibold mb-2">{errorTitle}</p>

        {isSSLError ? (
          <div className="space-y-3">
            <p className="text-xs opacity-90">
              SSL connection failed. This is likely due to IP allowlist
              restrictions in MongoDB Atlas.
            </p>

            <div className="bg-[#1a0f0f] border border-[#f85149]/30 rounded-lg p-3">
              <p className="font-semibold text-xs mb-2 text-[#ff6b6b]">
                Required Fix:
              </p>
              <ol className="text-xs space-y-1 opacity-90 list-decimal list-inside">
                <li>Go to your MongoDB Atlas Dashboard</li>
                <li>
                  Navigate to <strong>Network Access</strong>
                </li>
                <li>
                  Click <strong>"Add IP Address"</strong>
                </li>
                <li>
                  Select <strong>"Allow Access from Anywhere"</strong>
                </li>
                <li>
                  Or manually enter:{" "}
                  <code className="bg-[#0d1117] px-1 py-0.5 rounded text-[#00ED64]">
                    0.0.0.0/0
                  </code>
                </li>
                <li>Apply this to both source and destination clusters</li>
              </ol>
            </div>

            <details className="text-xs">
              <summary className="cursor-pointer opacity-70 hover:opacity-100">
                Show technical error details
              </summary>
              <pre className="mt-2 p-2 bg-[#0d1117] rounded text-[10px] opacity-60 overflow-x-auto">
                {error}
              </pre>
            </details>
          </div>
        ) : (
          <p className="text-xs opacity-80">{error}</p>
        )}
      </div>
    </div>
  );
}
