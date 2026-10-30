import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registrationSchema, step1Schema, step2Schema } from './schemas/registrationSchema.js';
import ProgressBar from './components/ProgressBar.jsx';
import StepOne from './components/StepOne.jsx';
import StepTwo from './components/StepTwo.jsx';
import StepThree from './components/StepThree.jsx';
import SuccessView from './components/SuccessView.jsx';
import PayloadInspector from './components/PayloadInspector.jsx';
import WalkthroughGuide from './components/WalkthroughGuide.jsx';
import { Layers, ShieldCheck, Sparkles, HelpCircle, Zap } from 'lucide-react';

/**
 * App Component - Master Parent Container for "The Registration Wizard"
 * Implements Prodesk IT Sprint 7 Architecture:
 * - Conditional Step Rendering (no react-router-dom)
 * - Lifting State Up + React Hook Form (shouldUnregister: false)
 * - Real-time Zod schema validation (mode: "onChange")
 * - Form submission prevention on non-terminal actions
 * - Built-in Interactive QA Walkthrough Helper
 */
export default function App() {
  // Step Navigation State: 1 = Personal Info, 2 = Account Details, 3 = Review & Submit
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedPayload, setSubmittedPayload] = useState(null);
  const [isWalkthroughOpen, setIsWalkthroughOpen] = useState(false);

  // Master lifted form state (persists across unmounted steps)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Enterprise Form Stack: React Hook Form + Zod Resolver
  const {
    register,
    handleSubmit,
    trigger,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registrationSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldUnregister: false, // Critical: preserves input values when steps unmount
    defaultValues: formData,
  });

  // Real-time watched form values
  const watchedValues = watch();

  // Synchronize React Hook Form watch stream into lifted parent state
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      ...watchedValues,
    }));
  }, [
    watchedValues.firstName,
    watchedValues.lastName,
    watchedValues.dob,
    watchedValues.email,
    watchedValues.password,
    watchedValues.confirmPassword,
  ]);

  // Compute real-time step validity using Zod safeParse
  const isStep1Valid = step1Schema.safeParse({
    firstName: watchedValues.firstName,
    lastName: watchedValues.lastName,
    dob: watchedValues.dob,
  }).success;

  const isStep2Valid = step2Schema.safeParse({
    email: watchedValues.email,
    password: watchedValues.password,
    confirmPassword: watchedValues.confirmPassword,
  }).success;

  /**
   * Advanced step progression handler
   * Explicitly triggers validation on current step fields before incrementing step
   */
  const handleNext = async () => {
    if (step === 1) {
      const isValid = await trigger(['firstName', 'lastName', 'dob']);
      if (isValid && isStep1Valid) {
        setStep(2);
      }
    } else if (step === 2) {
      const isValid = await trigger(['email', 'password', 'confirmPassword']);
      if (isValid && isStep2Valid) {
        setStep(3);
      }
    }
  };

  /**
   * Step regression handler - preserves state cleanly
   */
  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  /**
   * Jump directly to a step for inline editing from Step 3
   */
  const handleEdit = (targetStep) => {
    if (targetStep >= 1 && targetStep <= 2) {
      setStep(targetStep);
    }
  };

  /**
   * Final form submission handler
   * Emits finalized payload to console.log and switches to Success View
   */
  const onSubmit = (data) => {
    console.log('=== PRODESK IT SPRINT 07: FINAL REGISTRATION PAYLOAD ===', data);
    setSubmittedPayload(data);
    setIsSubmitted(true);
  };

  /**
   * Resets form to pristine state
   */
  const handleReset = () => {
    const emptyState = {
      firstName: '',
      lastName: '',
      dob: '',
      email: '',
      password: '',
      confirmPassword: '',
    };
    reset(emptyState);
    setFormData(emptyState);
    setSubmittedPayload(null);
    setIsSubmitted(false);
    setStep(1);
  };

  /**
   * Prefills compliant test data for fast QA verification
   */
  const handlePrefillDemo = () => {
    const sampleData = {
      firstName: 'Aman',
      lastName: 'Saini',
      dob: '1998-05-15',
      email: 'aman.saini@prodesk.it',
      password: 'FinTech$ecure2026',
      confirmPassword: 'FinTech$ecure2026',
    };
    reset(sampleData);
    setFormData(sampleData);
    trigger();
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-between">
      {/* Background Decorative Blur Spheres */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-10 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      {/* Interactive Walkthrough Modal */}
      <WalkthroughGuide
        currentStep={step}
        onPrefillDemo={handlePrefillDemo}
        onResetForm={handleReset}
        isOpen={isWalkthroughOpen}
        onClose={() => setIsWalkthroughOpen(false)}
      />

      {/* Main Container */}
      <main className="w-full max-w-2xl mx-auto flex-1 flex flex-col justify-center">
        {/* Brand & Application Header */}
        <header className="text-center mb-6 space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Prodesk IT Enterprise Onboarding</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            The Registration Wizard
          </h1>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            Sprint 7 Phase 3 FinTech onboarding flow with real-time schema validation,
            lifted state persistence, and audit logging.
          </p>

          {/* Action Bar for Walkthrough & Quick Testing */}
          <div className="flex items-center justify-center space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setIsWalkthroughOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-all hover:scale-[1.02] cursor-pointer shadow-sm"
            >
              <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
              <span>▶ 3-Min QA Walkthrough Guide</span>
            </button>

            <button
              type="button"
              onClick={handlePrefillDemo}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-all hover:scale-[1.02] cursor-pointer shadow-sm"
              title="Prefill sample valid data to test flow rapidly"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Prefill Demo Data</span>
            </button>
          </div>
        </header>

        {/* Wizard Card Surface */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 transition-all duration-300">
          {!isSubmitted ? (
            <>
              {/* Dynamic Step Progress Indicator */}
              <ProgressBar currentStep={step} />

              {/* Multi-Step Form with noValidate to disable native popups */}
              <form noValidate onSubmit={handleSubmit(onSubmit)}>
                {/* Step 1: Personal Info */}
                {step === 1 && (
                  <StepOne
                    register={register}
                    errors={errors}
                    watchedValues={watchedValues}
                    isStepValid={isStep1Valid}
                    onNext={handleNext}
                  />
                )}

                {/* Step 2: Account Details */}
                {step === 2 && (
                  <StepTwo
                    register={register}
                    errors={errors}
                    watchedValues={watchedValues}
                    isStepValid={isStep2Valid}
                    onNext={handleNext}
                    onBack={handleBack}
                  />
                )}

                {/* Step 3: Review & Submit */}
                {step === 3 && (
                  <StepThree
                    formData={watchedValues}
                    onEdit={handleEdit}
                    onBack={handleBack}
                    isSubmitting={isSubmitting}
                  />
                )}
              </form>
            </>
          ) : (
            /* Final Celebratory Success View */
            <SuccessView payload={submittedPayload} onReset={handleReset} />
          )}
        </div>

        {/* Developer Live State & Console Payload Inspector */}
        <PayloadInspector
          formData={watchedValues}
          currentStep={step}
          isStep1Valid={isStep1Valid}
          isStep2Valid={isStep2Valid}
          submittedPayload={submittedPayload}
        />
      </main>

      {/* Global Footer */}
      <footer className="mt-12 text-center text-xs text-slate-400 space-y-1">
        <div className="flex items-center justify-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-medium text-slate-300">Prodesk IT FinTech Security Standards</span>
          <span>•</span>
          <span>Sprint 7 QA Audited</span>
        </div>
        <p>Enterprise Form Architecture with React Hook Form + Zod &bull; Zero native HTML5 popups &bull; 100% State Persistence</p>
      </footer>
    </div>
  );
}
