# ProKonnect - Premier Creator & Brand Collaboration Platform

ProKonnect connects top-tier influencers, creators, and students with businesses and brands for paid promotions, barter deals, and marketing campaigns.

Built by **Lokesh Sharma** (CEO & Founder).

---

## 🚀 Tech Stack

- **Frontend**: React 19, Vite, TailwindCSS, Framer Motion, Lucide Icons, React Router v7, React Hot Toast
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, Bcrypt, Multer, Helmet, Rate Limiting, Mongo Sanitize
- **AI Engine**: Groq Llama-3.1 AI Assistant with offline fallback FAQ database
- **Deployment Ready**: Docker, PM2 Cluster, Vercel, Render, Railway, AWS/DigitalOcean

---

## 📁 Project Structure

```text
prokonnect4/
├── backend/
│   ├── config/          # Database configuration (db.js)
│   ├── controllers/     # Auth, Offers, Users controllers
│   ├── middleware/      # JWT Protect, Error Handling
│   ├── models/          # User and Offer Mongoose Schemas
│   ├── routes/          # API Routes (auth, users, offers, upload, chat)
│   ├── utils/           # Token generation, Email transporter
│   ├── uploads/         # Uploaded images & screenshots
│   └── server.js        # Express server entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # ChatWidget, Navbar, ProtectedRoute, ThemeToggle, UI fx
│   │   ├── config/      # API & Asset URL resolvers
│   │   ├── context/     # UserContext, ThemeContext, ToastContext
│   │   ├── layouts/     # DashboardLayout
│   │   └── pages/       # 21 fully-functional pages (Landing, Dashboards, Details, Auth, etc.)
│   ├── index.html
│   └── vite.config.js
├── Dockerfile           # Multi-stage production container build
├── docker-compose.yml   # Fullstack + MongoDB orchestration
├── ecosystem.config.cjs # PM2 production cluster configuration
└── package.json         # Unified root orchestration scripts
```

---

## 🛠️ Local Development Setup

### 1. Prerequisites
- Node.js (v18 or v20 recommended)
- MongoDB (Running locally on `mongodb://localhost:27017/prokonnect` or a free MongoDB Atlas cluster)

### 2. Installation
```bash
# Install all root, backend, and frontend dependencies
npm run install-all
```

### 3. Environment Variables
Create `backend/.env` (see `backend/.env.example`):
```env
NODE_ENV=development
PORT=5001
MONGO_URI=mongodb://localhost:27017/prokonnect
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
GROQ_API_KEY=gsk_your_groq_api_key_here
CLIENT_URL=http://localhost:5174
```

### 4. (Optional) Seed Sample Database
```bash
npm run data:import --prefix backend
```

### 5. Run Concurrently
```bash
npm run dev
```
- Frontend: `http://localhost:5174`
- Backend API: `http://localhost:5001`

---

## 🌐 Production Deployment Options

### Option A: Unified Single-Service Deployment (Render / Railway / VPS)
Runs the backend API and serves the compiled React frontend from a single web service:

1. **Build Command**: `npm run build:all`
2. **Start Command**: `npm start`
3. **Environment Variables on Cloud Provider**:
   - `NODE_ENV` = `production`
   - `PORT` = `5001` (or provider's default `$PORT`)
   - `MONGO_URI` = `mongodb+srv://<user>:<password>@cluster.mongodb.net/prokonnect`
   - `JWT_SECRET` = `<secure_random_string_32_chars>`
   - `GROQ_API_KEY` = `gsk_...`
   - `CLIENT_URL` = `https://your-custom-domain.com`

---

### Option B: Decoupled (Vercel Frontend + Render/Railway Backend)

#### 1. Deploy Backend (Render / Railway / Fly.io)
- Root directory: `backend` (or project root with start command `node backend/server.js`)
- Environment variables: `MONGO_URI`, `JWT_SECRET`, `GROQ_API_KEY`, `CLIENT_URL` (set to your Vercel URL)

#### 2. Deploy Frontend (Vercel)
- Root directory: `frontend`
- Framework Preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`
- Environment Variables:
  - `VITE_API_URL` = `https://your-backend-api.onrender.com`

---

### Option C: Docker / Docker Compose
```bash
# Build and run containers in background
docker compose up --build -d

# Check logs
docker compose logs -f backend
```

---

## 🔒 Security & Optimization Features Included

- **Helmet**: Hardened HTTP security headers
- **MongoSanitize**: Protection against NoSQL query injection attacks
- **Express Rate Limit**: Global rate limiting across all API endpoints
- **JWT Protection**: Bearer token authentication & role-based route guarding
- **Password Hashing**: Bcrypt encryption with pre-save salting
- **Graceful Shutdown**: Zero-downtime shutdown handling for SIGTERM/SIGINT
- **Health Check Endpoint**: `/api/health` for 24/7 uptime monitoring
