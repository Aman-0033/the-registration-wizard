import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, ShieldCheck, UserCheck, Calendar, Mail, KeyRound, Edit3, Send } from 'lucide-react';

/**
 * StepThree Component - Review & Confirmation
 * Displays structured summary of all entered information with inline jump-to-edit actions
 * and the primary submit button.
 *
 * @param {Object} props
 * @param {Object} props.formData - Form values to review
 * @param {Function} props.onEdit - Callback to jump to a specific step (1 or 2)
 * @param {Function} props.onBack - Callback to return to step 2
 * @param {boolean} props.isSubmitting - Loading state flag
 */
export default function StepThree({
  formData,
  onEdit,
  onBack,
  isSubmitting = false,
}) {
  const [peekPassword, setPeekPassword] = useState(false);

  // Mask password string e.g., '••••••••••••'
  const maskedPassword = formData.password
    ? '•'.repeat(Math.min(formData.password.length, 16))
    : '••••••••';

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Section Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
              <span>Review & Confirm Registration</span>
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Please inspect your registration details before committing your account creation.
            </p>
          </div>
          <span className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Ready for Submission</span>
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Card 1: Personal Information Summary */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 transition-colors">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/60">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Personal Information</h3>
                <p className="text-xs text-slate-400">Step 1 Details</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onEdit(1)}
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/40 border border-indigo-500/20 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Full Legal Name</span>
              <span className="text-sm font-semibold text-slate-100">
                {formData.firstName} {formData.lastName}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Date of Birth</span>
              <div className="flex items-center space-x-1.5 text-sm font-semibold text-slate-100">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{formData.dob || 'Not specified'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Account & Security Details */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 transition-colors">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/60">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Account & Security</h3>
                <p className="text-xs text-slate-400">Step 2 Details</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onEdit(2)}
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/40 border border-indigo-500/20 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Corporate Email</span>
              <div className="flex items-center space-x-1.5 text-sm font-semibold text-slate-100 break-all">
                <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span>{formData.email}</span>
              </div>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Passphrase Security</span>
              <div className="flex items-center justify-between bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800">
                <div className="flex items-center space-x-2">
                  <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono text-sm tracking-wider text-slate-200">
                    {peekPassword ? formData.password : maskedPassword}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setPeekPassword((prev) => !prev)}
                  className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 ml-2"
                >
                  {peekPassword ? 'Hide' : 'Peek'}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
            <span className="text-slate-400">Schema Validation Status</span>
            <span className="inline-flex items-center space-x-1 text-emerald-400 font-semibold">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Verified via Zod Schema</span>
            </span>
          </div>
        </div>

        {/* Regulatory Disclosure Banner */}
        <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-slate-300 flex items-start space-x-2.5">
          <ShieldCheck className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
          <span>
            By clicking <strong>Submit Registration</strong>, your identity payload will be validated
            by the Prodesk IT enterprise pipeline and emitted to the system console for audit compliance.
          </span>
        </div>
      </div>

      {/* Navigation & Submit Footer */}
      <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-all duration-200 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white shadow-lg shadow-emerald-600/30 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{isSubmitting ? 'Registering...' : 'Submit Registration'}</span>
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

