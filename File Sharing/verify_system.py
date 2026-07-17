import os
import sqlite3
import io
import base64
from app import app, get_db_connection
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

# Configure test client
app.config["TESTING"] = True
client = app.test_client()

# Recreate database to ensure a clean test
print("Initializing database schema...")
os.system("venv\\Scripts\\python database.py")

# Helper: Simulate client-side key derivation and encryption (WebCrypto equivalent)
ITERATIONS = 100000

def client_derive_key(password, salt_bytes):
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt_bytes,
        iterations=ITERATIONS
    )
    return kdf.derive(password.encode())

def client_encrypt_private_key(private_key_pem, derived_key):
    aesgcm = AESGCM(derived_key)
    nonce = os.urandom(12)
    ciphertext = aesgcm.encrypt(nonce, private_key_pem, None)
    return nonce + ciphertext

def client_decrypt_private_key(encrypted_private_bytes, derived_key):
    nonce = encrypted_private_bytes[:12]
    ciphertext = encrypted_private_bytes[12:]
    aesgcm = AESGCM(derived_key)
    return aesgcm.decrypt(nonce, ciphertext, None)

def client_encrypt_file(file_data):
    aes_key = AESGCM.generate_key(bit_length=256)
    aesgcm = AESGCM(aes_key)
    nonce = os.urandom(12)
    ciphertext = nonce + aesgcm.encrypt(nonce, file_data, None)
    return ciphertext, aes_key

def client_decrypt_file(encrypted_data, aes_key):
    nonce = encrypted_data[:12]
    ciphertext = encrypted_data[12:]
    aesgcm = AESGCM(aes_key)
    return aesgcm.decrypt(nonce, ciphertext, None)

def client_rsa_encrypt_key(aes_key, public_key_pem):
    public_key = serialization.load_pem_public_key(public_key_pem)
    return public_key.encrypt(
        aes_key,
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )

def client_rsa_decrypt_key(encrypted_aes_key, private_key_pem):
    private_key = serialization.load_pem_private_key(private_key_pem, password=None)
    return private_key.decrypt(
        encrypted_aes_key,
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )

# Pre-generate client credentials for registration
# 1. Alice keys & payloads
print("\n[Client Simulation] Generating Alice cryptographic keys...")
alice_priv = rsa.generate_private_key(public_exponent=65537, key_size=2048)
alice_pub_pem = alice_priv.public_key().public_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PublicFormat.SubjectPublicKeyInfo
)
alice_priv_pem = alice_priv.private_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PrivateFormat.TraditionalOpenSSL,
    encryption_algorithm=serialization.NoEncryption()
)
alice_salt = os.urandom(16)
alice_key = client_derive_key("alicepassword", alice_salt)
alice_enc_priv = client_encrypt_private_key(alice_priv_pem, alice_key)

alice_recovery_key = "AAAA-BBBB-CCCC-DDDD"
alice_rec_key = client_derive_key(alice_recovery_key, alice_salt)
alice_rec_enc_priv = client_encrypt_private_key(alice_priv_pem, alice_rec_key)

# 2. Bob keys & payloads
print("[Client Simulation] Generating Bob cryptographic keys...")
bob_priv = rsa.generate_private_key(public_exponent=65537, key_size=2048)
bob_pub_pem = bob_priv.public_key().public_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PublicFormat.SubjectPublicKeyInfo
)
bob_priv_pem = bob_priv.private_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PrivateFormat.TraditionalOpenSSL,
    encryption_algorithm=serialization.NoEncryption()
)
bob_salt = os.urandom(16)
bob_key = client_derive_key("bobpassword", bob_salt)
bob_enc_priv = client_encrypt_private_key(bob_priv_pem, bob_key)

bob_recovery_key = "EEEE-FFFF-GGGG-HHHH"
bob_rec_key = client_derive_key(bob_recovery_key, bob_salt)
bob_rec_enc_priv = client_encrypt_private_key(bob_priv_pem, bob_rec_key)


# Test 1: Register Alice and Bob
print("\n--- Test 1: Registration ---")
res1 = client.post("/register", data={
    "username": "alice",
    "email": "alice@test.com",
    "password": "alicepassword",
    "public_key": alice_pub_pem.decode(),
    "encrypted_private_key": base64.b64encode(alice_enc_priv).decode(),
    "private_key_salt": base64.b64encode(alice_salt).decode(),
    "recovery_private_key": base64.b64encode(alice_rec_enc_priv).decode()
})
assert res1.status_code == 302
print("OK - Alice registered successfully!")

