import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "database.db")

# Remove the database file to start fresh if needed, or simply drop existing tables
if os.path.exists(DB_PATH):
    try:
        os.remove(DB_PATH)
        print("Existing database.db removed to apply new schema.")
    except Exception as e:
        print(f"Could not remove database.db: {e}. Dropping tables instead.")

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# Enable foreign keys
cursor.execute("PRAGMA foreign_keys = ON;")

# Create Users Table
cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    public_key TEXT NOT NULL,
    encrypted_private_key BLOB NOT NULL,
    private_key_salt BLOB NOT NULL
)
""")

# Create Files Table
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

# Create Shares Table
cursor.execute("""
CREATE TABLE IF NOT EXISTS shares (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    file_id INTEGER NOT NULL,
    shared_with_user_id INTEGER NOT NULL,
    shared_by_user_id INTEGER NOT NULL,
    encrypted_aes_key BLOB NOT NULL,
    FOREIGN KEY(file_id) REFERENCES files(id) ON DELETE CASCADE,
    FOREIGN KEY(shared_with_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(shared_by_user_id) REFERENCES users(id) ON DELETE CASCADE
)
""")

conn.commit()
conn.close()

print("Database and Schema Created Successfully")