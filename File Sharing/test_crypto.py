from utils.crypto import generate_user_keys, decrypt_private_key, encrypt_file, decrypt_file, rsa_encrypt_key, rsa_decrypt_key

# Test User Key Generation and Decryption
password = "supersecretpassword"
pub_pem, enc_priv, salt = generate_user_keys(password)
print("Keys Generated!")

priv_key_obj = decrypt_private_key(enc_priv, password, salt)
print("Private Key Decrypted Successfully!")

# Test File Encryption and Decryption
file_data = b"This is some sensitive data that needs sharing."
enc_file_data, aes_key = encrypt_file(file_data)
print("File Encrypted!")

dec_file_data = decrypt_file(enc_file_data, aes_key)
print("File Decrypted!")
assert file_data == dec_file_data
print("File integrity matches!")

# Test Key Encrypt/Decrypt
enc_key = rsa_encrypt_key(aes_key, pub_pem)
print("AES Key Encrypted via RSA Public Key!")

dec_key = rsa_decrypt_key(enc_key, priv_key_obj)
print("AES Key Decrypted via RSA Private Key!")
assert aes_key == dec_key
print("Key matches!")
print("ALL CRYPTO UTILITIES PASSED VERIFICATION!")
