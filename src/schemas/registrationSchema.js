import { z } from 'zod';

/**
 * Validates whether a given ISO date string represents a user at least 18 years old
 * and not in the future.
 * @param {string} dateString - Format YYYY-MM-DD
 * @returns {boolean}
 */
const validateMinimumAge = (dateString) => {
  if (!dateString) return false;
  const birthDate = new Date(dateString);
  if (isNaN(birthDate.getTime())) return false;

  const today = new Date();
  // Ensure the date is strictly in the past
  if (birthDate >= today) return false;

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age >= 18 && age <= 120;
};

// Step 1: Personal Information Schema
export const step1Schema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters"),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters"),
  dob: z
    .string()
    .min(1, "Date of birth is required")
    .refine(validateMinimumAge, {
      message: "You must be at least 18 years old to open a Prodesk IT account",
    }),
});

// Step 2: Account & Security Schema
export const step2Schema = z
  .object({
    email: z
      .string()
      .min(1, "Email is required")
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address containing '@'"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Full Master Registration Schema
export const registrationSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, "First name is required")
      .min(2, "First name must be at least 2 characters"),
    lastName: z
      .string()
      .trim()
      .min(1, "Last name is required")
      .min(2, "Last name must be at least 2 characters"),
    dob: z
      .string()
      .min(1, "Date of birth is required")
      .refine(validateMinimumAge, {
        message: "You must be at least 18 years old to open a Prodesk IT account",
      }),
    email: z
      .string()
      .min(1, "Email is required")
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address containing '@'"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

