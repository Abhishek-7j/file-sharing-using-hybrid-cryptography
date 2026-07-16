# ShieldShare - Secure File Sharing System using Hybrid Cryptography

ShieldShare is a secure, end-to-end encrypted file sharing web application built with Python and Flask. It leverages hybrid cryptography to combine the efficiency of symmetric encryption with the secure key-distribution of asymmetric cryptography.

---

## 🔒 Cryptographic Architecture

ShieldShare employs a multi-layered security architecture:

1. **Symmetric Encryption (AES-256-GCM)**:
   * Every file uploaded is encrypted using a unique, cryptographically secure 256-bit symmetric key.
   * Galois/Counter Mode (GCM) provides authenticated encryption, guaranteeing both **confidentiality** and **integrity** (tamper protection) of files stored on disk.
2. **Asymmetric Key Exchange (RSA-2048)**:
   * Each user is generated an RSA-2048 key pair upon registration.
   * Symmetric keys are encrypted using the recipient's RSA public key (with OAEP padding and SHA-256) so they can only be decrypted by the intended recipient.
3. **Private Key Protection (PBKDF2 & AES-GCM)**:
   * The server never stores user private keys in plaintext.
   * Private keys are encrypted on the server using AES-256-GCM, with a key derived from the user's login password using **PBKDF2-HMAC-SHA256**.
   * The server only decrypts the user's private key in RAM during an active session.
4. **Password Hashing (Bcrypt/PBKDF2)**:
   * Passwords are safe from database leaks using standard `werkzeug.security` secure password hashing.

---

## 📂 Project Directory Structure

```text
├── .gitignore                    # Git ignore configurations (excl. virtualenvs, databases, keys)
├── README.md                     # Project documentation (this file)
└── File Sharing/                 # Core source directory
    ├── app.py                    # Main Flask web application and routes
    ├── database.py               # SQLite database setup and schema definition
    ├── check_users.py            # SQLite utility to check registered users
    ├── verify_system.py          # End-to-end automated system integration test
    ├── templates/                # Glassmorphic UI HTML templates
    │   ├── dashboard.html        # Main dashboard for upload, download, and sharing
    │   ├── login.html            # Vault unlocking screen
    │   └── register.html         # Vault creation screen
    └── utils/                    # Cryptographic helpers
        └── crypto.py             # Symmetric, asymmetric, and KDF functions
```

---

## ⚙️ Quick Start & Setup

### Prerequisites
* Python 3.10+
* Git

### 1. Clone & Setup Directory
Navigate to the project folder:
```bash
cd "file sharing using hybrid cryptography/File Sharing"
```

### 2. Set Up Virtual Environment & Dependencies
Create a virtual environment and install the required libraries:
```bash
python -m venv venv
venv\Scripts\activate      # On Windows (cmd)
source venv/bin/activate   # On Linux/macOS

pip install cryptography flask
```

### 3. Initialize Database
Initialize the SQLite schema (this resets `database.db` and prepares the tables):
```bash
python database.py
```

### 4. Run Automated Integrations Test
To verify all cryptographic functions and database flows work correctly:
```bash
python verify_system.py
```

### 5. Launch the Web App
Run the Flask server:
```bash
python app.py
```
Open [http://127.0.0.1:5000/](http://127.0.0.1:5000/) in your web browser to create your vault accounts and start uploading/sharing securely.
