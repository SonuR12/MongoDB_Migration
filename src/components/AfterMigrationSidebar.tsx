export function AfterMigrationSidebar() {
  return (
    <aside className="hidden lg:flex flex-col gap-4 pt-2">
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-[#00ED64] animate-pulse" />
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
  );
}