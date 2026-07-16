from flask import Flask, render_template, request, session, redirect, send_file
import sqlite3
import os
import uuid
import io
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
from cryptography.hazmat.primitives import serialization

from utils.crypto import (
    generate_user_keys,
    decrypt_private_key,
    encrypt_file,
    decrypt_file,
    rsa_encrypt_key,
    rsa_decrypt_key
)

app = Flask(__name__)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.secret_key = "shieldshare_secure_secret_key_12345"

# Create uploads folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def get_db_connection():
    db_path = os.path.join(BASE_DIR, "database.db")
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    # Enable foreign keys
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

@app.route("/")
def home():
    if "username" in session:
        return redirect("/dashboard")
    return redirect("/login")

@app.route("/register", methods=["GET", "POST"])
def register():
    if "username" in session:
        return redirect("/dashboard")

    if request.method == "POST":
        username = request.form["username"].strip()
        email = request.form["email"].strip()
        password = request.form["password"]

        if not username or not email or not password:
            return render_template("register.html", error="All fields are required.")

        # Generate RSA Key Pair and encrypt private key with password
        try:
            public_pem, encrypted_private_pem, salt = generate_user_keys(password)
        except Exception as e:
            return render_template("register.html", error=f"Cryptography Error: {str(e)}")

        password_hash = generate_password_hash(password)

        conn = get_db_connection()
        try:
            conn.execute(
                "INSERT INTO users (username, email, password_hash, public_key, encrypted_private_key, private_key_salt) VALUES (?, ?, ?, ?, ?, ?)",
                (
                    username,
                    email,
                    password_hash,
                    public_pem.decode("utf-8"),
                    sqlite3.Binary(encrypted_private_pem),
                    sqlite3.Binary(salt)
                )
            )
            conn.commit()
        except sqlite3.IntegrityError:
            conn.close()
            return render_template("register.html", error="Username or Email already exists.")
        except Exception as e:
            conn.close()
            return render_template("register.html", error=f"Database Error: {str(e)}")
        
        conn.close()
        return redirect("/login")

    return render_template("register.html")

@app.route("/login", methods=["GET", "POST"])
def login():
    if "username" in session:
        return redirect("/dashboard")

    if request.method == "POST":
        email = request.form["email"].strip()
        password = request.form["password"]

        conn = get_db_connection()
        user = conn.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
        conn.close()

        if user and check_password_hash(user["password_hash"], password):
            try:
                # Decrypt private key and store in session (cookie is encrypted via secret_key)
                private_key = decrypt_private_key(
                    user["encrypted_private_key"],
                    password,
                    user["private_key_salt"]
                )
                private_pem = private_key.private_bytes(
                    encoding=serialization.Encoding.PEM,
                    format=serialization.PrivateFormat.TraditionalOpenSSL,
                    encryption_algorithm=serialization.NoEncryption()
                )
                
                session["user_id"] = user["id"]
                session["username"] = user["username"]
                session["private_key_pem"] = private_pem.decode("utf-8")
                return redirect("/dashboard")
            except Exception as e:
                return render_template("login.html", error=f"Failed to decrypt vault: {str(e)}")
        else:
            return render_template("login.html", error="Invalid Email or Password.")

    return render_template("login.html")

@app.route("/dashboard")
def dashboard():
    if "username" not in session:
        return redirect("/login")

    user_id = session["user_id"]
    conn = get_db_connection()

    # Query own files
    own_files = conn.execute(
        "SELECT * FROM files WHERE owner_id = ? ORDER BY upload_date DESC",
        (user_id,)
    ).fetchall()

    # Query shared files (including owner's username)
    shared_files = conn.execute(
        """
        SELECT files.id, files.filename, files.file_size, files.upload_date, users.username AS owner_username 
        FROM files 
        JOIN shares ON files.id = shares.file_id 
        JOIN users ON files.owner_id = users.id 
        WHERE shares.shared_with_user_id = ? AND files.owner_id != ?
        ORDER BY files.upload_date DESC
        """,
        (user_id, user_id)
    ).fetchall()

    conn.close()

    message = request.args.get("message")
    error = request.args.get("error")

    return render_template(
        "dashboard.html",
        username=session["username"],
        own_files=own_files,
        shared_files=shared_files,
        message=message,
        error=error
    )

