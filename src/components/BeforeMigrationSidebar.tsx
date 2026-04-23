export function BeforeMigrationSidebar({ className = "" }: { className?: string }) {
  return (
    <aside className={`flex flex-col gap-4 pt-2 ${className}`}>
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
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
          <li className="flex gap-2"><span className="text-[#00ED64]">1.</span> Open your Atlas project</li>
          <li className="flex gap-2"><span className="text-[#00ED64]">2.</span> Click <span className="text-white mx-1">Network Access</span> in sidebar</li>
          <li className="flex gap-2"><span className="text-[#00ED64]">3.</span> Click <span className="text-white mx-1">+ Add IP Address</span></li>
          <li className="flex gap-2"><span className="text-[#00ED64]">4.</span> Enter <code className="text-yellow-400 bg-yellow-400/10 px-1 rounded">0.0.0.0/0</code> and confirm</li>
        </ol>
      </div>
    </aside>
  );
}