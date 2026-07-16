from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import serialization, hashes
import os

# -----------------------------
# Project Root Directory
# -----------------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# -----------------------------
# Keys Folder
# -----------------------------
KEYS_DIR = os.path.join(BASE_DIR, "keys")

# Create keys folder if it doesn't exist
os.makedirs(KEYS_DIR, exist_ok=True)

# Key file paths
PRIVATE_KEY_PATH = os.path.join(KEYS_DIR, "private.pem")
PUBLIC_KEY_PATH = os.path.join(KEYS_DIR, "public.pem")


# -----------------------------
# Generate RSA Key Pair
# -----------------------------
def generate_rsa_keys():

    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048
    )

    public_key = private_key.public_key()

    # Save Private Key
    with open(PRIVATE_KEY_PATH, "wb") as file:

        file.write(

            private_key.private_bytes(

                encoding=serialization.Encoding.PEM,

                format=serialization.PrivateFormat.TraditionalOpenSSL,

                encryption_algorithm=serialization.NoEncryption()

            )

        )

    # Save Public Key
    with open(PUBLIC_KEY_PATH, "wb") as file:

        file.write(

            public_key.public_bytes(

                encoding=serialization.Encoding.PEM,

                format=serialization.PublicFormat.SubjectPublicKeyInfo

            )

        )

    print("RSA Keys Generated Successfully")


# -----------------------------
# Load Public Key
# -----------------------------
def load_public_key():

    with open(PUBLIC_KEY_PATH, "rb") as file:

        public_key = serialization.load_pem_public_key(file.read())

    return public_key


# -----------------------------
# Load Private Key
# -----------------------------
def load_private_key():

    with open(PRIVATE_KEY_PATH, "rb") as file:

        private_key = serialization.load_pem_private_key(

            file.read(),

            password=None

        )

    return private_key


# -----------------------------
# Encrypt AES Key
# -----------------------------
def encrypt_aes_key(aes_key):

    public_key = load_public_key()

    encrypted_key = public_key.encrypt(

        aes_key,

        padding.OAEP(

            mgf=padding.MGF1(algorithm=hashes.SHA256()),

            algorithm=hashes.SHA256(),

            label=None

        )

    )

    return encrypted_key


# -----------------------------
# Decrypt AES Key
# -----------------------------
def decrypt_aes_key(encrypted_key):

    private_key = load_private_key()

    decrypted_key = private_key.decrypt(

        encrypted_key,

        padding.OAEP(

            mgf=padding.MGF1(algorithm=hashes.SHA256()),

            algorithm=hashes.SHA256(),

            label=None

        )

    )

    return decrypted_key


# -----------------------------
# Test
# -----------------------------
if __name__ == "__main__":

    if not os.path.exists(PRIVATE_KEY_PATH):

        generate_rsa_keys()

    print("RSA Module Ready")