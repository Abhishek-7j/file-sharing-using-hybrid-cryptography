// WebCrypto Helper Library for Zero-Knowledge E2EE File Sharing

// Helper: Convert ArrayBuffer to Base64 String
function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

// Helper: Convert Base64 String to ArrayBuffer
function base64ToArrayBuffer(base64) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

// Helper: UTF-8 String to ArrayBuffer
function stringToBuffer(str) {
    return new TextEncoder().encode(str);
}

// Helper: ArrayBuffer to UTF-8 String
function bufferToString(buffer) {
    return new TextDecoder().decode(buffer);
}

// 1. Derive AES-GCM Key from password + salt via PBKDF2
async function deriveKeyFromPassword(password, saltBuffer, iterations = 100000) {
    const encoder = new TextEncoder();
    const baseKey = await window.crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );
    
    return await window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: saltBuffer,
            iterations: iterations,
            hash: "SHA-256"
        },
        baseKey,
        { name: "AES-GCM", length: 256 },
        false, // Not exportable
        ["encrypt", "decrypt"]
    );
}

// 2. Generate RSA Key Pair for Asymmetric Cryptography
async function generateRSAKeyPair() {
    return await window.crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]), // 65537
            hash: "SHA-256"
        },
        true, // Exportable private key
        ["encrypt", "decrypt"]
    );
}

// 3. Export Public Key to standard PEM Format
async function exportPublicKeyPEM(publicKey) {
    const exported = await window.crypto.subtle.exportKey("spki", publicKey);
    const b64 = arrayBufferToBase64(exported);
    let pem = "-----BEGIN PUBLIC KEY-----\n";
    for (let i = 0; i < b64.length; i += 64) {
        pem += b64.substring(i, i + 64) + "\n";
    }
    pem += "-----END PUBLIC KEY-----";
    return pem;
}

// 4. Import Public Key from standard PEM Format
async function importPublicKeyPEM(pem) {
    const lines = pem.split('\n');
    let b64 = '';
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim() && !lines[i].includes('BEGIN PUBLIC KEY') && !lines[i].includes('END PUBLIC KEY')) {
            b64 += lines[i].trim();
        }
    }
    const buffer = base64ToArrayBuffer(b64);
    return await window.crypto.subtle.importKey(
        "spki",
        buffer,
        {
            name: "RSA-OAEP",
            hash: "SHA-256"
        },
        true,
        ["encrypt"]
    );
}

// 5. Encrypt User Private Key with Password-Derived Symmetric Key
async function encryptPrivateKey(privateKey, passwordDerivedKey) {
    const exported = await window.crypto.subtle.exportKey("pkcs8", privateKey);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        passwordDerivedKey,
        exported
    );
    
    // Concatenate IV and Ciphertext for storage
    const result = new Uint8Array(iv.byteLength + encrypted.byteLength);
    result.set(new Uint8Array(iv), 0);
    result.set(new Uint8Array(encrypted), iv.byteLength);
    return arrayBufferToBase64(result.buffer);
}

// 6. Decrypt User Private Key using Password-Derived Symmetric Key
async function decryptPrivateKey(encryptedB64, passwordDerivedKey) {
    const combinedBuffer = base64ToArrayBuffer(encryptedB64);
    const iv = combinedBuffer.slice(0, 12);
    const ciphertext = combinedBuffer.slice(12);
    
    const decrypted = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv: new Uint8Array(iv) },
        passwordDerivedKey,
        ciphertext
    );
    
    return await window.crypto.subtle.importKey(
        "pkcs8",
        decrypted,
        {
            name: "RSA-OAEP",
            hash: "SHA-256"
        },
        true,
        ["decrypt"]
    );
}

// 7. Encrypt File ArrayBuffer with random AES Key (AES-256-GCM)
async function encryptFileSymmetric(fileBuffer) {
    // Generate random 256-bit AES key
    const aesKey = await window.crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true, // Exportable raw key
        ["encrypt", "decrypt"]
    );
    
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        aesKey,
        fileBuffer
    );
    
    // Export AES Key to raw bytes
    const rawAesKey = await window.crypto.subtle.exportKey("raw", aesKey);
    
    // Prefix IV to file ciphertext
    const resultFile = new Uint8Array(iv.byteLength + encrypted.byteLength);
    resultFile.set(new Uint8Array(iv), 0);
    resultFile.set(new Uint8Array(encrypted), iv.byteLength);
    
    return {
        encryptedFileBuffer: resultFile.buffer,
        rawAesKey: rawAesKey
    };
}

// 8. Decrypt File ArrayBuffer with raw AES Key
async function decryptFileSymmetric(encryptedBuffer, rawAesKey) {
    const iv = encryptedBuffer.slice(0, 12);
    const ciphertext = encryptedBuffer.slice(12);
    
    const aesKey = await window.crypto.subtle.importKey(
        "raw",
        rawAesKey,
        { name: "AES-GCM" },
        false,
        ["decrypt"]
    );
    
    return await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv: new Uint8Array(iv) },
        aesKey,
        ciphertext
    );
}

// 9. Encrypt Symmetric Key using RSA Public Key (RSA-OAEP)
async function encryptAesKeyAsymmetric(rawAesKey, rsaPublicKey) {
    const encrypted = await window.crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        rsaPublicKey,
        rawAesKey
    );
    return arrayBufferToBase64(encrypted);
}

// 10. Decrypt Symmetric Key using RSA Private Key
async function decryptAesKeyAsymmetric(encryptedAesKeyB64, rsaPrivateKey) {
    const encryptedBuffer = base64ToArrayBuffer(encryptedAesKeyB64);
    return await window.crypto.subtle.decrypt(
        { name: "RSA-OAEP" },
        rsaPrivateKey,
        encryptedBuffer
    );
}