res2 = client.post("/register", data={
    "username": "bob",
    "email": "bob@test.com",
    "password": "bobpassword",
    "public_key": bob_pub_pem.decode(),
    "encrypted_private_key": base64.b64encode(bob_enc_priv).decode(),
    "private_key_salt": base64.b64encode(bob_salt).decode(),
    "recovery_private_key": base64.b64encode(bob_rec_enc_priv).decode()
})
assert res2.status_code == 302
print("OK - Bob registered successfully!")


# Test 2: Login Alice
print("\n--- Test 2: Login ---")
res_login = client.post("/login", json={
    "email": "alice@test.com",
    "password": "alicepassword"
})
assert res_login.status_code == 200
login_data = res_login.get_json()
assert login_data["status"] == "success"

# Validate that client can decrypt the private key received from server
recv_enc_priv = base64.b64decode(login_data["encrypted_private_key"])
recv_salt = base64.b64decode(login_data["private_key_salt"])
recv_derived_key = client_derive_key("alicepassword", recv_salt)
decrypted_priv_pem = client_decrypt_private_key(recv_enc_priv, recv_derived_key)
assert decrypted_priv_pem == alice_priv_pem
print("OK - Alice logged in successfully and decrypted her private key!")


# Test 3: Upload and Encrypt a File (Alice)
print("\n--- Test 3: File Upload & Encryption ---")
file_content = b"This is a highly secret E2EE document that the server cannot read!"
enc_file_bytes, file_aes_key = client_encrypt_file(file_content)
encrypted_aes_key = client_rsa_encrypt_key(file_aes_key, alice_pub_pem)

res_upload = client.post("/upload", data={
    "file": (io.BytesIO(enc_file_bytes), "secret_report.txt"),
    "encrypted_aes_key": base64.b64encode(encrypted_aes_key).decode()
})
assert res_upload.status_code == 200
print("OK - File encrypted and uploaded successfully!")


# Verify encrypted file on disk
conn = get_db_connection()
file_record = conn.execute("SELECT * FROM files WHERE owner_id = 1").fetchone()
conn.close()
assert file_record is not None
enc_path = os.path.join("File Sharing/uploads" if os.path.exists("File Sharing/uploads") else "uploads", file_record["encrypted_name"])
assert os.path.exists(enc_path)
with open(enc_path, "rb") as f:
    disk_data = f.read()
assert disk_data != file_content # Verify stored file is indeed ciphertext
print(f"OK - Verified encrypted file size on disk: {len(disk_data)} bytes.")


# Test 4: Download and Decrypt (Alice)
print("\n--- Test 4: Owner Download & Decryption ---")
# 1. Download key
res_key = client.get(f"/download-key/{file_record['id']}")
assert res_key.status_code == 200
enc_key_b64 = res_key.get_json()["encrypted_aes_key"]

# 2. Download file
res_file = client.get(f"/download-file/{file_record['id']}")
assert res_file.status_code == 200

# 3. Decrypt
dec_aes_key = client_rsa_decrypt_key(base64.b64decode(enc_key_b64), alice_priv_pem)
dec_file_content = client_decrypt_file(res_file.data, dec_aes_key)
assert dec_file_content == file_content
print("OK - Alice downloaded and decrypted her own file successfully!")


# Test 5: Try to download Bob's file (Unauthorized)
client.get("/logout")
client.post("/login", json={
    "email": "bob@test.com",
    "password": "bobpassword"
})
print("\n--- Test 5: Unauthorized Access Verification ---")
res_unauthorized_key = client.get(f"/download-key/{file_record['id']}")
assert res_unauthorized_key.status_code == 403
res_unauthorized_file = client.get(f"/download-file/{file_record['id']}")
assert res_unauthorized_file.status_code == 403
print("OK - Access denied for Bob (verified)!")


# Test 6: Share file with Bob (Alice logs in again, shares)
client.get("/logout")
client.post("/login", json={
    "email": "alice@test.com",
    "password": "alicepassword"
})
print("\n--- Test 6: Sharing ---")
# 1. Fetch Bob's public key
res_bob_pub = client.get("/get-public-key?username=bob")
assert res_bob_pub.status_code == 200
bob_pub_pem_recv = res_bob_pub.get_json()["public_key"].encode()

