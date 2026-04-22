"use client";
import { Shield, DollarSign, AlertTriangle, Lock, ShieldCheck } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DisclaimerDialogProps {
  open: boolean;
  onAccept: () => void;
  onClose?: () => void;
}

export function DisclaimerDialog({ open, onAccept, onClose }: DisclaimerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose?.()}>
      <DialogContent 
        className="bg-[#161b22] border border-[#30363d] text-white [&>button]:bg-transparent [&>button]:border-[#30363d] [&>button]:text-[#8a9bb0] [&>button]:hover:bg-[#30363d] [&>button]:hover:text-white [&>button]:hover:border-[#8a9bb0]"
        style={{
          width: '90vw',
          maxWidth: '500px',
          minWidth: '320px'
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-white text-lg font-bold flex items-center gap-2">
            <Shield size={20} className="text-[#00ED64]" />
            Before You Migrate
          </DialogTitle>
          <DialogDescription className="text-[#8a9bb0] text-sm">
            Please read this before starting your migration.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-1">
          {/* Free & Secure */}
          <div className="flex gap-3 bg-[#0d1117] rounded-xl p-4 border border-[#21262d] mb-1">
            <DollarSign size={18} className="text-[#00ED64] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-white mb-0.5">Free &amp; No data stored</p>
              <p className="text-xs text-[#8a9bb0]">This tool is completely free. Your connection strings are used only in-memory per request and are <span className="text-white">never logged, stored, or shared</span>.</p>
            </div>
          </div>

          {/* IP Access */}
          <div className="flex gap-3 bg-[#0d1117] rounded-xl p-4 border border-[#21262d] mb-1">
            <AlertTriangle size={18} className="text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-white mb-0.5">Set IP Access to <code className="text-yellow-400 bg-yellow-400/10 px-1 rounded text-xs">0.0.0.0/0</code></p>
              <p className="text-xs text-[#8a9bb0] mb-2">In MongoDB Atlas, go to <span className="text-white">Network Access</span> on <span className="text-white">both</span> source and destination clusters and add <code className="text-yellow-400 bg-yellow-400/10 px-1 rounded text-xs">0.0.0.0/0</code> before migrating.</p>
              <p className="text-xs text-red-400 font-medium">⚠️ Why 0.0.0.0/0? This app runs on servers with different IP addresses that don't match your computer's IP. We can't predict which IP will be used for your migration.</p>
            </div>
          </div>

          {/* Remove IP after */}
          <div className="flex gap-3 bg-[#0d1117] rounded-xl p-4 border border-[#21262d] mb-1">
            <Lock size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-white mb-0.5">❗ Remove <code className="text-yellow-400 bg-yellow-400/10 px-1 rounded text-xs">0.0.0.0/0</code> IMMEDIATELY after migration</p>
              <p className="text-xs text-[#8a9bb0]">Once migration is done, <span className="text-red-400 font-semibold">immediately remove</span> the open IP from both clusters and add only your trusted IPs. Set a reminder if needed!</p>
            </div>
          </div>

          {/* Change password */}
          <div className="flex gap-3 bg-[#0d1117] rounded-xl p-4 border border-[#21262d] mb-1">
            <ShieldCheck size={18} className="text-[#00ED64] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-white mb-0.5">Change your password after</p>
              <p className="text-xs text-[#8a9bb0]">After migration, go to <span className="text-white">Atlas → Database Access</span> and rotate your DB user password for security.</p>
            </div>
          </div>
        </div>

        {/* <DialogFooter className="bg-[#161b22] border-[#30363d] mt-4">
          <button
            onClick={onAccept}
            className="w-full bg-[#00ED64] hover:bg-[#00c853] text-[#0d1117] font-bold py-3 rounded-lg transition-colors"
          >
            I Understand the Security Risks, Let's Migrate
          </button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
