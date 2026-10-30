# The Registration Wizard — Prodesk IT (Sprint 7: Phase 3)

[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-7.54-EC5990?logo=reacthookform&logoColor=white)](https://react-hook-form.com/)
[![Zod](https://img.shields.io/badge/Zod-3.24-3E67B1?logo=zod&logoColor=white)](https://zod.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

A production-grade, multi-step SaaS & FinTech onboarding registration wizard built for **Prodesk IT Sprint 7 (Phase 3: Core Engineering)**. Designed with enterprise-level form architecture, real-time Zod schema validation on keystroke (`onChange`), 100% state persistence across unmounted steps, strict conditional rendering (zero routing-related state loss), and an integrated Live QA State & Console Payload Inspector.

---

## 1. Architectural Highlights

```
                    +------------------------------------------+
                    |                 App.jsx                  |
                    |  (Master Parent Container & Form Engine) |
                    |                                          |
                    |  - Lifted Master State (formData)        |
                    |  - useForm({ shouldUnregister: false })  |
                    |  - Zod Schema Evaluator (safeParse)      |
                    +--------------------+---------------------+
                                         |
               +-------------------------+-------------------------+
               |                         |                         |
               v                         v                         v
       +---------------+         +---------------+         +---------------+
       |  ProgressBar  |         | Step Carousel |         |   QA Drawer   |
       |  (33/66/100%) |         | (Conditional) |         |   Inspector   |
       +---------------+         +-------+-------+         +---------------+
                                         |
               +-------------------------+-------------------------+
               |                         |                         |
               v                         v                         v
        {step === 1}              {step === 2}              {step === 3}
       +---------------+         +---------------+         +---------------+
       |    StepOne    |         |    StepTwo    |         |   StepThree   |
       | Identity & 18+|         | Email & Pass  |         | Review/Submit |
       +---------------+         +---------------+         +---------------+
                                                                   |
                                                               (On Submit)
                                                                   v
                                                           +---------------+
                                                           |  SuccessView  |
                                                           | 200 OK + JSON |
                                                           +---------------+
```

### Core Architecture Principles:
1. **Conditional Step Rendering Only (FAQ #2)**:
   Does **not** use `react-router-dom` to change steps. Rendering is driven conditionally (`{step === 1 && <StepOne ... />}`) inside `App.jsx`, preventing history fragmentation and unauthorized route deep-linking.
2. **State Persistence Across Unmounted Steps (Phase 1 & FAQ #3)**:
   Configured with `shouldUnregister: false` in React Hook Form and synchronized with a master lifted `formData` state. Navigating back and forth preserves 100% of user keystrokes.
3. **No Native HTML5 Popups (FAQ #1)**:
   The `<form>` element has `noValidate` enabled, eliminating browser-native tooltip popups in favor of custom, accessible, real-time inline alerts.
4. **Accidental Form Refresh Prevention (FAQ #6)**:
   All "Next", "Back", and "Eyeball" buttons are explicitly declared as `type="button"`. Only the final Step 3 "Submit Registration" button uses `type="submit"`.
5. **Real-time `onChange` Keystroke Validation (FAQ #10)**:
   Forms validate immediately as the user types (`mode: "onChange"`). Step progression buttons remain disabled until all step fields pass their respective Zod schema checks.
6. **Linux Case-Sensitivity for Vercel (FAQ #12)**:
   Every component filename and import statement follows exact PascalCase conventions to guarantee zero build failures on Linux CI/CD pipelines.

---

## 2. P0 / P1 / P2 Feature Matrix

| Priority | Requirement | Implementation Status | Component / File |
| :--- | :--- | :--- | :--- |
| **P0** | Conditional Multi-step Rendering | Fully Implemented | `src/App.jsx` |
| **P0** | Lifted State Persistence across Unmounts | Fully Implemented | `src/App.jsx` (`shouldUnregister: false`) |
| **P0** | Final `console.log` payload emission | Fully Implemented | `src/App.jsx` & `src/components/SuccessView.jsx` |
| **P0** | Celebratory Success View | Fully Implemented | `src/components/SuccessView.jsx` |
| **P1** | Real-time `onChange` regex validation | Fully Implemented | `src/schemas/registrationSchema.js` |
| **P1** | Step 1 Age Verification (18+ requirement) | Fully Implemented | `src/schemas/registrationSchema.js` |
| **P1** | Dynamic progress bar with step counter & percentage | Fully Implemented | `src/components/ProgressBar.jsx` |
| **P1** | Step 3 structured summary with inline Edit jumps | Fully Implemented | `src/components/StepThree.jsx` |
| **P2** | Enterprise Form Architecture (`react-hook-form` + `zod`) | Fully Implemented | `src/schemas/registrationSchema.js` & `src/App.jsx` |
| **P2** | Password strength meter bar | Fully Implemented | `src/components/StepTwo.jsx` |
| **P2** | Independent Show/Hide password eyeball toggles | Fully Implemented | `src/components/StepTwo.jsx` |
| **P2** | Live QA State & Console Payload Inspector | Fully Implemented | `src/components/PayloadInspector.jsx` |

---

## 3. Zod Validation Rules Table

| Field | Type / Input | Validation Rule | Error Message | Success Indicator |
| :--- | :--- | :--- | :--- | :--- |
| `firstName` | Text | `z.string().trim().min(2)` | *"First name must be at least 2 characters"* | Emerald checkmark + border highlight |
| `lastName` | Text | `z.string().trim().min(2)` | *"Last name must be at least 2 characters"* | Emerald checkmark + border highlight |
| `dob` | Date | `min(1)` + `.refine()` (age >= 18 & past date) | *"You must be at least 18 years old to open a Prodesk IT account"* | Emerald checkmark + border highlight |
| `email` | Email | `min(1)` + `.regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)` | *"Please enter a valid email address containing '@'"* | Emerald checkmark + border highlight |
| `password` | Password | `z.string().min(8)` | *"Password must be at least 8 characters long"* | Dynamic Strength Bar (Weak to Strong) + Checkmark |
| `confirmPassword`| Password | `min(1)` + `.refine(data.password === data.confirmPassword)` | *"Passwords do not match"* | *"Passwords match perfectly"* + Checkmark |

---

## 4. Project File Structure

```
Sprint 7/
├── .gitignore                      # Ignores node_modules, dist, .env
├── index.html                      # HTML5 entry with Plus Jakarta Sans & JetBrains Mono
├── package.json                    # Enterprise dependencies and scripts
├── postcss.config.js               # PostCSS Tailwind engine
├── tailwind.config.js              # Custom FinTech brand themes & extensions
├── vite.config.js                  # Vite v6 configuration
├── Prompts.md                      # Prodesk IT QA Engineering & Debugging Sessions Log
├── README.md                       # Complete architectural documentation
└── src/
    ├── main.jsx                    # React 18 DOM mount point
    ├── App.jsx                     # Master Parent Container with state and forms
    ├── index.css                   # Tailwind directives, glassmorphism, scrollbars
    ├── schemas/
    │   └── registrationSchema.js   # Zod step1, step2, and registration schemas
    └── components/
        ├── ProgressBar.jsx         # Step count, progress bar, node indicators
        ├── StepOne.jsx             # Personal Info (First/Last Name, DOB)
        ├── StepTwo.jsx             # Account Details (Email, Password, Eyeball)
        ├── StepThree.jsx           # Review Summary with inline Edit jumps
        ├── SuccessView.jsx         # Completion screen & emitted JSON preview
        └── PayloadInspector.jsx    # QA Live State & DevTools Console drawer
```

---

## 5. Local Setup & Execution Commands

### Prerequisites
- **Node.js**: v18.0.0 or higher (v24.x tested and certified)
- **npm**: v9.0.0 or higher

### Installation & Run Steps
```bash
# 1. Clone repository or navigate to workspace
cd "d:\My Company work\Sprint 7"

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Compile production build
npm run build

# 5. Preview the production build locally
npm run preview
```

The application runs locally by default at `http://localhost:3000` (or `http://localhost:5173`).

---

## 6. Vercel Deployment Instructions

1. **Push Repository to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat(sprint-7): complete Phase 3 registration wizard"
   git branch -M main
   git remote add origin https://github.com/your-org/the-registration-wizard.git
   git push -u origin main
   ```

2. **Import into Vercel**:
   - Navigate to [vercel.com](https://vercel.com) and click **Add New Project**.
   - Select your GitHub repository.
   - Framework Preset: **Vite**
   - Root Directory: `./` (or leave default root)
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Linux File Verification**:
   Because all files use exact PascalCase naming (`src/components/StepOne.jsx`, `src/components/StepTwo.jsx`, etc.) matching their respective imports in `src/App.jsx`, the Vercel Linux build environment will compile cleanly without `Module not found` case-sensitivity faults.

---

## 7. QA Verification Matrix

- [x] **Test 1 (Conditional Rendering)**: Verify no `/step-1` URL navigation occurs. Inspect the DOM to confirm only the active step component is rendered.
- [x] **Test 2 (State Persistence)**: Fill out Step 1. Click "Next Step →". Fill out Step 2. Click "← Back". Verify all Step 1 inputs remain populated.
- [x] **Test 3 (Keystroke Validation)**: In Step 2, type an email missing `@`. Notice immediate red validation message. Add `@` and domain; notice instant green border.
- [x] **Test 4 (Submit Refresh Guard)**: Click "Next", "Back", and "Eyeball" buttons with DevTools Network tab open. Confirm zero page reloads or form submissions occur.
- [x] **Test 5 (Audit Console Payload)**: Complete Step 3 and click "Submit Registration". Verify `console.log("=== PRODESK IT SPRINT 07: FINAL REGISTRATION PAYLOAD ===", ...)` is logged and rendered inside the on-screen QA Inspector.



---

## 8. Interactive 3-Minute QA Video Walkthrough Guide

The application includes an in-app **Walkthrough Helper** (accessible via the `▶ 3-Min QA Walkthrough Guide` button at the top of the screen) and a quick `Prefill Demo Data` tool for rapid evaluation.

### Step-by-Step Walkthrough Flow:
1. **0:00 - 0:30 (Architecture & Setup)**: Showcase single parent container in `App.jsx`, no React Router, `noValidate` on `<form>`, and open browser DevTools (`F12 -> Console`).
2. **0:30 - 1:15 (Step 1 Validation & 18+ Rule)**:
   - Type `"A"` in First Name: Verify red error string.
   - Enter invalid/under-18 birthdate: Verify *"You must be at least 18 years old to open a Prodesk IT account"*.
   - Verify `"Next Step →"` button is strictly disabled until all fields are valid.
3. **1:15 - 1:55 (Step 2 Credentials & State Persistence)**:
   - Test email regex (`^[^\s@]+@[^\s@]+\.[^\s@]+$`) on keystroke.
   - Test password strength meter and click the **Eye / EyeOff** toggle to inspect plaintext.
   - **Click "← Back"**: Demonstrate 100% data retention across unmounted Step 1.
4. **1:55 - 2:35 (Step 3 Summary & Inline Jumps)**:
   - Review structured cards, click "Peek" on password, test "Edit" jump button back to Step 1.
   - Point out `type="button"` on all previous buttons and `type="submit"` on final button.
5. **2:35 - 3:00 (Submission & Audit Proof)**:
   - Submit registration.
   - Inspect celebratory Success Screen and on-screen JSON payload matching DevTools `console.log`.
   - Toggle the **Live State & Console Payload Inspector** drawer.
