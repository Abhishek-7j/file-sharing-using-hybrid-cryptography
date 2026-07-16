import os

from utils.aes import generate_aes_key, encrypt_file
from utils.rsa import encrypt_aes_key


def encrypt_uploaded_file(file_path):

    # Generate new AES key
    aes_key = generate_aes_key()

    # Encrypt uploaded file
    encrypted_file_path = encrypt_file(file_path, aes_key)

    # Encrypt AES key using RSA
    encrypted_aes_key = encrypt_aes_key(aes_key)

    return encrypted_file_path, encrypted_aes_key