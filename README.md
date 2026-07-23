# NextHire — AI-Powered Job Preparation Platform

NextHire is a full-stack web app that reads your resume the way an ATS bot and a recruiter would at the same time. Upload a PDF and it returns an ATS compatibility score, missing keywords, skill gaps for your target role, rewritten bullet points, and a personalized mock interview with AI-scored feedback on your answers.

**Stack:** React.js (Vite) · Node.js · Express.js · MongoDB · JWT · Google Gemini AI

---

## Table of contents

1. [Features](#features)
2. [Tech stack](#tech-stack)
3. [File structure](#file-structure)
4. [Prerequisites](#prerequisites)
5. [Setup — step by step](#setup--step-by-step)
6. [Environment variables](#environment-variables)
7. [Running the app](#running-the-app)
8. [API reference](#api-reference)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)

---

## Features

- **Secure authentication** — JWT-based register/login, passwords hashed with bcrypt.
- **AI resume analysis** — upload a PDF, get back:
  - ATS compatibility score (0–100)
  - Overall summary, strengths, weaknesses
  - Missing keywords for your target role
  - Skill-gap list with importance level + how to close each gap
  - Formatting/ATS-parsing issues
  - Before/after rewrites of weak bullet points
- **Personalized mock interviews** — Gemini generates 8 questions (technical, behavioral, situational, role-specific) tailored to your target role and, optionally, your actual resume content.
- **AI-scored answers** — submit an answer to any question and get a 0–10 score plus specific, constructive feedback.
- **Dashboard** — history of every resume scan and interview session, with your latest ATS score front and center.
- **Modern, distinctive UI** — dark "ATS scanner" theme with an animated scanning hero, spotlight hover cards, circular score gauges, and a full mobile-responsive layout.

---

## Tech stack

| Layer          | Technology                                                             |
|-----------------|-------------------------------------------------------------------------|
| Frontend        | React 18, Vite, React Router, Tailwind CSS, Framer Motion, Lucide icons |
| Backend         | Node.js, Express.js                                                    |
| Database        | MongoDB + Mongoose                                                      |
| Auth            | JWT (jsonwebtoken) + bcryptjs                                           |
| AI              | Google Gemini API (`@google/generative-ai`)                             |
| PDF parsing     | `pdf-parse`                                                             |
| File upload     | Multer (in-memory storage)                                             |
| Deployment      | Vercel (frontend) + Render/Railway/any Node host (backend)             |

---

## File structure

```
nexthire/
├── backend/
│   ├── config/
│   │   ├── db.js               # MongoDB connection
│   │   └── gemini.js           # Gemini client + JSON-safe prompt helper
│   ├── controllers/
│   │   ├── authController.js       # register, login, profile
│   │   ├── resumeController.js     # upload + AI resume analysis, history
│   │   └── interviewController.js  # generate questions, score answers
│   ├── middleware/
│   │   ├── auth.js             # JWT "protect" middleware
│   │   ├── errorHandler.js     # centralized error + 404 handler
│   │   └── upload.js           # Multer config (PDF only, 5MB limit)
│   ├── models/
│   │   ├── User.js
│   │   ├── Resume.js
│   │   └── InterviewSession.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── resumeRoutes.js
│   │   └── interviewRoutes.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── pdfParser.js
│   ├── uploads/                # (empty — Multer uses memory storage)
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js                # app entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── SpotlightCard.jsx        # hover-glow card (Aceternity-style)
│   │   │   ├── ScoreGauge.jsx           # circular ATS score
│   │   │   ├── ResumeScannerMockup.jsx  # animated hero visual
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── Loader.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ResumeAnalyzer.jsx
│   │   │   └── InterviewPrep.jsx
│   │   ├── services/
│   │   │   └── api.js           # Axios instance + auth interceptor
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── README.md
```

---

## Prerequisites

Install these before you start:

- **Node.js** v18 or later — [nodejs.org](https://nodejs.org)
- **MongoDB** — either:
  - a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) cluster (recommended), or
  - MongoDB running locally (`mongod`)
- **A Google Gemini API key** — free at [Google AI Studio](https://aistudio.google.com/app/apikey)
- **Git** (optional, for version control/deployment)

---

## Setup — step by step

### 1. Get the code onto your machine

Unzip the project, or if you push it to GitHub first:

```bash
git clone <your-repo-url>
cd nexthire
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Now open `backend/.env` and fill in the real values (see [Environment variables](#environment-variables) below). At minimum you need:

- `MONGO_URI` — your MongoDB connection string
- `JWT_SECRET` — any long random string (e.g. generate one with `openssl rand -hex 32`)
- `GEMINI_API_KEY` — your Gemini API key

Start the backend:

```bash
npm run dev
```

You should see:
```
✅ MongoDB connected: <host>
🚀 NextHire API listening on port 5000 [development]
```

Test it's alive: open `http://localhost:5000/api/health` in your browser — you should see a JSON success response.

### 3. Frontend setup

Open a **new terminal tab**, then:

```bash
cd frontend
npm install
cp .env.example .env
```

`frontend/.env` should point at your backend:
```
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser. Register a new account, then try uploading a resume PDF on the "Resume Scan" page.

---

## Environment variables

### `backend/.env`

| Variable            | Description                                                        | Example                                             |
|---------------------|----------------------------------------------------------------------|------------------------------------------------------|
| `PORT`              | Port the API runs on                                                 | `5000`                                                |
| `NODE_ENV`          | `development` or `production`                                        | `development`                                         |
| `MONGO_URI`         | MongoDB connection string                                             | `mongodb+srv://user:pass@cluster.mongodb.net/nexthire`|
| `JWT_SECRET`        | Random secret used to sign JWTs — keep this private                  | `a1b2c3...` (32+ random chars)                        |
| `JWT_EXPIRES_IN`    | How long login tokens stay valid                                     | `7d`                                                  |
| `GEMINI_API_KEY`    | Your Google Gemini API key                                            | `AIza...`                                             |
| `GEMINI_MODEL`      | Gemini model to use                                                   | `gemini-1.5-flash`                                    |
| `CLIENT_URL`        | Frontend origin, for CORS                                             | `http://localhost:5173`                               |
| `MAX_UPLOAD_SIZE_MB`| Max resume upload size in MB                                          | `5`                                                    |

### `frontend/.env`

| Variable        | Description                       | Example                              |
|------------------|------------------------------------|----------------------------------------|
| `VITE_API_URL`  | Base URL of your backend API       | `http://localhost:5000/api`            |

---

## Running the app

Two terminals, both from the project root:

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

Then visit **http://localhost:5173**.

---

## API reference

Base URL: `http://localhost:5000/api`

### Auth
| Method | Endpoint       | Auth | Description             |
|--------|----------------|------|--------------------------|
| POST   | `/auth/register` | No  | Create account, returns JWT |
| POST   | `/auth/login`     | No  | Login, returns JWT       |
| GET    | `/auth/me`        | Yes | Get current profile      |
| PUT    | `/auth/me`        | Yes | Update name / target role |

### Resumes
| Method | Endpoint          | Auth | Description                                    |
|--------|-------------------|------|--------------------------------------------------|
| POST   | `/resumes/analyze`| Yes  | Upload PDF (`multipart/form-data`, field `resume`) + `targetRole`, run AI analysis |
| GET    | `/resumes`        | Yes  | List your past analyses                          |
| GET    | `/resumes/:id`    | Yes  | Get one full analysis                             |
| DELETE | `/resumes/:id`    | Yes  | Delete an analysis                                |

### Interviews
| Method | Endpoint                        | Auth | Description                                  |
|--------|----------------------------------|------|-------------------------------------------------|
| POST   | `/interviews/generate`          | Yes  | Body: `{ role, experienceLevel, resumeId? }` — generates 8 questions |
| GET    | `/interviews`                   | Yes  | List your past sessions                          |
| GET    | `/interviews/:sessionId`        | Yes  | Get one full session                             |
| POST   | `/interviews/:sessionId/answer` | Yes  | Body: `{ questionId, answer }` — returns AI score + feedback |

All authenticated routes expect header: `Authorization: Bearer <token>`

---

## Deployment

### Frontend → Vercel
1. Push the `frontend/` folder to a GitHub repo (or the whole monorepo, setting Vercel's "Root Directory" to `frontend`).
2. In Vercel, import the repo, framework preset **Vite**.
3. Add environment variable `VITE_API_URL` = your deployed backend URL + `/api`.
4. Deploy.

### Backend → Render / Railway / any Node host
1. Push `backend/` to a repo.
2. Create a new Web Service, root directory `backend`, build command `npm install`, start command `npm start`.
3. Add all variables from `backend/.env.example` in the host's environment settings — especially `MONGO_URI`, `JWT_SECRET`, `GEMINI_API_KEY`, and `CLIENT_URL` (set this to your live Vercel URL so CORS allows it).
4. Deploy, then confirm `https://your-backend-url/api/health` responds.

### Database → MongoDB Atlas
1. Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas/register).
2. Add a database user and allow network access from `0.0.0.0/0` (or your host's IPs).
3. Copy the connection string into `MONGO_URI`.

---

## Troubleshooting

- **"MongoDB connection error"** — check `MONGO_URI`, make sure your IP is allow-listed in Atlas, and that the password in the URI doesn't contain unescaped special characters.
- **"AI response could not be parsed"** — Gemini occasionally wraps output in extra text; the backend already strips markdown fences, but if this persists, try switching `GEMINI_MODEL` to `gemini-1.5-pro` for more consistent JSON output.
- **"Could not extract readable text from this PDF"** — the uploaded PDF is likely a scanned image rather than real text. Export the resume as a text-based PDF (e.g. from Word/Google Docs "Save as PDF").
- **CORS errors in the browser console** — make sure `CLIENT_URL` in `backend/.env` exactly matches the URL your frontend is running on (including protocol and port).
- **401 errors right after logging in** — your `JWT_SECRET` may have changed between signup and login; clear `localStorage` and log in again.

---

Built as a portfolio-ready, production-structured reference project. Feel free to extend it — e.g. add a cover-letter generator, LinkedIn-profile scan, or a live voice-based mock interview mode.