# 2. Re-encrypt AES key for Bob
bob_encrypted_aes_key = client_rsa_encrypt_key(file_aes_key, bob_pub_pem_recv)

# 3. Submit share
res_share = client.post("/share", json={
    "file_id": file_record["id"],
    "share_with": "bob",
    "encrypted_aes_key": base64.b64encode(bob_encrypted_aes_key).decode()
})
assert res_share.status_code == 200
print("OK - File shared with Bob successfully!")


# Test 7: Bob download and decrypt
client.get("/logout")
client.post("/login", json={
    "email": "bob@test.com",
    "password": "bobpassword"
})
print("\n--- Test 7: Recipient Download & Decryption ---")
# 1. Download key
res_bob_key = client.get(f"/download-key/{file_record['id']}")
assert res_bob_key.status_code == 200
bob_enc_key_b64 = res_bob_key.get_json()["encrypted_aes_key"]

# 2. Download file
res_bob_file = client.get(f"/download-file/{file_record['id']}")
assert res_bob_file.status_code == 200

# 3. Decrypt
bob_dec_aes_key = client_rsa_decrypt_key(base64.b64decode(bob_enc_key_b64), bob_priv_pem)
bob_dec_file_content = client_decrypt_file(res_bob_file.data, bob_dec_aes_key)
assert bob_dec_file_content == file_content
print("OK - Bob downloaded and decrypted the shared file successfully!")


# Test 8: Username checking API
print("\n--- Test 8: Username Checking API ---")
res_check_exist = client.get("/check-username?username=alice")
assert b'"exists":true' in res_check_exist.data
res_check_new = client.get("/check-username?username=newuser")
assert b'"exists":false' in res_check_new.data
print("OK - Username checking API verified successfully!")


# Test 9: Zero-Knowledge Password Recovery Verification
print("\n--- Test 9: Zero-Knowledge Password Recovery ---")
# 1. Get recovery challenge (encrypted with public key)
res_challenge = client.get("/get-recovery-challenge?username=alice")
assert res_challenge.status_code == 200
enc_challenge_b64 = res_challenge.get_json()["encrypted_challenge"]

# 2. Get recovery payload for Alice
res_payload = client.get("/get-recovery-payload?username=alice")
assert res_payload.status_code == 200
payload = res_payload.get_json()

# 3. Simulate client-side recovery decryption with recovery key
rec_enc_priv_bytes = base64.b64decode(payload["recovery_private_key"])
rec_salt_bytes = base64.b64decode(payload["private_key_salt"])
rec_derived_key = client_derive_key(alice_recovery_key, rec_salt_bytes)
recovered_priv_pem = client_decrypt_private_key(rec_enc_priv_bytes, rec_derived_key)
assert recovered_priv_pem == alice_priv_pem

# 4. Decrypt challenge using the recovered private key
private_key_obj = serialization.load_pem_private_key(recovered_priv_pem, password=None)
decrypted_challenge_bytes = private_key_obj.decrypt(
    base64.b64decode(enc_challenge_b64),
    padding.OAEP(
        mgf=padding.MGF1(algorithm=hashes.SHA256()),
        algorithm=hashes.SHA256(),
        label=None
    )
)
decrypted_challenge = decrypted_challenge_bytes.decode()

# 5. Encrypt private key with new password
new_password = "alice_new_password"
new_derived_key = client_derive_key(new_password, rec_salt_bytes)
new_encrypted_private_key = client_encrypt_private_key(recovered_priv_pem, new_derived_key)

# 6. Post recovery request to server
res_recover = client.post("/recover", json={
    "username": "alice",
    "decrypted_challenge": decrypted_challenge,
    "new_encrypted_private_key": base64.b64encode(new_encrypted_private_key).decode(),
    "new_password": new_password
})
assert res_recover.status_code == 200
print("OK - Vault successfully restored with new password!")

# 7. Verify new login works
client.get("/logout")
res_new_login = client.post("/login", json={
    "email": "alice@test.com",
    "password": new_password
})
assert res_new_login.status_code == 200
print("OK - Logged in successfully with the new password!")

print("\n==============================================")
print("ALL SYSTEM INTEGRATION VERIFICATIONS SUCCESSFUL!")
print("==============================================")
