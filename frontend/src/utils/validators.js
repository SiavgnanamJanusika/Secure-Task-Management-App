

const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,}$/;

export const isValidEmail = (email) => EMAIL_REGEX.test(email);

export const isValidPassword = (password) => PASSWORD_REGEX.test(password);

export const PASSWORD_HINT =
  "At least 6 characters, with 1 uppercase letter, 1 lowercase letter, and 1 special character.";

export const EMAIL_HINT = "Must be a valid email address, e.g. name@example.com";
