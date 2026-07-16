import os
import sys

# Add the current directory to sys.path to allow importing from aes
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from aes import generate_aes_key

key = generate_aes_key()

# Save the generated key to keys/secret.key
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KEYS_DIR = os.path.join(BASE_DIR, "keys")
os.makedirs(KEYS_DIR, exist_ok=True)
secret_key_path = os.path.join(KEYS_DIR, "secret.key")

with open(secret_key_path, "wb") as f:
    f.write(key)

print(f"Secret Key Generated and Saved to {secret_key_path} Successfully")