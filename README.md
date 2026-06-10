<div align="center">

# 🌴 teamundo

**Kerala's Own District-Based Networking Hub**

Find people from your district, grow your network, and build something great together.

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)

</div>

---

## 🎯 About

teamundo is a district-based professional networking platform where users can discover and connect with people from the same district in Kerala. Users authenticate via Google, complete a guided onboarding flow, and are matched with professionals from their district.

### Key Features

- 🔐 **Google Authentication** — Secure sign-in with Google OAuth 2.0
- 📋 **Guided Onboarding** — 6-step profile setup (name, district, age, profession, contact info)
- 🗺️ **District-Based Discovery** — Users only see people from their own district
- 🔍 **Category Filters** — Filter users by profession
- 👤 **Profile View** — Detailed profile pages with contact information
- ⚙️ **Settings** — Edit profile, manage account
- 📱 **Fully Responsive** — Works beautifully on all screen sizes

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, React Router v6, Vite, Vanilla CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Auth** | Google OAuth 2.0, JWT |
| **Security** | Helmet, CORS, Rate Limiting |

---

## 📁 Project Structure

```
teamundo/
├── frontend/                # React + Vite
│   ├── src/
│   │   ├── components/      # UI components (common, layout, users, ui)
│   │   ├── pages/           # Page components (Landing, Auth, Dashboard, etc.)
│   │   ├── services/        # API service layer
│   │   ├── context/         # React Context (AuthContext)
│   │   ├── hooks/           # Custom hooks
│   │   ├── constants/       # Districts, professions
│   │   ├── routes/          # Route configuration
│   │   ├── utils/           # Utility functions
│   │   ├── validations/     # Form validations
│   │   └── layouts/         # Layout wrappers
│   └── package.json
│
├── backend/                 # Express.js API
│   ├── src/
│   │   ├── config/          # Database, environment
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/       # Auth, error handling, validation
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── utils/           # JWT, error helpers
│   │   └── validations/     # Request validation schemas
│   └── package.json
│
├── docs/                    # Documentation
│   ├── API.md               # API endpoint reference
│   └── SETUP.md             # Development setup guide
│
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB 6+
- Google Cloud Console project with OAuth credentials

### 1. Clone & Setup

```bash
git clone https://github.com/your-username/teamundo.git
cd teamundo
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI, Google OAuth credentials, and JWT secret
npm run dev
```

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your Google Client ID
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> 📖 For detailed setup instructions including Google OAuth configuration, see [docs/SETUP.md](docs/SETUP.md)

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/google/callback` | No | Exchange Google OAuth code |
| `GET` | `/api/auth/me` | Yes | Get current user |
| `POST` | `/api/auth/logout` | Yes | Logout |
| `GET` | `/api/users` | Yes | List district users |
| `GET` | `/api/users/me` | Yes | Get own profile |
| `GET` | `/api/users/search?q=` | Yes | Search users |
| `GET` | `/api/users/:id` | Yes | Get user by ID |
| `POST` | `/api/users/onboarding` | Yes | Complete onboarding |
| `PUT` | `/api/profile/update` | Yes | Update profile |
| `GET` | `/api/profile/me` | Yes | Get own profile |
| `GET` | `/api/health` | No | Health check |

> 📖 Full API documentation: [docs/API.md](docs/API.md)

---

## 🔒 Business Logic

**District Scoping:** Users can ONLY see and interact with users from their own district. This is enforced at both the backend (API always filters by authenticated user's district) and frontend levels.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is private and proprietary.

---

<div align="center">

**Built with ❤️ for Kerala**

*God's Own Networking Hub*

</div>
# teamundo
