import React, { useState } from 'react';
import { Terminal, ChevronDown, ChevronUp, Copy, Check, CheckCircle2, XCircle, Activity } from 'lucide-react';

/**
 * PayloadInspector Component
 * QA and developer debugging drawer that renders live form state,
 * validation step booleans, and finalized console payload in real time.
 *
 * @param {Object} props
 * @param {Object} props.formData - Master lifted state object
 * @param {number} props.currentStep - Active step (1, 2, or 3)
 * @param {boolean} props.isStep1Valid - Step 1 real-time validity
 * @param {boolean} props.isStep2Valid - Step 2 real-time validity
 * @param {Object|null} props.submittedPayload - Payload emitted upon submission
 */
export default function PayloadInspector({
  formData,
  currentStep,
  isStep1Valid,
  isStep2Valid,
  submittedPayload,
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  // Mask password in debug view if preferred or show full for audit
  const auditState = {
    _step: currentStep,
    _validation: {
      isStep1Valid,
      isStep2Valid,
    },
    liftedFormData: formData,
    submittedConsolePayload: submittedPayload,
  };

  const jsonString = JSON.stringify(auditState, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 border border-slate-800 rounded-2xl bg-slate-950/80 backdrop-blur-md overflow-hidden shadow-2xl transition-all duration-300">
      {/* Header Bar */}
      <div className="px-4 py-3 bg-slate-900/80 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <Terminal className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold text-slate-200 tracking-wide uppercase">
            Live State &amp; Console Payload Inspector
          </span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            QA Audit View
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Validation Status Badges */}
          <div className="hidden sm:flex items-center space-x-2 mr-2">
            <span
              className={`inline-flex items-center space-x-1 text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                isStep1Valid
                  ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
                  : 'bg-rose-950/30 text-rose-400 border-rose-500/20'
              }`}
            >
              {isStep1Valid ? (
                <CheckCircle2 className="w-3 h-3" />
              ) : (
                <XCircle className="w-3 h-3" />
              )}
              <span>Step 1</span>
            </span>

            <span
              className={`inline-flex items-center space-x-1 text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                isStep2Valid
                  ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
                  : 'bg-rose-950/30 text-rose-400 border-rose-500/20'
              }`}
            >
              {isStep2Valid ? (
                <CheckCircle2 className="w-3 h-3" />
              ) : (
                <XCircle className="w-3 h-3" />
              )}
              <span>Step 2</span>
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Copy Inspector JSON"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Toggle drawer"
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expandable Body */}
      {isOpen && (
        <div className="p-4 space-y-3 font-mono text-xs">
          {/* Status Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pb-3 border-b border-slate-800/80">
            <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">CURRENT STEP</span>
              <span className="text-indigo-400 font-bold">{currentStep} / 3</span>
            </div>
            <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">STEP 1 VALID</span>
              <span className={isStep1Valid ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                {String(isStep1Valid)}
              </span>
            </div>
            <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">STEP 2 VALID</span>
              <span className={isStep2Valid ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                {String(isStep2Valid)}
              </span>
            </div>
            <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">PAYLOAD STATUS</span>
              <span className={submittedPayload ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                {submittedPayload ? 'COMMITTED' : 'AWAITING'}
              </span>
            </div>
          </div>

          {/* JSON Tree View */}
          <div className="relative">
            <pre className="p-3 rounded-xl bg-slate-950 text-indigo-300 overflow-x-auto text-[11px] leading-relaxed border border-slate-800/80 max-h-60 overflow-y-auto">
              <code>{jsonString}</code>
            </pre>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
            <span className="flex items-center space-x-1">
              <Activity className="w-3 h-3 text-emerald-400" />
              <span>Real-time keystroke synchronization enabled (mode: onChange)</span>
            </span>
            <span>Sprint 7 QA Audited</span>
          </div>
        </div>
      )}
    </div>
  );
}

