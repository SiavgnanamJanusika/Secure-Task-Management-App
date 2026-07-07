from app.utils.validators import validate_email, validate_password


def test_valid_email():
    assert validate_email("user@example.com") is True


def test_invalid_email_missing_at():
    assert validate_email("userexample.com") is False


def test_invalid_email_missing_domain():
    assert validate_email("user@example") is False


def test_valid_password():
    assert validate_password("Passw0rd!") is True


def test_password_too_short():
    assert validate_password("Aa1!") is False


def test_password_missing_uppercase():
    assert validate_password("password!") is False


def test_password_missing_special_char():
    assert validate_password("Password1") is False


def test_password_missing_lowercase():
    assert validate_password("PASSWORD!") is False
