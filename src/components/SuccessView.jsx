import React, { useState } from 'react';
import { CheckCircle2, Copy, Check, RotateCcw, ShieldCheck, Terminal } from 'lucide-react';

/**
 * SuccessView Component
 * Renders the celebratory completion state and displays the logged payload.
 *
 * @param {Object} props
 * @param {Object} props.payload - The finalized submitted registration payload
 * @param {Function} props.onReset - Handler to restart registration wizard
 */
export default function SuccessView({ payload, onReset }) {
  const [copied, setCopied] = useState(false);

  const formattedJson = JSON.stringify(payload, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const firstName = payload?.firstName || 'User';

  return (
    <div className="space-y-6 text-center animate-fadeIn py-4">
      {/* Celebration Icon */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/20 ring-4 ring-emerald-500/10">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-md">
            ✓
          </div>
        </div>
      </div>

      {/* Header & Subtitle */}
      <div className="space-y-2">
        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Prodesk IT Registration Complete</span>
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Welcome aboard, {firstName}!
        </h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Your corporate account has been provisioned and verified through the Sprint 7 multi-step pipeline.
        </p>
      </div>

      {/* Console Payload Inspection Card */}
      <div className="text-left bg-slate-950 rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-inner">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>Emitted Console Payload [Audit Record]</span>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center space-x-1 text-xs text-slate-400 hover:text-white transition-colors px-2 py-1 rounded-md bg-slate-900 border border-slate-800 hover:bg-slate-800 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy JSON</span>
              </>
            )}
          </button>
        </div>

        <pre className="font-mono text-xs text-emerald-400/90 bg-slate-900/60 p-3.5 rounded-xl overflow-x-auto leading-relaxed border border-slate-800/60">
          <code>{formattedJson}</code>
        </pre>

        <p className="text-[11px] text-slate-400 mt-3 flex items-center justify-between">
          <span>Logged to Developer DevTools via console.log()</span>
          <span className="font-mono text-slate-400 text-[10px]">HTTP 200 OK</span>
        </p>
      </div>

      {/* Reset Action */}
      <div className="pt-2 flex justify-center">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all duration-200 shadow-md cursor-pointer hover:text-white"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset &amp; Start New Registration</span>
        </button>
      </div>
    </div>
  );
}

