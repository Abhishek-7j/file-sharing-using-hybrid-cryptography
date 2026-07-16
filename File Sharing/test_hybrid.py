from utils.hybrid import encrypt_uploaded_file

file_path = "uploads/test.txt"

encrypted_file, encrypted_key = encrypt_uploaded_file(file_path)

print("Encrypted File:")
print(encrypted_file)

print("\nEncrypted AES Key:")
print(encrypted_key)