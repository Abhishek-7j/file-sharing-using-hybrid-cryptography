from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import os

# PBKDF2 Iterations
ITERATIONS = 100000

def generate_user_keys(password: str):
    """
    Generates an RSA 2048-bit key pair.
    The private key is encrypted using AES-GCM with a key derived from the user's password.
    Returns (public_pem: bytes, encrypted_private_pem: bytes, salt: bytes).
    """
    # 1. Generate RSA key pair
    private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    public_key = private_key.public_key()

    # 2. Serialize key pair
    private_pem = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.TraditionalOpenSSL,
        encryption_algorithm=serialization.NoEncryption()
    )

    public_pem = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    )

    # 3. Derive key from password
    salt = os.urandom(16)
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=ITERATIONS
    )
    derived_key = kdf.derive(password.encode())

    # 4. Encrypt private key PEM with AES-256-GCM
    aesgcm = AESGCM(derived_key)
    nonce = os.urandom(12)
    encrypted_private_pem = nonce + aesgcm.encrypt(nonce, private_pem, None)

    return public_pem, encrypted_private_pem, salt

def decrypt_private_key(encrypted_private_pem: bytes, password: str, salt: bytes):
    """
    Decrypts the user's private key using the password and salt.
    Returns the RSA private key object.
    """
    # 1. Derive key from password
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=ITERATIONS
    )
    derived_key = kdf.derive(password.encode())

    # 2. Decrypt private key PEM
    nonce = encrypted_private_pem[:12]
    ciphertext = encrypted_private_pem[12:]
    aesgcm = AESGCM(derived_key)
    
    private_pem = aesgcm.decrypt(nonce, ciphertext, None)

    # 3. Load and return private key object
    private_key = serialization.load_pem_private_key(
        private_pem,
        password=None
    )
    return private_key

def encrypt_file(file_data: bytes):
    """
    Symmetrically encrypts file data using AES-256-GCM.
    Returns (encrypted_data: bytes, aes_key: bytes).
    """
    aes_key = AESGCM.generate_key(bit_length=256)
    aesgcm = AESGCM(aes_key)
    nonce = os.urandom(12)
    encrypted_data = nonce + aesgcm.encrypt(nonce, file_data, None)
    return encrypted_data, aes_key

def decrypt_file(encrypted_data: bytes, aes_key: bytes):
    """
    Symmetrically decrypts file data using AES-256-GCM.
    Returns plaintext file data.
    """
    aesgcm = AESGCM(aes_key)
    nonce = encrypted_data[:12]
    ciphertext = encrypted_data[12:]
    return aesgcm.decrypt(nonce, ciphertext, None)

def rsa_encrypt_key(aes_key: bytes, public_key_pem: bytes):
    """
    Encrypts the AES key using the recipient's RSA public key.
    """
    public_key = serialization.load_pem_public_key(public_key_pem)
    encrypted_aes_key = public_key.encrypt(
        aes_key,
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )
    return encrypted_aes_key

def rsa_decrypt_key(encrypted_aes_key: bytes, private_key):
    """
    Decrypts the AES key using the recipient's RSA private key object.
    """
    decrypted_aes_key = private_key.decrypt(
        encrypted_aes_key,
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )
    return decrypted_aes_key
