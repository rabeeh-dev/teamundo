# StitchConnect — Frontend

Kerala's own professional networking platform. Built with React, designed for district-based discovery.

---

## Tech Stack

| Layer     | Choice              |
|-----------|---------------------|
| UI        | React 18            |
| Routing   | React Router v6     |
| HTTP      | Axios               |
| Styling   | Plain CSS (design tokens) |
| Fonts     | Syne · Hanken Grotesk · JetBrains Mono |

---

## Pages & Routes

| Route              | Component         | Access    |
|--------------------|-------------------|-----------|
| `/`                | LandingPage       | Public    |
| `/auth/callback`   | GoogleCallback    | Public    |
| `/onboarding`      | Onboarding        | Auth      |
| `/home`            | HomePage          | Protected |
| `/profile/:id`     | ProfilePage       | Protected |

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env.local
# Fill in your Google Client ID, Redirect URI, and API URL
```

### 3. Start dev server
```bash
npm start
# Runs on http://localhost:3000
```

### 4. Build for production
```bash
npm run build
# Output: /build folder — serve this from AWS S3 / CloudFront or EC2
```

---

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project → Enable **Google+ API** / **Google Identity**.
3. Create OAuth 2.0 credentials → Web Application type.
4. Add Authorized Redirect URIs:
   - Dev: `http://localhost:3000/auth/callback`
   - Prod: `https://yourdomain.com/auth/callback`
5. Copy the Client ID into `REACT_APP_GOOGLE_CLIENT_ID`.

---

## Backend API Expected Endpoints

The frontend calls these endpoints on your Express server:

| Method | Path                    | Description                          |
|--------|-------------------------|--------------------------------------|
| POST   | `/api/auth/google/callback` | Exchange Google code → JWT + user |
| POST   | `/api/users/onboarding` | Save onboarding form data            |
| GET    | `/api/users`            | Get users by `?district=&profession=`|
| GET    | `/api/users/me`         | Get current user profile             |
| GET    | `/api/users/:id`        | Get a specific user profile          |

### Expected user object
```json
{
  "_id": "mongo_object_id",
  "name": "Anandu Krishnan",
  "email": "anandu@gmail.com",
  "profilePhoto": "https://...",
  "district": "Ernakulam",
  "age": 26,
  "profession": "developer",
  "phone": "9876543210",
  "instagram": "anandu_codes",
  "bio": "Building cool stuff from Kerala.",
  "onboardingComplete": true
}
```

---

## AWS Deployment (Quick Guide)

### Option A — S3 + CloudFront (recommended for React SPA)
```bash
npm run build
aws s3 sync build/ s3://your-bucket-name --delete
# Configure CloudFront distribution pointing to the bucket
# Set error page to index.html for SPA routing
```

### Option B — EC2 with Nginx
```bash
npm run build
# Copy build/ to server
# Nginx config: serve build/index.html for all routes (SPA fallback)
```

---

## Folder Structure

```
src/
├── context/
│   └── AuthContext.jsx      # Global auth state + JWT
├── utils/
│   ├── api.js               # Axios instance + all API calls
│   └── constants.js         # Districts, professions
├── components/
│   ├── ProtectedRoute.jsx   # Auth guard
│   ├── UserCard.jsx         # Member card component
│   └── UserCard.css
├── pages/
│   ├── LandingPage.jsx/css  # Home marketing page
│   ├── GoogleCallback.jsx   # OAuth redirect handler
│   ├── Onboarding.jsx/css   # 6-step setup wizard
│   ├── HomePage.jsx/css     # District member feed
│   └── ProfilePage.jsx/css  # Individual profile view
├── App.jsx                  # Router setup
├── index.js                 # Entry point
└── index.css                # Design tokens + global reset
```
