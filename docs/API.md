# teamundo API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected routes require a JWT token in the `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

---

## Health Check

### `GET /api/health`

Check if the API is running.

**Auth required:** No

**Response:**
```json
{
  "success": true,
  "message": "teamundo API is running",
  "timestamp": "2026-06-06T12:00:00.000Z"
}
```

---

## Auth Endpoints

### `POST /api/auth/google/callback`

Exchange a Google OAuth authorization code for a JWT token.

**Auth required:** No

**Request Body:**
```json
{
  "code": "4/0AeaYSH..."
}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "665...",
    "name": "John Doe",
    "email": "john@gmail.com",
    "profilePhoto": "https://lh3.googleusercontent.com/...",
    "district": null,
    "onboardingComplete": false,
    "createdAt": "2026-06-06T12:00:00.000Z"
  },
  "token": "eyJhbGciOi..."
}
```

---

### `GET /api/auth/me`

Get the currently authenticated user.

**Auth required:** Yes

**Response (200):**
```json
{
  "success": true,
  "user": { ... }
}
```

---

### `POST /api/auth/logout`

Logout the user (server-side acknowledgment; token invalidation is client-side).

**Auth required:** Yes

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## User Endpoints

### `GET /api/users`

Get all users from the authenticated user's district.

**Auth required:** Yes

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `profession` | string | No | Filter by profession (e.g., `developer`, `student`) |

> **Business Rule:** The district is ALWAYS the authenticated user's district. Users cannot see users from other districts.

**Response (200):**
```json
{
  "success": true,
  "count": 15,
  "users": [
    {
      "_id": "665...",
      "name": "Jane Doe",
      "profilePhoto": "https://...",
      "district": "Malappuram",
      "age": 24,
      "profession": "developer",
      "instagram": "jane_doe",
      "phone": "9876543210",
      "bio": "Full stack developer",
      "onboardingComplete": true
    }
  ]
}
```

---

### `GET /api/users/me`

Get the current user's own profile.

**Auth required:** Yes

**Response (200):**
```json
{
  "success": true,
  "user": { ... }
}
```

---

### `GET /api/users/search`

Search users within the authenticated user's district.

**Auth required:** Yes

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | string | Yes | Search query (min 2 chars) |

**Response (200):**
```json
{
  "success": true,
  "count": 3,
  "users": [ ... ]
}
```

---

### `GET /api/users/:id`

Get a specific user's profile by ID.

**Auth required:** Yes

**Response (200):**
```json
{
  "success": true,
  "user": { ... }
}
```

---

## Profile Endpoints

### `POST /api/users/onboarding`

Complete the onboarding flow and set up the user's profile.

**Auth required:** Yes

**Request Body:**
```json
{
  "name": "John Doe",
  "district": "Malappuram",
  "age": 24,
  "profession": "developer",
  "instagram": "john_doe",
  "phone": "9876543210",
  "bio": "Building cool stuff"
}
```

**Response (200):**
```json
{
  "success": true,
  "user": { ... }
}
```

---

### `PUT /api/profile/update`

Update the authenticated user's profile. District cannot be changed.

**Auth required:** Yes

**Request Body (all fields optional):**
```json
{
  "name": "John Updated",
  "profession": "entrepreneur",
  "instagram": "new_handle",
  "phone": "1234567890",
  "bio": "Updated bio"
}
```

**Response (200):**
```json
{
  "success": true,
  "user": { ... }
}
```

---

### `GET /api/profile/me`

Alias for getting own profile.

**Auth required:** Yes

**Response (200):**
```json
{
  "success": true,
  "user": { ... }
}
```

---

## Error Responses

All errors follow a consistent format:

```json
{
  "success": false,
  "message": "Error description here"
}
```

### Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request (validation error, duplicate, etc.) |
| 401 | Unauthorized (missing/invalid token) |
| 404 | Not Found |
| 429 | Too Many Requests (rate limited) |
| 500 | Internal Server Error |

---

## User Schema

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `googleId` | String | Yes | From Google OAuth |
| `name` | String | Yes | User's full name |
| `email` | String | Yes | From Google, unique |
| `profileImage` | String | No | Google profile picture URL |
| `district` | String | On onboarding | One of 14 Kerala districts |
| `age` | Number | On onboarding | 16–80 |
| `profession` | String | On onboarding | From predefined list |
| `instagramUsername` | String | On onboarding | Required during onboarding |
| `phoneNumber` | String | No | Optional, 10 digits |
| `bio` | String | No | Max 160 characters |
| `isProfileCompleted` | Boolean | — | Auto-set after onboarding |

### Valid Districts
Thiruvananthapuram, Kollam, Pathanamthitta, Alappuzha, Kottayam, Idukki, Ernakulam, Thrissur, Palakkad, Malappuram, Kozhikode, Wayanad, Kannur, Kasaragod

### Valid Professions
developer, entrepreneur, designer, marketer, student, government_official, freelancer, artist, educator, healthcare, finance, other
