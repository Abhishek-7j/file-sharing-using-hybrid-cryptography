from flask import Flask, render_template, request, session, redirect, send_file, Response
from functools import wraps
from flask_session import Session
import sqlite3
import os
import uuid
import io
import base64
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
from cryptography.hazmat.primitives import serialization
from cryptography.exceptions import InvalidSignature
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import hashes

app = Flask(__name__)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.secret_key = "shieldshare_secure_secret_key_12345"

# Configure Server-Side Sessions (Resolves 4KB Cookie Limit)
app.config["SESSION_TYPE"] = "filesystem"
app.config["SESSION_FILE_DIR"] = os.path.join(BASE_DIR, "flask_session")
app.config["SESSION_PERMANENT"] = False
Session(app)

# Create uploads folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

TABLES_INITIALIZED = False

def check_and_create_tables(conn):
    cursor = conn.cursor()
    is_postgres = not isinstance(conn, sqlite3.Connection)
    
    if is_postgres:
        # Create Users
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(100) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            public_key TEXT NOT NULL,
            encrypted_private_key TEXT NOT NULL,
            private_key_salt TEXT NOT NULL,
            recovery_private_key TEXT NOT NULL
        )
        """)
        # Create Files
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS files (
            id SERIAL PRIMARY KEY,
            filename VARCHAR(255) NOT NULL,
            encrypted_name VARCHAR(255) UNIQUE NOT NULL,
            owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            file_size INTEGER NOT NULL
        )
        """)
        # Create Shares
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS shares (
            id SERIAL PRIMARY KEY,
            file_id INTEGER NOT NULL REFERENCES files(id) ON DELETE CASCADE,
            shared_with_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            shared_by_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            encrypted_aes_key TEXT NOT NULL
        )
        """)
    else:
        # Create Users (SQLite)
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            public_key TEXT NOT NULL,
            encrypted_private_key TEXT NOT NULL,
            private_key_salt TEXT NOT NULL,
            recovery_private_key TEXT NOT NULL
        )
        """)
        # Create Files (SQLite)
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS files (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT NOT NULL,
            encrypted_name TEXT UNIQUE NOT NULL,
            owner_id INTEGER NOT NULL,
            upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            file_size INTEGER NOT NULL,
            FOREIGN KEY(owner_id) REFERENCES users(id) ON DELETE CASCADE
        )
        """)
        # Create Shares (SQLite)
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS shares (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            file_id INTEGER NOT NULL,
            shared_with_user_id INTEGER NOT NULL,
            shared_by_user_id INTEGER NOT NULL,
            encrypted_aes_key TEXT NOT NULL,
            FOREIGN KEY(file_id) REFERENCES files(id) ON DELETE CASCADE,
            FOREIGN KEY(shared_with_user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY(shared_by_user_id) REFERENCES users(id) ON DELETE CASCADE
        )
        """)
    conn.commit()
    cursor.close()

def get_db_connection():
    global TABLES_INITIALIZED
    db_url = os.environ.get("DATABASE_URL")
    
    if db_url:
        if db_url.startswith("postgres://"):
            db_url = db_url.replace("postgres://", "postgresql://", 1)
        import psycopg2
        import psycopg2.extras
        conn = psycopg2.connect(db_url)
        conn.cursor_factory = psycopg2.extras.RealDictCursor
    else:
        conn = sqlite3.connect(os.path.join(BASE_DIR, "database.db"))
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA foreign_keys = ON;")
        
    if not TABLES_INITIALIZED:
        check_and_create_tables(conn)
        TABLES_INITIALIZED = True
        
    return conn

@app.route("/")
def home():
    if "username" in session:
        return redirect("/dashboard")
    return redirect("/login")

