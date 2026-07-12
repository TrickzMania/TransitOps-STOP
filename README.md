# TransitOps — Fleet Command Center

A centralized fleet operations platform for dispatching, maintenance, fuel control, and analytics.

## Tech Stack

- **Frontend**: React 19 + Vite + React Router
- **Backend**: Node.js + Express 5 + PostgreSQL
- **Hosting**: Netlify (frontend) + Render (backend)

---

## Running Locally

### 1. Start the Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on **http://localhost:5000**

### 2. Start the Frontend (separate terminal)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on **http://localhost:5173** (Vite proxies `/api` → `localhost:5000`)

### Default login
- **Email**: any user from the `users` table
- **Password**: `password` (hackathon mode)

---

## Environment Variables

### Backend `.env`
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=transitops
DB_USER=postgres
DB_PASSWORD=yourpassword
CORS_ORIGIN=http://localhost:5173
```

### Frontend `.env.production` (for Netlify)
```
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## Deployment

### Backend → Render.com
1. Push code to GitHub (already done)
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect `TrickzMania/TransitOps-STOP` repo
4. Set **Root Directory** to `backend`
5. **Build Command**: `npm install`
6. **Start Command**: `npm start`
7. Add environment variables (DB_HOST, DB_USER, etc.)
8. Copy the deployed URL e.g. `https://transitops-api.onrender.com`

### Frontend → Netlify
1. Go to [netlify.com](https://netlify.com) → Add new site → Import from Git
2. Connect `TrickzMania/TransitOps-STOP` repo
3. Netlify auto-detects `netlify.toml` — no manual config needed
4. Add environment variable:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend.onrender.com/api`
5. Deploy!
