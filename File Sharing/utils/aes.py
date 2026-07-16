from cryptography.fernet import Fernet
import os


def generate_aes_key():
    """
    Generate a new AES key for every uploaded file.
    """
    return Fernet.generate_key()


def encrypt_file(file_path, aes_key):

    fernet = Fernet(aes_key)

    with open(file_path, "rb") as file:
        file_data = file.read()

    encrypted_data = fernet.encrypt(file_data)

    filename = os.path.basename(file_path)

    encrypted_path = os.path.join(
        "encrypted",
        filename + ".enc"
    )

    with open(encrypted_path, "wb") as encrypted_file:
        encrypted_file.write(encrypted_data)

    return encrypted_path