@app.route("/upload", methods=["POST"])
def upload():
    if "username" not in session:
        return redirect("/login")

    if "file" not in request.files:
        return redirect("/dashboard?error=No+file+part")

    file = request.files["file"]
    if file.filename == "":
        return redirect("/dashboard?error=No+file+selected")

    try:
        file_data = file.read()
        file_size = len(file_data)
        original_filename = secure_filename(file.filename)

        # 1. Encrypt file using AES-256-GCM
        encrypted_data, aes_key = encrypt_file(file_data)

        # 2. Save encrypted file to disk with unique filename
        unique_filename = f"{uuid.uuid4().hex}.enc"
        encrypted_path = os.path.join(app.config["UPLOAD_FOLDER"], unique_filename)
        with open(encrypted_path, "wb") as f:
            f.write(encrypted_data)

        # 3. Retrieve user's public key to encrypt AES key
        user_id = session["user_id"]
        conn = get_db_connection()
        user = conn.execute("SELECT public_key FROM users WHERE id = ?", (user_id,)).fetchone()
        
        # 4. Encrypt AES key using user's public key
        encrypted_aes_key = rsa_encrypt_key(aes_key, user["public_key"].encode())

        # 5. Insert file record and create default share for owner
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO files (filename, encrypted_name, owner_id, file_size) VALUES (?, ?, ?, ?)",
            (original_filename, unique_filename, user_id, file_size)
        )
        file_id = cursor.lastrowid

        cursor.execute(
            "INSERT INTO shares (file_id, shared_with_user_id, shared_by_user_id, encrypted_aes_key) VALUES (?, ?, ?, ?)",
            (file_id, user_id, user_id, sqlite3.Binary(encrypted_aes_key))
        )
        conn.commit()
        conn.close()

        return redirect("/dashboard?message=File+uploaded+and+encrypted+successfully")

    except Exception as e:
        return redirect(f"/dashboard?error=Upload+failed:+{str(e)}")

@app.route("/share", methods=["POST"])
def share():
    if "username" not in session:
        return redirect("/login")

    file_id = request.form.get("file_id")
    share_with = request.form.get("share_with", "").strip()

    if not file_id or not share_with:
        return redirect("/dashboard?error=Missing+share+parameters")

    user_id = session["user_id"]
    conn = get_db_connection()

    # 1. Verify file owner
    file_record = conn.execute("SELECT owner_id FROM files WHERE id = ?", (file_id,)).fetchone()
    if not file_record or file_record["owner_id"] != user_id:
        conn.close()
        return redirect("/dashboard?error=Permission+denied")

    # 2. Find recipient
    recipient = conn.execute("SELECT id, public_key FROM users WHERE username = ?", (share_with,)).fetchone()
    if not recipient:
        conn.close()
        return redirect(f"/dashboard?error=User+'{share_with}'+not+found")

    if recipient["id"] == user_id:
        conn.close()
        return redirect("/dashboard?error=You+cannot+share+with+yourself")

    try:
        # 3. Retrieve owner's encrypted AES key
        share_record = conn.execute(
            "SELECT encrypted_aes_key FROM shares WHERE file_id = ? AND shared_with_user_id = ?",
            (file_id, user_id)
        ).fetchone()

        # 4. Decrypt AES key with owner's private key
        private_key = serialization.load_pem_private_key(
            session["private_key_pem"].encode(),
            password=None
        )
        aes_key = rsa_decrypt_key(share_record["encrypted_aes_key"], private_key)

        # 5. Encrypt AES key with recipient's public key
        encrypted_aes_key_recipient = rsa_encrypt_key(aes_key, recipient["public_key"].encode())

        # 6. Check if already shared, else insert share record
        existing_share = conn.execute(
            "SELECT id FROM shares WHERE file_id = ? AND shared_with_user_id = ?",
            (file_id, recipient["id"])
        ).fetchone()

        if not existing_share:
            conn.execute(
                "INSERT INTO shares (file_id, shared_with_user_id, shared_by_user_id, encrypted_aes_key) VALUES (?, ?, ?, ?)",
                (file_id, recipient["id"], user_id, sqlite3.Binary(encrypted_aes_key_recipient))
            )
            conn.commit()
        
        conn.close()
        return redirect(f"/dashboard?message=File+successfully+shared+with+{share_with}")

    except Exception as e:
        conn.close()
        return redirect(f"/dashboard?error=Sharing+failed:+{str(e)}")

@app.route("/download/<int:file_id>")
def download(file_id):
    if "username" not in session:
        return redirect("/login")

    user_id = session["user_id"]
    conn = get_db_connection()

    # 1. Verify user has access to file (owner or shared)
    share_record = conn.execute(
        "SELECT encrypted_aes_key FROM shares WHERE file_id = ? AND shared_with_user_id = ?",
        (file_id, user_id)
    ).fetchone()

    if not share_record:
        conn.close()
        return redirect("/dashboard?error=Access+denied")

    # 2. Fetch file metadata
    file_record = conn.execute("SELECT filename, encrypted_name FROM files WHERE id = ?", (file_id,)).fetchone()
    conn.close()

    try:
        # 3. Read encrypted file from disk
        encrypted_path = os.path.join(app.config["UPLOAD_FOLDER"], file_record["encrypted_name"])
        with open(encrypted_path, "rb") as f:
            encrypted_data = f.read()

        # 4. Decrypt AES key with user's private key
        private_key = serialization.load_pem_private_key(
            session["private_key_pem"].encode(),
            password=None
        )
        aes_key = rsa_decrypt_key(share_record["encrypted_aes_key"], private_key)

        # 5. Decrypt file data
        decrypted_data = decrypt_file(encrypted_data, aes_key)

        # 6. Stream decrypted file back in-memory
        return send_file(
            io.BytesIO(decrypted_data),
            download_name=file_record["filename"],
            as_attachment=True
        )

    except Exception as e:
        return redirect(f"/dashboard?error=Decryption+failed:+{str(e)}")

@app.route("/logout")
def logout():
    session.clear()
    return redirect("/login")

if __name__ == "__main__":
    app.run(debug=True)