# WasteSphere Backend API

Welcome to the backend engine for **WasteSphere**, an AI-assisted community waste-management platform built for a 24-hour hackathon.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18+)
- MongoDB running locally (`mongodb://127.0.0.1:27017/wastesphere`) or MongoDB Atlas URI

### 2. Environment Setup
Create a `.env` file in the `backend/` directory based on `.env.example`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/wastesphere
JWT_SECRET=wastesphere_hackathon_super_secret_key_2026
JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key

SMS_PROVIDER=mock
```

### 3. Run Server
Development mode with auto-reload (Nodemon):
```bash
npm run dev
```

Production start:
```bash
npm start
```

Health check URL: `http://localhost:5000/health`  
API Base URL: `http://localhost:5000/api`

---

## 🔐 Authentication & Roles

WasteSphere supports two primary user roles:
1. **`citizen`**: Can submit waste reports, request waste pickups, track status, take quizzes, earn points, view Bronze/Silver/Gold recognition, and claim certificates.
2. **`admin`**: Requires government/officer ID during registration. Default status is `pending`. Approved admins can manage complaints, pickup requests, verify admin candidates, view analytics/hotspots, manage awareness/quiz content, and issue certificates.

### Authentication Headers
For protected endpoints, attach the JWT token in the HTTP Authorization header:
```http
Authorization: Bearer <YOUR_JWT_TOKEN>
```

---

## 📡 Key API Endpoints & Usage

### 1. Auth & Verification
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new Citizen account |
| `POST` | `/api/auth/admin/register` | Public | Register Admin account with Officer ID image |
| `POST` | `/api/auth/login` | Public | Authenticate user & receive JWT token |
| `GET` | `/api/auth/me` | Authenticated | Get current authenticated user profile |
| `GET` | `/api/admin/verifications` | Approved Admin | List pending admin verification requests |
| `PATCH` | `/api/admin/verifications/:id/status` | Approved Admin | Approve or reject admin account |

### 2. AI Waste Recognition
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/ai/waste-recognition` | Citizen/Admin | Classify waste photo using Groq/Gemini API |

**Request Body (Multipart or JSON)**:
```json
{
  "imageUrl": "https://example.com/waste.jpg"
}
```
**Response**:
```json
{
  "success": true,
  "data": {
    "suggestedWasteType": "Plastic Waste",
    "confidence": 0.95,
    "reasoning": "AI detected visible plastic bottles and wrappers",
    "providerUsed": "Groq API"
  }
}
```

### 3. Waste Reports (Complaints)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/reports` | Citizen | Create user-confirmed waste complaint |
| `GET` | `/api/reports/my-reports` | Citizen | List authenticated citizen's complaints |
| `GET` | `/api/reports/:id` | Owner/Admin | Get complaint details |
| `GET` | `/api/reports/admin/all` | Approved Admin | List all complaints (supports filtering) |
| `PATCH` | `/api/reports/:id/status` | Approved Admin | Update complaint status & resolution note |
| `PATCH` | `/api/reports/:id/assign` | Approved Admin | Assign resolution officer/team |

### 4. Waste Pickup Requests
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/pickups` | Citizen | Submit pickup request |
| `GET` | `/api/pickups/my-pickups` | Citizen | View citizen's pickup requests |
| `GET` | `/api/pickups/:id` | Owner/Admin | View pickup details |
| `GET` | `/api/pickups/admin/all` | Approved Admin | List all pickup requests |
| `PATCH` | `/api/pickups/:id/status` | Approved Admin | Update pickup status (`Pending`, `Accepted`, `Scheduled`, `Collected`) |

### 5. Interactive Quizzes & Gamification
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/quizzes` | Citizen | List active quizzes |
| `GET` | `/api/quizzes/:id` | Citizen/Admin | Get quiz with questions |
| `POST` | `/api/quizzes/:id/submit` | Citizen | Submit quiz answers for server scoring |
| `GET` | `/api/points/my-points` | Citizen | Get point ledger and total points |
| `GET` | `/api/recognition/my-recognition` | Citizen | Get Bronze/Silver/Gold tier status |

### 6. Certificates
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/certificates/eligibility` | Citizen | Evaluate eligibility for certificate |
| `GET` | `/api/certificates/my-certificates` | Citizen | View citizen's issued certificates |
| `GET` | `/api/certificates/admin/pending-eligibility` | Approved Admin | List eligible citizens |
| `POST` | `/api/certificates/admin/issue/:userId` | Approved Admin | Approve & issue certificate |

### 7. Admin Analytics & Hotspots
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/analytics/dashboard-metrics` | Approved Admin | Get system metrics & breakdowns |
| `GET` | `/api/analytics/waste-hotspots` | Approved Admin | Get location-based complaint clusters |

---

## 🏆 Recognition Rules (Bronze / Silver / Gold)
Recognition is calculated server-side based on **qualifying complaints count** (non-rejected complaints):
- **0–2 complaints**: No medal yet
- **3–4 complaints**: **Bronze**
- **5–9 complaints**: **Silver**
- **10+ complaints**: **Gold**

---

## 🧪 Postman API Testing Instructions
1. Import base URL: `http://localhost:5000/api`
2. First call `POST /api/auth/register` to register a citizen.
3. Use the returned `token` in `Authorization: Bearer <token>` for citizen endpoints.
4. Next call `POST /api/auth/admin/register` to register an admin.
5. Verification status defaults to `pending`. You can test approving an admin using an approved admin account or directly via DB.
6. Test `POST /api/ai/waste-recognition` with a sample image.
7. Test submitting a complaint at `POST /api/reports`.
8. Test updating status at `PATCH /api/reports/:id/status`.
