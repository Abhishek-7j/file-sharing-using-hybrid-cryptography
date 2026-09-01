# IDENTITY DNA — Continuous Behavioral Authentication System

> **“Your Behavior. Your Identity. Your Security.”**

Identity DNA is a modern, production-grade cybersecurity web application built on the principle of **Continuous Behavioral Authentication**. Unlike traditional passwords, SMS OTPs, or 2FA tokens that authenticate a user only at login, Identity DNA continuously monitors micro-interaction biometrics throughout the active session to verify whether the person currently using the account is its legitimate owner.

---

## 🧬 Project Overview

- **Core Concept**: Continuous AI Behavioral Authentication System
- **Design Theme**: Deep Navy (`#020617`), Cyan Glow (`#00f0ff`), Glassmorphism, HUD graphics, DNA strand animation, and **"The Identity Guardian"** Radhakrishna-inspired visual identity symbolizing *Harmony + Identity + Security*.
- **Supported Biometric Signals**:
  - **Keystroke Dynamics**: Key hold dwell time, inter-key flight interval, typing speed WPM, and rhythmic variance.
  - **Cursor Kinematics**: Cursor velocity vectors, acceleration profiles, curvature smoothness, and movement distance.
  - **Click Cadence**: Click hold duration, double-click intervals, and click coordinates variance.
  - **Scroll Patterns**: Scroll velocity, burst impulse length, direction shifts, and scroll intervals.

---

## 🚀 Key Features

1. **The Identity Guardian Visual**: High-tech fusion of futuristic cybersecurity HUD graphics with Radhakrishna symbolic visual identity (Radha & Krishna silhouettes, digital signal flute wave, biometric peacock feather circuit, lotus mandala geometry, and cyber shield overlay).
2. **Interactive Onboarding ("Build Your Identity DNA")**: 4-step baseline collector for typing, mouse kinematics, click cadence, and scroll patterns with dynamic 3D DNA helix visualizer.
3. **Continuous Real-Time Telemetry Tracking**: Background frontend hook (`useBehavioralTracker`) passively capturing live micro-interactions and evaluating weighted similarity scores against the user's baseline.
4. **Dynamic Security States**:
   - 🟢 **TRUSTED** (90% – 100%)
   - 🟡 **MONITORING** (70% – 89%)
   - 🔴 **SUSPICIOUS** (< 70%, automatically triggers high-risk security alert logging)
5. **Viva / Demo Anomaly Simulation**: Integrated simulation bar on the dashboard allowing instant live toggling between Trusted, Monitoring, and Suspicious states for review and demonstration.
6. **Full Cybersecurity Suite**:
   - 13-Section Cinematic Landing Page
   - AI Detection Pipeline & Feature Distance Matrix
   - Behavioral Analytics with Today / Week / Month timeframe selector
   - Session Login History Audit Log
   - Security Events Incident Alert Feed
   - Profile & Configurable Algorithm Settings

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Recharts, Framer Motion.
- **Backend**: Python 3.14, FastAPI, Pydantic, Passlib (Bcrypt), Python-JOSE (JWT).
- **Machine Learning**: Weighted exponential distance kernel & scikit-learn anomaly classifier hook.
- **Database**: MongoDB (Motor async driver) with transparent embedded JSON fallback storage.

---

## 📁 Repository Structure

```
├── backend/
│   ├── app/
│   │   ├── main.py                     # FastAPI entry point & CORS
│   │   ├── database/
│   │   │   └── connection.py           # MongoDB & Fallback DB Manager
│   │   ├── ml/
│   │   │   └── engine.py               # Feature extraction & weighted ML classifier
│   │   ├── models/
│   │   │   └── schemas.py              # Pydantic data schemas
│   │   ├── routes/
│   │   │   ├── auth.py                 # /register, /login, /me
│   │   │   ├── behavior.py             # /behavior/* endpoints & continuous analysis
│   │   │   ├── security.py             # /security/events alerts
│   │   │   └── history.py              # /login-history audit log
│   │   └── security/
│   │       ├── passwords.py            # Bcrypt password hashing
│   │       └── tokens.py               # JWT authentication tokens
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/                 # Navbar, Sidebar, RadhakrishnaVisual, DNAVisualization, ConfidenceGauge, etc.
│   │   ├── hooks/                      # useBehavioralTracker, useAuth
│   │   ├── pages/                      # Landing, Onboarding, Dashboard, AI Detection, Analytics, History, Security Events, Profile, Settings
│   │   ├── services/                   # API client & telemetry transport
│   │   ├── styles/                     # Tailwind CSS & HUD glow effects
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## ⚡ Quick Start

### 1. Backend Setup (FastAPI)
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --port 8080 --reload
```
API Health Check: `http://localhost:8080/health`  
Interactive Swagger Docs: `http://localhost:8080/docs`

### 2. Frontend Setup (React Vite)
```bash
cd frontend
npm install
npm run dev
```
Open application in browser: `http://localhost:3000`

---

## 🛡️ Security & Privacy
- Zero raw password storage (Bcrypt hashed with salt).
- Secure JWT bearer tokens.
- Passive telemetry strictly transformed into statistical feature vector embeddings.
- Configurable confidence thresholds and threat alert levels.

---

## 📄 License
Released under MIT License. Continuous Behavioral Authentication System © 2026.