@app.route("/check-username")
def check_username():
    username = request.args.get("username", "").strip()
    if not username:
        return {"exists": False}
    
    conn = get_db_connection()
    cursor = conn.cursor()
    is_postgres = not isinstance(conn, sqlite3.Connection)
    query = "SELECT id FROM users WHERE username = %s" if is_postgres else "SELECT id FROM users WHERE username = ?"
    cursor.execute(query, (username,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    
    return {"exists": user is not None}

@app.route("/register", methods=["GET", "POST"])
def register():
    if "username" in session:
        return redirect("/dashboard")

    if request.method == "POST":
        username = request.form["username"].strip()
        email = request.form["email"].strip()
        
        # In E2EE: client handles key generation and uploads these values
        public_key = request.form["public_key"]
        encrypted_private_key = request.form["encrypted_private_key"]
        private_key_salt = request.form["private_key_salt"]
        recovery_private_key = request.form["recovery_private_key"]
        password = request.form["password"]

        password_hash = generate_password_hash(password)

        conn = get_db_connection()
        cursor = conn.cursor()
        is_postgres = not isinstance(conn, sqlite3.Connection)
        query = """
        INSERT INTO users (username, email, password_hash, public_key, encrypted_private_key, private_key_salt, recovery_private_key) 
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """ if is_postgres else """
        INSERT INTO users (username, email, password_hash, public_key, encrypted_private_key, private_key_salt, recovery_private_key) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """
        try:
            cursor.execute(
                query,
                (username, email, password_hash, public_key, encrypted_private_key, private_key_salt, recovery_private_key)
            )
            conn.commit()
        except (sqlite3.IntegrityError, Exception) as e:
            conn.close()
            return render_template("register.html", error="Username or Email already exists.")
        
        conn.close()
        return redirect("/login")

    return render_template("register.html")

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        data = request.get_json()
        if not data:
            return {"status": "error", "message": "Invalid JSON body"}, 400

        email = data.get("email", "").strip()
        password = data.get("password")

        conn = get_db_connection()
        cursor = conn.cursor()
        is_postgres = not isinstance(conn, sqlite3.Connection)
        query = "SELECT * FROM users WHERE email = %s" if is_postgres else "SELECT * FROM users WHERE email = ?"
        cursor.execute(query, (email,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if user and check_password_hash(user["password_hash"], password):
            # Authenticate Flask session (private key stored client-side only!)
            session["user_id"] = user["id"]
            session["username"] = user["username"]
            return {
                "status": "success",
                "username": user["username"],
                "encrypted_private_key": user["encrypted_private_key"],
                "private_key_salt": user["private_key_salt"]
            }
        else:
            return {"status": "error", "message": "Invalid Email or Password."}, 401

    return render_template("login.html")

@app.route("/dashboard")
def dashboard():
    if "username" not in session:
        return redirect("/login")

    user_id = session["user_id"]
    conn = get_db_connection()
    cursor = conn.cursor()
    is_postgres = not isinstance(conn, sqlite3.Connection)

    # 1. Fetch user public key for client-side uploads
    query_pub = "SELECT public_key FROM users WHERE id = %s" if is_postgres else "SELECT public_key FROM users WHERE id = ?"
    cursor.execute(query_pub, (user_id,))
    user_record = cursor.fetchone()
    owner_public_key = user_record["public_key"] if user_record else ""

    # 2. Query own files
    query_own = "SELECT * FROM files WHERE owner_id = %s ORDER BY upload_date DESC" if is_postgres else "SELECT * FROM files WHERE owner_id = ? ORDER BY upload_date DESC"
    cursor.execute(query_own, (user_id,))
    own_files = cursor.fetchall()

    # 3. Query shared files
    query_shared = """
    SELECT files.id, files.filename, files.file_size, files.upload_date, users.username AS owner_username 
    FROM files 
    JOIN shares ON files.id = shares.file_id 
    JOIN users ON files.owner_id = users.id 
    WHERE shares.shared_with_user_id = %s AND files.owner_id != %s
    ORDER BY files.upload_date DESC
    """ if is_postgres else """
    SELECT files.id, files.filename, files.file_size, files.upload_date, users.username AS owner_username 
    FROM files 
    JOIN shares ON files.id = shares.file_id 
    JOIN users ON files.owner_id = users.id 
    WHERE shares.shared_with_user_id = ? AND files.owner_id != ?
    ORDER BY files.upload_date DESC
    """
    cursor.execute(query_shared, (user_id, user_id))
    shared_files = cursor.fetchall()

    cursor.close()
    conn.close()

    message = request.args.get("message")
    error = request.args.get("error")

    return render_template(
        "dashboard.html",
        username=session["username"],
        own_files=own_files,
        shared_files=shared_files,
        owner_public_key=owner_public_key,
        message=message,
        error=error
    )

@app.route("/upload", methods=["POST"])
def upload():
    if "username" not in session:
        return "Unauthorized", 401

    if "file" not in request.files or "encrypted_aes_key" not in request.form:
        return "Missing upload payloads", 400

    file = request.files["file"]
    encrypted_aes_key = request.form["encrypted_aes_key"]

    if file.filename == "":
        return "No file selected", 400

    try:
        encrypted_data = file.read()
        file_size = len(encrypted_data)
        original_filename = secure_filename(file.filename)

        # 1. Save encrypted file directly to disk
        unique_filename = f"{uuid.uuid4().hex}.enc"
        encrypted_path = os.path.join(app.config["UPLOAD_FOLDER"], unique_filename)
        with open(encrypted_path, "wb") as f:
            f.write(encrypted_data)

        # 2. Write file and default share record
        user_id = session["user_id"]
        conn = get_db_connection()
        cursor = conn.cursor()
        is_postgres = not isinstance(conn, sqlite3.Connection)

        if is_postgres:
            cursor.execute(
                "INSERT INTO files (filename, encrypted_name, owner_id, file_size) VALUES (%s, %s, %s, %s) RETURNING id",
                (original_filename, unique_filename, user_id, file_size)
            )
            file_id = cursor.fetchone()["id"]
            cursor.execute(
                "INSERT INTO shares (file_id, shared_with_user_id, shared_by_user_id, encrypted_aes_key) VALUES (%s, %s, %s, %s)",
                (file_id, user_id, user_id, encrypted_aes_key)
            )
        else:
            cursor.execute(
                "INSERT INTO files (filename, encrypted_name, owner_id, file_size) VALUES (?, ?, ?, ?)",
                (original_filename, unique_filename, user_id, file_size)
            )
            file_id = cursor.lastrowid
            cursor.execute(
                "INSERT INTO shares (file_id, shared_with_user_id, shared_by_user_id, encrypted_aes_key) VALUES (?, ?, ?, ?)",
                (file_id, user_id, user_id, encrypted_aes_key)
            )
        
        conn.commit()
        cursor.close()
        conn.close()

        return "Upload Successful", 200

    except Exception as e:
        return f"Upload failed: {str(e)}", 500

@app.route("/get-public-key")
def get_public_key():
    if "username" not in session:
        return {"status": "error", "message": "Unauthorized"}, 401

    username = request.args.get("username", "").strip()
    conn = get_db_connection()
    cursor = conn.cursor()
    is_postgres = not isinstance(conn, sqlite3.Connection)
    query = "SELECT id, public_key FROM users WHERE username = %s" if is_postgres else "SELECT id, public_key FROM users WHERE username = ?"
    cursor.execute(query, (username,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if user:
        return {"id": user["id"], "public_key": user["public_key"]}
    else:
        return {"status": "error", "message": "User not found."}, 404

@app.route("/download-key/<int:file_id>")
def download_key(file_id):
    if "username" not in session:
        return {"status": "error", "message": "Unauthorized"}, 401

    user_id = session["user_id"]
    conn = get_db_connection()
    cursor = conn.cursor()
    is_postgres = not isinstance(conn, sqlite3.Connection)
    query = """
    SELECT encrypted_aes_key FROM shares WHERE file_id = %s AND shared_with_user_id = %s
    """ if is_postgres else """
    SELECT encrypted_aes_key FROM shares WHERE file_id = ? AND shared_with_user_id = ?
    """
    cursor.execute(query, (file_id, user_id))
    share = cursor.fetchone()
    cursor.close()
    conn.close()

    if share:
        return {"encrypted_aes_key": share["encrypted_aes_key"]}
    else:
        return {"status": "error", "message": "Access denied."}, 403

@app.route("/download-file/<int:file_id>")
def download_file(file_id):
    if "username" not in session:
        return "Unauthorized", 401

    user_id = session["user_id"]
    conn = get_db_connection()
    cursor = conn.cursor()
    is_postgres = not isinstance(conn, sqlite3.Connection)

    # 1. Authorize user has access to file
    query_auth = """
    SELECT file_id FROM shares WHERE file_id = %s AND shared_with_user_id = %s
    """ if is_postgres else """
    SELECT file_id FROM shares WHERE file_id = ? AND shared_with_user_id = ?
    """
    cursor.execute(query_auth, (file_id, user_id))
    share = cursor.fetchone()
    if not share:
        cursor.close()
        conn.close()
        return "Access denied", 403

    # 2. Get file location path
    query_file = "SELECT encrypted_name, filename FROM files WHERE id = %s" if is_postgres else "SELECT encrypted_name, filename FROM files WHERE id = ?"
    cursor.execute(query_file, (file_id,))
    file_record = cursor.fetchone()
    cursor.close()
    conn.close()

    if not file_record:
        return "File not found", 404

    # 3. Stream raw encrypted file directly (decryption done client-side)
    encrypted_path = os.path.join(app.config["UPLOAD_FOLDER"], file_record["encrypted_name"])
    return send_file(encrypted_path, as_attachment=True, download_name=file_record["filename"])

@app.route("/share", methods=["POST"])
def share():
    if "username" not in session:
        return {"status": "error", "message": "Unauthorized"}, 401

    data = request.get_json()
    file_id = data.get("file_id")
    share_with = data.get("share_with", "").strip()
    encrypted_aes_key = data.get("encrypted_aes_key")

    if not file_id or not share_with or not encrypted_aes_key:
        return {"status": "error", "message": "Missing share payloads"}, 400

    user_id = session["user_id"]
    conn = get_db_connection()
    cursor = conn.cursor()
    is_postgres = not isinstance(conn, sqlite3.Connection)

    # 1. Verify file owner
    query_owner = "SELECT owner_id FROM files WHERE id = %s" if is_postgres else "SELECT owner_id FROM files WHERE id = ?"
    cursor.execute(query_owner, (file_id,))
    file_record = cursor.fetchone()
    if not file_record or file_record["owner_id"] != user_id:
        cursor.close()
        conn.close()
        return {"status": "error", "message": "Permission denied"}, 403

    # 2. Find recipient
    query_rec = "SELECT id FROM users WHERE username = %s" if is_postgres else "SELECT id FROM users WHERE username = ?"
    cursor.execute(query_rec, (share_with,))
    recipient = cursor.fetchone()
    if not recipient:
        cursor.close()
        conn.close()
        return {"status": "error", "message": f"User '{share_with}' not found."}, 404

    if recipient["id"] == user_id:
        cursor.close()
        conn.close()
        return {"status": "error", "message": "You cannot share with yourself."}, 400

    # 3. Create or update share record
    query_exist = """
    SELECT id FROM shares WHERE file_id = %s AND shared_with_user_id = %s
    """ if is_postgres else """
    SELECT id FROM shares WHERE file_id = ? AND shared_with_user_id = ?
    """
    cursor.execute(query_exist, (file_id, recipient["id"]))
    existing_share = cursor.fetchone()

    try:
        if existing_share:
            query_update = """
            UPDATE shares SET encrypted_aes_key = %s WHERE id = %s
            """ if is_postgres else """
            UPDATE shares SET encrypted_aes_key = ? WHERE id = ?
            """
            cursor.execute(query_update, (encrypted_aes_key, existing_share["id"]))
        else:
            query_insert = """
            INSERT INTO shares (file_id, shared_with_user_id, shared_by_user_id, encrypted_aes_key) VALUES (%s, %s, %s, %s)
            """ if is_postgres else """
            INSERT INTO shares (file_id, shared_with_user_id, shared_by_user_id, encrypted_aes_key) VALUES (?, ?, ?, ?)
            """
            cursor.execute(query_insert, (file_id, recipient["id"], user_id, encrypted_aes_key))
        
        conn.commit()
        cursor.close()
        conn.close()
        return {"status": "success"}

    except Exception as e:
        cursor.close()
        conn.close()
        return {"status": "error", "message": str(e)}, 500

@app.route("/get-recovery-challenge")
def get_recovery_challenge():
    username = request.args.get("username", "").strip()
    if not username:
        return {"status": "error", "message": "Username is required"}, 400

    conn = get_db_connection()
    cursor = conn.cursor()
    is_postgres = not isinstance(conn, sqlite3.Connection)
    query = "SELECT public_key FROM users WHERE username = %s" if is_postgres else "SELECT public_key FROM users WHERE username = ?"
    cursor.execute(query, (username,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if not user:
        return {"status": "error", "message": "User vault not found"}, 404

    challenge = uuid.uuid4().hex
    session["recovery_challenge"] = challenge

    # Encrypt challenge using user's public key
    try:
        public_key_pem = user["public_key"].encode()
        pub_key = serialization.load_pem_public_key(public_key_pem)
        encrypted_challenge = pub_key.encrypt(
            challenge.encode(),
            padding.OAEP(
                mgf=padding.MGF1(algorithm=hashes.SHA256()),
                algorithm=hashes.SHA256(),
                label=None
            )
        )
        return {
            "encrypted_challenge": base64.b64encode(encrypted_challenge).decode()
        }
    except Exception as e:
        return {"status": "error", "message": f"Encryption failed: {str(e)}"}, 500

@app.route("/get-recovery-payload")
def get_recovery_payload():
    username = request.args.get("username", "").strip()
    email = request.args.get("email", "").strip()
    if not username or not email:
        return {"status": "error", "message": "Missing username or email details"}, 400

    conn = get_db_connection()
    cursor = conn.cursor()
    is_postgres = not isinstance(conn, sqlite3.Connection)
    query = """
    SELECT recovery_private_key, private_key_salt FROM users WHERE username = %s AND email = %s
    """ if is_postgres else """
    SELECT recovery_private_key, private_key_salt FROM users WHERE username = ? AND email = ?
    """
    cursor.execute(query, (username, email))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if user:
        return {
            "recovery_private_key": user["recovery_private_key"],
            "private_key_salt": user["private_key_salt"]
        }
    else:
        return {"status": "error", "message": "User vault with matching username and email not found."}, 404

@app.route("/recover", methods=["GET", "POST"])
def recover():
    if request.method == "POST":
        data = request.get_json()
        if not data:
            return {"status": "error", "message": "Missing JSON payload"}, 400
        username = data.get("username", "").strip()
        decrypted_challenge = data.get("decrypted_challenge")
        new_encrypted_private_key = data.get("new_encrypted_private_key")
        new_password = data.get("new_password")

        if not username or not decrypted_challenge or not new_encrypted_private_key or not new_password:
            return {"status": "error", "message": "Missing recovery details"}, 400

        # 1. Verify challenge matches session
        if decrypted_challenge != session.get("recovery_challenge"):
            return {"status": "error", "message": "Challenge verification failed. possession proof invalid."}, 400

        conn = get_db_connection()
        cursor = conn.cursor()
        is_postgres = not isinstance(conn, sqlite3.Connection)
        
        # 2. Update password and encrypted private key
        new_password_hash = generate_password_hash(new_password)
        query_update = """
        UPDATE users SET password_hash = %s, encrypted_private_key = %s WHERE username = %s
        """ if is_postgres else """
        UPDATE users SET password_hash = ?, encrypted_private_key = ? WHERE username = ?
        """
        try:
            cursor.execute(query_update, (new_password_hash, new_encrypted_private_key, username))
            conn.commit()
            cursor.close()
            conn.close()
            session.pop("recovery_challenge", None)
            return {"status": "success"}
        except Exception as e:
            cursor.close()
            conn.close()
            return {"status": "error", "message": str(e)}, 500
            
@app.route("/logout")
def logout():
    session.clear()
    return redirect("/login")

def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.authorization
        if not auth or not (auth.username == "admin" and auth.password == "shieldshare_admin_2026"):
            return Response(
                "Could not verify your access level for that URL.\n"
                "You have to login with proper credentials", 401,
                {"WWW-Authenticate": 'Basic realm="Login Required"'}
            )
        return f(*args, **kwargs)
    return decorated

@app.route("/admin/users")
@requires_auth
def admin_users():
    conn = get_db_connection()
    cursor = conn.cursor()
    is_postgres = not isinstance(conn, sqlite3.Connection)
    query = "SELECT id, username, email, public_key, private_key_salt FROM users ORDER BY id DESC"
    cursor.execute(query)
    users = cursor.fetchall()
    
    # Also fetch files count
    cursor.execute("SELECT COUNT(*) as count FROM files")
    files_count = cursor.fetchone()["count"] if is_postgres else cursor.fetchone()[0]
    
    cursor.close()
    conn.close()
    
    return render_template("admin_users.html", users=users, files_count=files_count)

if __name__ == "__main__":
    app.run(debug=True)