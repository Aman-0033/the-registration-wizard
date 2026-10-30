import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';

/**
 * Calculates password strength score (0 to 4) and metadata
 * @param {string} pwd
 * @returns {{ score: number, label: string, color: string, width: string }}
 */
function getPasswordStrength(pwd = '') {
  if (!pwd) {
    return { score: 0, label: 'None', color: 'bg-slate-700', width: '0%' };
  }

  let score = 0;
  if (pwd.length >= 8) score += 1;
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score += 1;
  if (/\d/.test(pwd)) score += 1;
  if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

  switch (score) {
    case 1:
      return { score: 1, label: 'Weak', color: 'bg-rose-500', width: '25%' };
    case 2:
      return { score: 2, label: 'Fair', color: 'bg-amber-500', width: '50%' };
    case 3:
      return { score: 3, label: 'Good', color: 'bg-sky-400', width: '75%' };
    case 4:
      return { score: 4, label: 'Strong', color: 'bg-emerald-400', width: '100%' };
    default:
      return { score: 0, label: 'Too short', color: 'bg-rose-600', width: '15%' };
  }
}

/**
 * StepTwo Component - Account & Security Credentials
 *
 * @param {Object} props
 * @param {Function} props.register - React Hook Form register function
 * @param {Object} props.errors - React Hook Form errors object
 * @param {Object} props.watchedValues - Live form values
 * @param {boolean} props.isStepValid - Step 2 validation status
 * @param {Function} props.onNext - Handler to advance to Step 3
 * @param {Function} props.onBack - Handler to return to Step 1
 */
export default function StepTwo({
  register,
  errors,
  watchedValues,
  isStepValid,
  onNext,
  onBack,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const email = watchedValues?.email || '';
  const password = watchedValues?.password || '';
  const confirmPassword = watchedValues?.confirmPassword || '';

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !errors.email;
  const isPasswordValid = password.length >= 8 && !errors.password;
  const isConfirmValid =
    confirmPassword.length > 0 &&
    confirmPassword === password &&
    !errors.confirmPassword;

  const strength = getPasswordStrength(password);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Section Header */}
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
          <span>Account & Security</span>
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Set up your corporate access credentials and enterprise-grade security passphrase.
        </p>
      </div>

      <div className="space-y-5">
        {/* Email Address */}
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
          >
            Email Address <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="name@company.com"
              {...register('email')}
              className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-sm font-medium text-white placeholder-slate-500 glass-input focus:outline-none transition-colors ${
                errors.email
                  ? 'border-rose-500/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30 bg-rose-950/20'
                  : isEmailValid
                  ? 'border-emerald-500/70 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30'
                  : 'border-slate-700 focus:border-indigo-500'
              }`}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              {errors.email ? (
                <AlertCircle className="w-4 h-4 text-rose-400" />
              ) : isEmailValid ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : null}
            </div>
          </div>
          {errors.email && (
            <p className="text-xs text-rose-400 flex items-center space-x-1.5 mt-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errors.email.message}</span>
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
          >
            Password <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Minimum 8 characters"
              {...register('password')}
              className={`w-full pl-10 pr-20 py-2.5 rounded-xl text-sm font-medium text-white placeholder-slate-500 glass-input focus:outline-none transition-colors ${
                errors.password
                  ? 'border-rose-500/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30 bg-rose-950/20'
                  : isPasswordValid
                  ? 'border-emerald-500/70 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30'
                  : 'border-slate-700 focus:border-indigo-500'
              }`}
            />
            <div className="absolute inset-y-0 right-0 pr-2 flex items-center space-x-1">
              {/* Validation Status Indicator */}
              {errors.password ? (
                <AlertCircle className="w-4 h-4 text-rose-400 mr-1" />
              ) : isPasswordValid ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-1" />
              ) : null}

              {/* Eyeball Visibility Toggle Button */}
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Password Strength Indicator */}
          {password.length > 0 && (
            <div className="mt-2 space-y-1.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Password Strength:</span>
                </span>
                <span className="font-semibold text-slate-200">{strength.label}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${strength.color} transition-all duration-300`}
                  style={{ width: strength.width }}
                />
              </div>
            </div>
          )}

          {errors.password && (
            <p className="text-xs text-rose-400 flex items-center space-x-1.5 mt-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errors.password.message}</span>
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label
            htmlFor="confirmPassword"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
          >
            Confirm Password <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Re-enter your password"
              {...register('confirmPassword')}
              className={`w-full pl-10 pr-20 py-2.5 rounded-xl text-sm font-medium text-white placeholder-slate-500 glass-input focus:outline-none transition-colors ${
                errors.confirmPassword
                  ? 'border-rose-500/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30 bg-rose-950/20'
                  : isConfirmValid
                  ? 'border-emerald-500/70 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30'
                  : 'border-slate-700 focus:border-indigo-500'
              }`}
            />
            <div className="absolute inset-y-0 right-0 pr-2 flex items-center space-x-1">
              {/* Validation Status Indicator */}
              {errors.confirmPassword ? (
                <AlertCircle className="w-4 h-4 text-rose-400 mr-1" />
              ) : isConfirmValid ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-1" />
              ) : null}

              {/* Eyeball Visibility Toggle Button */}
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {errors.confirmPassword && (
            <p className="text-xs text-rose-400 flex items-center space-x-1.5 mt-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errors.confirmPassword.message}</span>
            </p>
          )}

          {!errors.confirmPassword && confirmPassword && confirmPassword === password && (
            <p className="text-xs text-emerald-400 flex items-center space-x-1.5 mt-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Passwords match perfectly.</span>
            </p>
          )}
        </div>
      </div>

      {/* Navigation Footer */}
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
          type="button"
          onClick={onNext}
          disabled={!isStepValid}
          className={`inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md ${
            isStepValid
              ? 'bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white shadow-indigo-600/30 cursor-pointer'
              : 'bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed opacity-60'
          }`}
        >
          <span>Review Details</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

