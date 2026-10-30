# Prodesk IT Sprint 7 — Engineering & Debugging Sessions Log (`Prompts.md`)

This document serves as the official audit log and prompt engineering transcript for **Prodesk IT — Sprint 7 (Phase 3: Core Engineering)**: *"The Registration Wizard"*. It records the architectural decisions, trade-offs, debugging hurdles, and production-hardening solutions across four engineering sessions.

---

## Session 1: Conditional Rendering vs. React Router & State Persistence

### 1. Architectural Challenge & Context
During early Phase 1 reviews, a common anti-pattern was considered: using `react-router-dom` to route between onboarding steps (`/step-1`, `/step-2`, `/step-3`). This introduced severe architectural flaws:
1. **Unwanted History Fragmentation**: Pressing the browser back button risked exiting the application or skipping critical validation checks.
2. **Deep-linking Exploitation**: Users could bypass step validation and directly access `/step-3` via the address bar without filling out required identity fields.
3. **State Loss on Component Unmount**: When components unmount between route transitions, local React state is destroyed unless persisted into a persistent global store or lifted state container.

### 2. Prompt Issued to Principal Frontend Architect
> *"How should we architect the multi-step navigation for 'The Registration Wizard' to ensure strict conditional rendering without React Router, while guaranteeing 100% form data persistence when the user toggles back and forth between steps?"*

### 3. Architecture & Trade-Off Analysis
- **Decision**: Enforce **Conditional Rendering** strictly inside a single Master Parent component (`App.jsx`):
  ```jsx
  {step === 1 && <StepOne register={register} errors={errors} watchedValues={watchedValues} isStepValid={isStep1Valid} onNext={handleNext} />}
  {step === 2 && <StepTwo register={register} errors={errors} watchedValues={watchedValues} isStepValid={isStep2Valid} onNext={handleNext} onBack={handleBack} />}
  {step === 3 && <StepThree formData={watchedValues} onEdit={handleEdit} onBack={handleBack} isSubmitting={isSubmitting} />}
  ```
