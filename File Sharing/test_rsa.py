from utils.aes import generate_aes_key
from utils.rsa import encrypt_aes_key, decrypt_aes_key

# Generate AES Key
aes_key = generate_aes_key()

print("Original AES Key:")
print(aes_key)

# Encrypt AES Key
encrypted_key = encrypt_aes_key(aes_key)

print("\nEncrypted AES Key:")
print(encrypted_key)

# Decrypt AES Key
decrypted_key = decrypt_aes_key(encrypted_key)

print("\nDecrypted AES Key:")
print(decrypted_key)

# Verify
if aes_key == decrypted_key:
    print("\nSUCCESS")
else:
    print("\nFAILED")