import React from 'react';
import { Check, User, ShieldCheck, FileCheck2 } from 'lucide-react';

const steps = [
  { id: 1, label: 'Personal Info', description: 'Identity & Age', icon: User },
  { id: 2, label: 'Account Details', description: 'Credentials & Security', icon: ShieldCheck },
  { id: 3, label: 'Review & Submit', description: 'Confirm Registration', icon: FileCheck2 },
];

/**
 * ProgressBar Component
 * Renders step counter, percentage progress bar, and visual step indicators.
 *
 * @param {Object} props
 * @param {number} props.currentStep - Current active step index (1, 2, or 3)
 */
export default function ProgressBar({ currentStep }) {
  const percentage = Math.round((currentStep / 3) * 100);

  return (
    <div className="w-full mb-8">
      {/* Top Header: Step Counter & Progress Percentage */}
      <div className="flex items-center justify-between mb-3 text-sm">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Step {currentStep} of 3
          </span>
          <span className="text-slate-400 text-xs hidden sm:inline">
            {steps[currentStep - 1]?.label}
          </span>
        </div>
        <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-300">
          <span>{percentage}% Completed</span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="relative w-full h-2 bg-slate-800/80 rounded-full overflow-hidden border border-slate-700/50 mb-6">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-emerald-400 rounded-full transition-all duration-500 ease-out shadow-sm"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Step Indicators with Labels */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {steps.map((s) => {
          const isCompleted = currentStep > s.id;
          const isActive = currentStep === s.id;
          const StepIcon = s.icon;

          return (
            <div
              key={s.id}
              className={`flex flex-col items-center sm:items-start text-center sm:text-left transition-all duration-300 p-2.5 rounded-xl border ${
                isActive
                  ? 'bg-indigo-950/40 border-indigo-500/50 shadow-sm ring-1 ring-indigo-500/30'
                  : isCompleted
                  ? 'bg-slate-900/60 border-emerald-500/30'
                  : 'bg-slate-900/20 border-slate-800/60 opacity-60'
              }`}
            >
              <div className="flex items-center space-x-2 sm:mb-1">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                    isCompleted
                      ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/30'
                      : isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/40 ring-2 ring-indigo-400/40'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : (
                    <span>{s.id}</span>
                  )}
                </div>
                <span
                  className={`text-xs font-semibold hidden sm:inline ${
                    isActive
                      ? 'text-white'
                      : isCompleted
                      ? 'text-emerald-400'
                      : 'text-slate-400'
                  }`}
                >
                  {s.label}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block truncate w-full">
                {s.description}
              </p>
              <span
                className={`text-[11px] font-medium sm:hidden mt-1 ${
                  isActive ? 'text-indigo-300' : isCompleted ? 'text-emerald-400' : 'text-slate-400'
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