- **State Persistence via Lifting State Up**:
  Form state is centralized in the parent container. Even when `<StepOne />` unmounts upon transitioning to Step 2, the master state (`formData` and React Hook Form's internal store) retains the captured inputs.
- **Verification**:
  Typing "Aman", "Saini", and selecting a valid birthdate in Step 1, navigating to Step 2, and clicking the "← Back" button restores the exact values in the inputs with zero state evaporation.

---

## Session 2: Real-Time onChange Validation, Native Refresh Prevention & Eyeball Toggles

### 1. Architectural Challenge & Context
In standard HTML forms, clicking any `<button>` without an explicit `type` attribute defaults to `type="submit"`. In multi-step wizards, clicking "Next", "Back", or an eyeball toggle inadvertently submits the parent `<form>`, reloads the browser tab, clears memory, and violates FinTech audit requirements. Furthermore, default HTML5 browser tooltips (e.g., "Please fill in this field") fail WCAG accessibility standards and look inconsistent across browsers.

### 2. Prompt Issued to Principal Frontend Architect
> *"How do we completely eliminate accidental page reloads, disable native browser validation popups, configure instantaneous real-time regex feedback on every keystroke, and engineer secure eyeball toggles for credential fields?"*

### 3. Engineering Implementation Details
1. **Disabling Native Tooltips (FAQ #1)**:
   Applied `noValidate` to the `<form>` root:
   ```jsx
   <form noValidate onSubmit={handleSubmit(onSubmit)}>
   ```
2. **Strict Button Typing (FAQ #6)**:
   Every non-terminal button explicitly declares `type="button"`:
   - Next Button: `<button type="button" onClick={handleNext} disabled={!isStep1Valid}>`
   - Back Button: `<button type="button" onClick={onBack}>`
   - Visibility Toggles: `<button type="button" onClick={() => setShowPassword(p => !p)}>`
   Only the terminal CTA on Step 3 is typed `<button type="submit">`.
3. **Real-time `onChange` Keystroke Validation (FAQ #10)**:
   The form engine evaluates inputs on every stroke (`mode: "onChange"`). Email is validated against standard RFC 5322 regex:
   ```javascript
   /^[^\s@]+@[^\s@]+\.[^\s@]+$/
   ```
   If the user types an invalid email, an alert badge appears instantly; once valid, green checkmark indicators activate and the "Review Details →" button becomes enabled.
4. **Independent Eyeball Toggles (FAQ #4)**:
   Implemented separate state hooks (`showPassword` and `showConfirmPassword`) in `StepTwo.jsx` with Lucide icons (`Eye` and `EyeOff`), toggling `<input type={showPassword ? 'text' : 'password'}>`.

---

## Session 3: Enterprise Form Architecture Migration (React Hook Form + Zod)

### 1. Architectural Challenge & Context
Early prototypes relied on numerous disconnected `useState` hooks and manual validation functions. This caused excessive re-renders, boilerplate sprawl, and inconsistent schema enforcement across steps.

### 2. Prompt Issued to Principal Frontend Architect
> *"Migrate the wizard from manual useState validation to an enterprise-grade form architecture using `react-hook-form` and `zod` via `@hookform/resolvers/zod`. Ensure `shouldUnregister: false` is configured so unmounted step fields survive navigation."*

### 3. Engineering Implementation Details
- **Schema Modularization (`src/schemas/registrationSchema.js`)**:
  Separated `step1Schema` (First Name, Last Name, DOB with 18+ age verification), `step2Schema` (Email, Password min 8 chars, Confirm Password matching), and the combined `registrationSchema`:
  ```javascript
  export const step2Schema = z
    .object({
      email: z.string().min(1, "Email is required").regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address containing '@'"),
      password: z.string().min(8, "Password must be at least 8 characters long"),
      confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });
  ```
- **Configuration in `App.jsx`**:
  ```javascript
  const { register, handleSubmit, trigger, watch, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registrationSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldUnregister: false, // Prevents field teardown when StepOne/StepTwo unmounts
    defaultValues: formData,
  });
  ```
- **Reactive Step Validity Calculation**:
  ```javascript
  const isStep1Valid = step1Schema.safeParse({
    firstName: watchedValues.firstName,
    lastName: watchedValues.lastName,
    dob: watchedValues.dob,
  }).success;
  ```
  This cleanly decouples button enablement from the overarching master schema while ensuring Step 1 only evaluates Step 1 rules.

---

## Session 4: Linux Case-Sensitivity & Vercel Deployment Audit

### 1. Architectural Challenge & Context
Windows filesystems (NTFS) are case-insensitive, meaning an import like `import StepOne from './components/stepOne.jsx'` succeeds locally on Windows but immediately crashes in Vercel’s CI/CD pipeline (Ubuntu Linux) with:
`Module not found: Can't resolve './components/stepOne.jsx'`.

### 2. Prompt Issued to Principal Frontend Architect
> *"Conduct a strict audit of all component filenames and import statements across the entire codebase to guarantee exact PascalCase compatibility with Linux and Vercel build servers."*

### 3. Audit Results & Enforcement
| Physical File on Disk | Import Statement in `App.jsx` | Audit Result |
| :--- | :--- | :--- |
| `src/components/ProgressBar.jsx` | `import ProgressBar from './components/ProgressBar.jsx';` | PASS |
| `src/components/StepOne.jsx` | `import StepOne from './components/StepOne.jsx';` | PASS |
| `src/components/StepTwo.jsx` | `import StepTwo from './components/StepTwo.jsx';` | PASS |
| `src/components/StepThree.jsx` | `import StepThree from './components/StepThree.jsx';` | PASS |
| `src/components/SuccessView.jsx` | `import SuccessView from './components/SuccessView.jsx';` | PASS |
| `src/components/PayloadInspector.jsx` | `import PayloadInspector from './components/PayloadInspector.jsx';` | PASS |
| `src/schemas/registrationSchema.js` | `import { ... } from './schemas/registrationSchema.js';` | PASS |

- **Verification Command**:
  `npm run build` executed successfully using Vite v6, verifying that all modules, JSX components, and CSS bundles compile without resolution errors.



---

## Session 5: 3-Minute Video Walkthrough Script & QA Demonstration Guide

### 1. Architectural Challenge & Context
Prodesk IT QA requires a structured 3-minute video recording proving all P0, P1, and P2 functional deliverables, schema boundary checks, zero-refresh behavior, and live state logging.

### 2. Prompt Issued to Principal Frontend Architect
> *"Design a second-by-second 3-minute demonstration script and walkthrough guide covering every Sprint 7 rubric: conditional rendering, real-time Zod keystroke validation, state persistence across unmounted steps, eyeball toggles, password strength metering, inline editing jumps, and the on-screen live DevTools inspector."*

### 3. Step-by-Step 3-Minute QA Video Walkthrough Script

#### Timestamp 0:00 – 0:30 | Introduction & Tech Stack Overview
- **Visual**: Show browser at `http://localhost:3000/`. Expand DevTools Console (`F12`).
- **Narrative**:
  > *"Welcome to the Prodesk IT Sprint 7 Phase 3 demonstration of 'The Registration Wizard'. Built with React 18, Vite, Tailwind CSS, and an Enterprise Form Stack powered by React Hook Form and Zod. Notice the UI renders as a single Master Parent component with strict conditional step rendering — zero React Router URL fragmentation, zero native browser popups, and full WCAG accessibility."*
- **Action**: Highlight the header badge, the progress bar (Step 1 of 3, 33%), and the Live QA Payload Inspector drawer below.

#### Timestamp 0:30 – 1:15 | Step 1: Real-Time Keystroke Validation & 18+ Age Guard
- **Visual**: Focus on Step 1: Personal Information.
- **Actions**:
  1. Click into **First Name**, type `"A"`: Red error instantly triggers: *"First name must be at least 2 characters"*.
  2. Complete First Name with `"Aman"`: Red error disappears, replaced by an emerald checkmark and ring.
  3. Type `"Saini"` in **Last Name**: Emerald checkmark appears immediately.
  4. In **Date of Birth**, select today's date or a future date: Instant red error: *"You must be at least 18 years old to open a Prodesk IT account"*.
  5. Select a compliant date (e.g. `1998-05-15`): Date of birth turns green.
  6. Point out that the **"Next Step →"** button was disabled throughout the invalid state and has now become active.
- **Narrative**:
  > *"Notice how the Next button remained strictly disabled until all fields met schema compliance on keystroke. All validation runs via Zod safeParse in real time without native HTML5 popups."*
- **Action**: Click **"Next Step →"** (demonstrating smooth conditional step transition without page reload).

#### Timestamp 1:15 – 1:55 | Step 2: Credentials, Eyeball Toggles & State Persistence
- **Visual**: Focus on Step 2: Account & Security (Progress bar animates to 66%).
- **Actions**:
  1. In **Email Address**, type `"aman.saini"`: Red error fires: *"Please enter a valid email address containing '@'"*.
  2. Complete email as `"aman.saini@prodesk.it"`: Real-time RFC 5322 regex passes, emerald checkmark displays.
  3. In **Password**, type `"pass"`: Minimum 8-character error displays; strength bar displays *"Weak"*.
  4. Type `"FinTech$ecure2026"`: Strength bar animates to *"Strong"* (100% emerald).
  5. Click the **Eyeball icon**: Password reveals as plaintext `"FinTech$ecure2026"`; click again to mask.
  6. In **Confirm Password**, type `"FinTech$ecure"`: Red error fires: *"Passwords do not match"*.
  7. Finish typing `"FinTech$ecure2026"`: Confirmation turns green with *"Passwords match perfectly"*.
  8. **CRITICAL QA STEP**: Click **"← Back"** to return to Step 1.
  9. Point out to camera: *"Notice that 100% of the Step 1 inputs (Aman, Saini, 1998-05-15) are completely retained in memory, proving our lifting state up architecture and shouldUnregister: false configuration."*
  10. Click **"Next Step →"** to return to Step 2, and click **"Review Details →"** to advance to Step 3.

#### Timestamp 1:55 – 2:35 | Step 3: Structured Summary, Inline Edit Jumps & Submit
- **Visual**: Focus on Step 3: Review & Confirm Registration (Progress bar animates to 100%).
- **Actions**:
  1. Showcase the structured FinTech review cards:
     - Card 1: Legal Name & Date of Birth.
     - Card 2: Corporate Email, Masked Password (`••••••••••••`), and *"Verified via Zod Schema"* badge.
  2. Click **"Peek"** to toggle password visibility right on the review card.
  3. Click **"Edit"** next to Personal Information: The wizard smoothly jumps back to Step 1.
  4. Demonstrate modifying or verifying data, and click forward back to Step 3.
  5. Point out the terminal submit button: *"Every previous button was explicitly typed as button to eliminate accidental submissions. Only this final button is type='submit'."*
  6. Click **"Submit Registration"**.

#### Timestamp 2:35 – 3:00 | Success View, DevTools Console Audit & Live QA Inspector
- **Visual**: Celebratory Success View displays with emerald checkmark badge.
- **Actions**:
  1. Point to the DevTools Console showing:
     `=== PRODESK IT SPRINT 07: FINAL REGISTRATION PAYLOAD === { firstName: "Aman", ... }`
  2. Point to the on-screen **Emitted Console Payload [Audit Record]** formatted JSON box.
  3. Click **"Copy JSON"** (shows *"Copied"* feedback).
  4. Scroll to the **Live State & Console Payload Inspector** drawer:
     - Show `_step: 3`, `isStep1Valid: true`, `isStep2Valid: true`, and the committed payload.
  5. Click **"Reset & Start New Registration"** to show pristine state reset.
- **Narrative**:
  > *"Every P0, P1, and P2 criterion is verified: conditional step rendering, lifted state persistence across unmounted steps, real-time Zod regex validation, eyeball toggles, zero-refresh navigation, and full audit logging. Sprint 7 Phase 3 Core Engineering is complete."*
