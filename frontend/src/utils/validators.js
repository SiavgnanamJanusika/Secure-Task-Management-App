// Keep these in sync with backend/app/utils/validators.py

const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
// min 6 chars, at least 1 uppercase, 1 lowercase, 1 special character
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,}$/;

export const isValidEmail = (email) => EMAIL_REGEX.test(email);

export const isValidPassword = (password) => PASSWORD_REGEX.test(password);

export const PASSWORD_HINT =
  "At least 6 characters, with 1 uppercase letter, 1 lowercase letter, and 1 special character.";

export const EMAIL_HINT = "Must be a valid email address, e.g. name@example.com";
