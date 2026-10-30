import React from 'react';
import { User, Calendar, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

/**
 * StepOne Component - Personal Information
 * Captures First Name, Last Name, and Date of Birth with real-time validation.
 *
 * @param {Object} props
 * @param {Function} props.register - React Hook Form register function
 * @param {Object} props.errors - React Hook Form errors object
 * @param {Object} props.watchedValues - Current live form values
 * @param {boolean} props.isStepValid - Step 1 validation status
 * @param {Function} props.onNext - Handler to advance to next step
 */
export default function StepOne({
  register,
  errors,
  watchedValues,
  isStepValid,
  onNext,
}) {
  const firstName = watchedValues?.firstName || '';
  const lastName = watchedValues?.lastName || '';
  const dob = watchedValues?.dob || '';

  const isFirstNameValid = firstName.trim().length >= 2 && !errors.firstName;
  const isLastNameValid = lastName.trim().length >= 2 && !errors.lastName;
  const isDobValid = Boolean(dob) && !errors.dob;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Section Header */}
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
          <span>Personal Information</span>
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Please provide your legal identity details for account verification and compliance.
        </p>
      </div>

      {/* Inputs Form Grid */}
      <div className="space-y-5">
        {/* First Name & Last Name (2 Columns on tablet/desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* First Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="firstName"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
            >
              First Name <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="firstName"
                type="text"
                autoComplete="given-name"
                placeholder="e.g., Aman"
                {...register('firstName')}
                className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-sm font-medium text-white placeholder-slate-500 glass-input focus:outline-none transition-colors ${
                  errors.firstName
                    ? 'border-rose-500/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30 bg-rose-950/20'
                    : isFirstNameValid
                    ? 'border-emerald-500/70 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30'
                    : 'border-slate-700 focus:border-indigo-500'
                }`}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                {errors.firstName ? (
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                ) : isFirstNameValid ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : null}
              </div>
            </div>
            {errors.firstName && (
              <p className="text-xs text-rose-400 flex items-center space-x-1.5 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{errors.firstName.message}</span>
              </p>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="lastName"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
            >
              Last Name <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="lastName"
                type="text"
                autoComplete="family-name"
                placeholder="e.g., Saini"
                {...register('lastName')}
                className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-sm font-medium text-white placeholder-slate-500 glass-input focus:outline-none transition-colors ${
                  errors.lastName
                    ? 'border-rose-500/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30 bg-rose-950/20'
                    : isLastNameValid
                    ? 'border-emerald-500/70 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30'
                    : 'border-slate-700 focus:border-indigo-500'
                }`}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                {errors.lastName ? (
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                ) : isLastNameValid ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : null}
              </div>
            </div>
            {errors.lastName && (
              <p className="text-xs text-rose-400 flex items-center space-x-1.5 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{errors.lastName.message}</span>
              </p>
            )}
          </div>
        </div>

        {/* Date of Birth */}
        <div className="space-y-1.5">
          <label
            htmlFor="dob"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
          >
            Date of Birth <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Calendar className="w-4 h-4" />
            </div>
            <input
              id="dob"
              type="date"
              max={new Date().toISOString().split('T')[0]}
              {...register('dob')}
              className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-sm font-medium text-white placeholder-slate-500 glass-input focus:outline-none transition-colors ${
                errors.dob
                  ? 'border-rose-500/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30 bg-rose-950/20'
                  : isDobValid
                  ? 'border-emerald-500/70 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30'
                  : 'border-slate-700 focus:border-indigo-500'
              }`}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              {errors.dob ? (
                <AlertCircle className="w-4 h-4 text-rose-400" />
              ) : isDobValid ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : null}
            </div>
          </div>
          {errors.dob ? (
            <p className="text-xs text-rose-400 flex items-center space-x-1.5 mt-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errors.dob.message}</span>
            </p>
          ) : (
            <p className="text-[11px] text-slate-400">
              FinTech regulatory compliance requires account holders to be at least 18 years of age.
            </p>
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="pt-6 border-t border-slate-800/80 flex items-center justify-end">
        <button
          type="button"
          onClick={onNext}
          disabled={!isStepValid}
          className={`inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md ${
            isStepValid
              ? 'bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white shadow-indigo-600/30 cursor-pointer'
              : 'bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed opacity-60'
          }`}
        >
          <span>Next Step</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

