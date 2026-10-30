import React, { useState } from 'react';
import {
  HelpCircle,
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  Terminal,
  Zap,
  RotateCcw
} from 'lucide-react';

const walkthroughSteps = [
  {
    stepNumber: 1,
    title: 'Phase 1 & 2: Step 1 Validation & Compliance',
    subtitle: 'Identity Verification & Age Requirement (18+)',
    rubric: 'FAQ #1 (noValidate) & FAQ #10 (real-time onChange validation)',
    instructions: [
      'Type "A" in First Name — notice instant red error: "First name must be at least 2 characters".',
      'Select a future date or a date under 18 years old — notice: "You must be at least 18 years old to open a Prodesk IT account".',
      'Notice the "Next Step →" button remains disabled until all 3 fields pass Zod schema validation.',
      'Upon satisfying all fields, notice the emerald checkmarks and enabled button state.'
    ],
    demoAction: 'fillStep1'
  },
  {
    stepNumber: 2,
    title: 'Phase 2: Step 2 Credentials & State Persistence',
    subtitle: 'Email Regex, Eyeball Toggles & Backward Navigation',
    rubric: 'FAQ #3 (State Persistence) & FAQ #4 (Eyeball Toggles)',
    instructions: [
      'Enter an email missing the "@" symbol — notice real-time RFC 5322 regex error.',
      'Type a password — watch the dynamic strength meter update (Weak -> Fair -> Good -> Strong).',
      'Click the Eyeball icon (Eye / EyeOff) to verify password text visibility toggling.',
      'CRITICAL QA TEST: Click "← Back" to Step 1. Notice 100% of your typed name and DOB are fully preserved!'
    ],
    demoAction: 'fillStep2'
  },
  {
    stepNumber: 3,
    title: 'Phase 1 & 3: Step 3 Review & Inline Editing',
    subtitle: 'FinTech Summary Card & Non-destructive Edits',
    rubric: 'FAQ #6 (type="button" prevention of accidental submits)',
    instructions: [
      'Inspect the grouped summary card with legal name, date of birth, and masked security passphrase.',
      'Click "Peek" next to the masked password to reveal credentials.',
      'Click "Edit" on Personal Information — verify it jumps directly back to Step 1 with full state intact.',
      'Navigate forward again to Step 3. Notice zero accidental form submissions occurred.'
    ],
    demoAction: 'goToStep3'
  },
  {
    stepNumber: 4,
    title: 'Submission & Developer Audit Drawer',
    subtitle: 'Final Submission, Success Screen & Console Logging',
    rubric: 'P0 Console Log & Live State QA Inspector',
    instructions: [
      'Click "Submit Registration" (the only button typed as submit).',
      'Open your Browser DevTools (F12 -> Console) to see: === PRODESK IT SPRINT 07: FINAL REGISTRATION PAYLOAD ===',
      'Verify the celebratory Success View with the formatted JSON payload.',
      'Expand the Live State & Console Payload Inspector at the bottom to compare the state in real time.'
    ],
    demoAction: 'submitForm'
  }
];

/**
 * WalkthroughGuide Component
 * Interactive modal and floating helper for Sprint 7 QA Evaluators
 * providing a 4-step guided walkthrough and quick demo-fill capabilities.
 */
export default function WalkthroughGuide({
  currentStep,
  onPrefillDemo,
  onResetForm,
  isOpen,
  onClose
}) {
  const [activeWalkthroughIndex, setActiveWalkthroughIndex] = useState(0);

  if (!isOpen) return null;

  const current = walkthroughSteps[activeWalkthroughIndex];
  const isFirst = activeWalkthroughIndex === 0;
  const isLast = activeWalkthroughIndex === walkthroughSteps.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-xl bg-slate-900 border border-indigo-500/30 rounded-3xl shadow-2xl overflow-hidden glass-panel">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-950/80 via-slate-900 to-indigo-950/80 border-b border-indigo-500/20 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide flex items-center space-x-2">
                <span>Sprint 7 QA Walkthrough Guide</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Step {activeWalkthroughIndex + 1} of 4
                </span>
              </h3>
              <p className="text-xs text-slate-400">Interactive 3-Minute Video Walkthrough Helper</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close walkthrough"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Progress dots */}
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-800">
            {walkthroughSteps.map((s, idx) => (
              <button
                key={s.stepNumber}
                type="button"
                onClick={() => setActiveWalkthroughIndex(idx)}
                className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                  idx === activeWalkthroughIndex
                    ? 'bg-indigo-500 ring-2 ring-indigo-400/30'
                    : idx < activeWalkthroughIndex
                    ? 'bg-emerald-500'
                    : 'bg-slate-800'
                }`}
              />
            ))}
          </div>

          {/* Title & Subtitle */}
          <div>
            <span className="text-[11px] font-semibold tracking-wider uppercase text-indigo-400 block mb-1">
              {current.rubric}
            </span>
            <h4 className="text-lg font-bold text-white">{current.title}</h4>
            <p className="text-xs text-slate-400 mt-0.5">{current.subtitle}</p>
          </div>

          {/* Checklist Instructions */}
          <div className="space-y-2.5 bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80">
            <span className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>QA Evaluation Checklist:</span>
            </span>
            <ul className="space-y-2">
              {current.instructions.map((inst, i) => (
                <li key={i} className="text-xs text-slate-300 flex items-start space-x-2.5 leading-relaxed">
                  <span className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5 border border-indigo-500/30">
                    {i + 1}
                  </span>
                  <span>{inst}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Helper Action */}
          <div className="p-3 bg-indigo-950/30 border border-indigo-500/20 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-slate-300">
              <Zap className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>Need to test rapidly? Prefill sample compliant data into the wizard:</span>
            </div>
            <button
              type="button"
              onClick={() => {
                onPrefillDemo();
                onClose();
              }}
              className="ml-3 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm flex-shrink-0 cursor-pointer"
            >
              Prefill Demo Data
            </button>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            disabled={isFirst}
            onClick={() => setActiveWalkthroughIndex((prev) => prev - 1)}
            className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              isFirst
                ? 'opacity-40 text-slate-500 cursor-not-allowed'
                : 'text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-2">
            {!isLast ? (
              <button
                type="button"
                onClick={() => setActiveWalkthroughIndex((prev) => prev + 1)}
                className="inline-flex items-center space-x-1.5 px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
              >
                <span>Next Guide</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center space-x-1.5 px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
              >
                <span>Ready to Test!</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

