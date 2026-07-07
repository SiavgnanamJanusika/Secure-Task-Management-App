import re

EMAIL_REGEX = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

PASSWORD_REGEX = re.compile(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,}$")

PASSWORD_RULE_MESSAGE = (
    "Password must be at least 6 characters long and include at least "
    "1 uppercase letter, 1 lowercase letter, and 1 special character."
)

EMAIL_RULE_MESSAGE = "Email must be a valid address containing '@' and a domain."


def validate_email(email: str) -> bool:
    return bool(EMAIL_REGEX.match(email))


def validate_password(password: str) -> bool:
    return bool(PASSWORD_REGEX.match(password))
