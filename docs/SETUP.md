# teamundo — Development Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v18 or higher — [Download](https://nodejs.org/)
- **MongoDB** v6 or higher — [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Git** — [Download](https://git-scm.com/)
- A **Google Cloud Console** project with OAuth 2.0 credentials

---

## 1. Clone the Repository

```bash
git clone https://github.com/your-username/teamundo.git
cd teamundo
```

---

## 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing one)
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Select **Web application**
6. Add the following:
   - **Authorized JavaScript Origins:**
     - `http://localhost:3000`
   - **Authorized Redirect URIs:**
     - `http://localhost:3000/auth/callback`
7. Copy the **Client ID** and **Client Secret**

---

## 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit `backend/.env` with your values:

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb://localhost:27017/teamundo

JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback

FRONTEND_URL=http://localhost:3000
```

Start the backend:

```bash
npm run dev
```

The API will be available at `http://localhost:5000`. Verify it's running:

```bash
curl http://localhost:5000/api/health
```

---

## 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit `frontend/.env` with your values:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## 5. MongoDB Setup

### Option A: Local MongoDB

1. Install MongoDB Community Server
2. Start the MongoDB service:
   ```bash
   mongod --dbpath /path/to/data/db
   ```
3. Use the connection string: `mongodb://localhost:27017/teamundo`

### Option B: MongoDB Atlas (Cloud)

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a database user
3. Whitelist your IP address
4. Get the connection string and replace `MONGODB_URI` in `backend/.env`

---

## 6. Running Both Together

Open two terminal windows:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

---

## Project Structure

```
teamundo/
│
├── frontend/              # React + Vite frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page-level components
│   │   ├── services/      # API service layer
│   │   ├── context/       # React Context providers
│   │   ├── hooks/         # Custom React hooks
│   │   ├── constants/     # App constants
│   │   ├── routes/        # Route configuration
│   │   ├── utils/         # Utility functions
│   │   ├── validations/   # Form validation logic
│   │   └── layouts/       # Layout wrappers
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/               # Express.js API server
│   ├── src/
│   │   ├── config/        # DB, environment config
│   │   ├── controllers/   # Route handlers
│   │   ├── middleware/     # Auth, error, validation
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # Express routers
│   │   ├── services/      # Business logic
│   │   ├── utils/         # JWT, error helpers
│   │   └── validations/   # Request schemas
│   ├── nodemon.json
│   └── package.json
│
├── docs/                  # Documentation
│   ├── API.md
│   └── SETUP.md
│
├── .gitignore
└── README.md
```

---

## Common Issues

### "MongoDB connection error"
- Ensure MongoDB is running (`mongod` or check Atlas)
- Verify `MONGODB_URI` in `backend/.env`

### "Google OAuth error"
- Verify your Client ID and Secret are correct
- Ensure redirect URI matches exactly in both Google Console and `.env`
- Check that `http://localhost:3000` is in authorized JavaScript origins

### "CORS error"
- Ensure `FRONTEND_URL` in `backend/.env` matches the frontend URL
- The backend CORS config must include the frontend origin

### "Token expired"
- The JWT expires after the duration set in `JWT_EXPIRES_IN`
- Users will need to sign in again after expiry
