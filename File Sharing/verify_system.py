import os
import sqlite3
import io
from app import app, get_db_connection

# Configure client
app.config["TESTING"] = True
client = app.test_client()

# Recreate database to ensure a clean test
print("Initializing database schema...")
os.system("venv\\Scripts\\python database.py")

# Test 1: Register two users
print("\n--- Test 1: Registration ---")
res1 = client.post("/register", data={
    "username": "alice",
    "email": "alice@test.com",
    "password": "alicepassword"
})
assert res1.status_code == 302 # Redirects to /login
print("OK - Alice registered successfully!")

res2 = client.post("/register", data={
    "username": "bob",
    "email": "bob@test.com",
    "password": "bobpassword"
})
assert res2.status_code == 302 # Redirects to /login
print("OK - Bob registered successfully!")

# Test 2: Login Alice
print("\n--- Test 2: Login ---")
res_login = client.post("/login", data={
    "email": "alice@test.com",
    "password": "alicepassword"
}, follow_redirects=True)
assert b"Vault: alice" in res_login.data
print("OK - Alice logged in successfully! Vault is unlocked.")

# Test 3: Upload and Encrypt a File (Alice)
print("\n--- Test 3: File Upload & Encryption ---")
file_content = b"This is a highly secret document that must be shared securely!"
res_upload = client.post("/upload", data={
    "file": (io.BytesIO(file_content), "secret_report.txt")
}, follow_redirects=True)
assert b"File uploaded and encrypted successfully" in res_upload.data
print("OK - File encrypted and uploaded successfully!")

# Verify encrypted file on disk
conn = get_db_connection()
file_record = conn.execute("SELECT * FROM files WHERE owner_id = 1").fetchone()
conn.close()
assert file_record is not None
enc_path = os.path.join("uploads", file_record["encrypted_name"])
assert os.path.exists(enc_path)
with open(enc_path, "rb") as f:
    disk_data = f.read()
assert disk_data != file_content # Must be encrypted!
print(f"OK - Verified encrypted file size on disk: {len(disk_data)} bytes. Content is encrypted.")

# Test 4: Download and Decrypt (Alice)
print("\n--- Test 4: Owner Download & Decryption ---")
res_download = client.get(f"/download/{file_record['id']}")
assert res_download.data == file_content
print("OK - Alice downloaded and decrypted her own file successfully!")

# Test 5: Try to download Bob's file (Unauthorized)
client.get("/logout")
client.post("/login", data={
    "email": "bob@test.com",
    "password": "bobpassword"
})
print("\n--- Test 5: Unauthorized Access Verification ---")
res_unauthorized = client.get(f"/download/{file_record['id']}", follow_redirects=True)
assert b"Access denied" in res_unauthorized.data
print("OK - Access denied for Bob (verified)!")

# Test 6: Share file with Bob (Alice logs in again, shares)
client.get("/logout")
client.post("/login", data={
    "email": "alice@test.com",
    "password": "alicepassword"
})
print("\n--- Test 6: Sharing ---")
res_share = client.post("/share", data={
    "file_id": file_record["id"],
    "share_with": "bob"
}, follow_redirects=True)
assert b"File successfully shared with bob" in res_share.data
print("OK - File shared with Bob successfully!")

# Test 7: Bob download and decrypt
client.get("/logout")
client.post("/login", data={
    "email": "bob@test.com",
    "password": "bobpassword"
})
print("\n--- Test 7: Recipient Download & Decryption ---")
res_bob_download = client.get(f"/download/{file_record['id']}")
assert res_bob_download.data == file_content
print("OK - Bob downloaded and decrypted the shared file successfully!")

# Test 8: Username checking API
print("\n--- Test 8: Username Checking API ---")
res_check_exist = client.get("/check-username?username=alice")
assert b'"exists":true' in res_check_exist.data
res_check_new = client.get("/check-username?username=newuser")
assert b'"exists":false' in res_check_new.data
print("OK - Username checking API verified successfully!")

print("\n==============================================")
print("ALL SYSTEM INTEGRATION VERIFICATIONS SUCCESSFUL!")
print("==============================================")
