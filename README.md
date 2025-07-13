# Encountrr

# 🧑‍🤝‍🧑 Companion Matcher

A full-stack matchmaking platform that allows users to:
- Register & manage their profile
- Discover new people with shared interests
- Shortlist users
- Create mutual matches
- Enjoy seamless authentication with auto token refresh

---

## 🔗 Tech Stack

| Frontend              | Backend               | Database       | Other          |
|-----------------------|-----------------------|----------------|----------------|
| React + Tailwind CSS  | Node.js + Express.js  | PostgreSQL     | JWT, Redux, Axios |
| Redux Toolkit         | Sequelize ORM         |                | Framer Motion, Toast |

---

## 📁 Project Structure

### 📦 `/frontend`
- React app for UI
- Components: MatchCard, Navbar, ProfileForm, etc.
- Pages: Home, Matches, Profile, Login, Register
- State management with Redux Toolkit
- `axios` with token auto-refresh
- Mobile responsive (hamburger nav)

### 📦 `/backend`
- Express.js API
- RESTful routes
- JWT authentication with access/refresh tokens
- PostgreSQL with Sequelize ORM
- Routes: `/auth`, `/matches`, `/profile`
- Middleware: protect routes, auto-refresh logic

---

## 🚀 Getting Started

### 🧑‍💻 Prerequisites
- Node.js (v18+)
- PostgreSQL
- Git
- npm or yarn

---

## 📂 Backend Setup

### 1. Navigate & Install
```bash
cd backend
npm install
```

### 2. Configure Environment
Create a `.env` file in `/backend`:
```env
PORT=5000
DATABASE_URL=postgres://user:password@localhost:5432/companion_matcher
JWT_SECRET=your_jwt_secret
```

### 3. Run Migrations & Seed (optional)
```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

### 4. Start the Server
```bash
npm run dev
```

---

## 📂 Frontend Setup

### 1. Navigate & Install
```bash
cd frontend
npm install
```

### 2. Create `.env` in `/frontend`
```env
VITE_API_BASE=http://localhost:5000
```

### 3. Start the React App
```bash
npm run dev
```

> Visit at: `http://localhost:5173`

---

## 🔐 Authentication Flow
- Login issues JWT `accessToken` (1 min expiry) and `refreshToken` (in HTTP-only cookie)
- Axios interceptor handles:
  - attaching Bearer token
  - refreshing expired tokens via `/auth/refresh`
- On logout, tokens are cleared and user is redirected to login

---

## 💘 Matchmaking Logic
- Each user can shortlist others
- If two users shortlist each other → ✅ Mutual Match
- Matches are categorized into:
  - Mutual Matches
  - Your Shortlists
  - Discover New People (based on shared interests)

---

## 📱 UI Highlights
- Fully responsive (mobile-first)
- TailwindCSS styled
- Animated match cards using Framer Motion
- Hamburger navigation on mobile
- Toast notifications for actions

---

## 📬 API Endpoints

### 🔐 Auth
| Method | Endpoint         | Description              |
|--------|------------------|--------------------------|
| POST   | /auth/register   | Register a user          |
| POST   | /auth/login      | Login a user             |
| POST   | /auth/refresh    | Refresh access token     |
| POST   | /auth/logout     | Logout & clear cookies   |

### ❤️ Matches
| Method | Endpoint                 | Description                    |
|--------|--------------------------|--------------------------------|
| GET    | /matches                 | Discover new users             |
| GET    | /matches/mutual          | Get mutual matches             |
| GET    | /matches/shortlisted     | Get your shortlists            |
| POST   | /shortlist               | Shortlist a user               |

### 👤 Profile
| Method | Endpoint       | Description         |
|--------|----------------|---------------------|
| GET    | /profile       | Get user profile    |
| PUT    | /profile       | Update profile      |

---

## 🧪 Testing
- Manual testing via Postman
- JWT token flow tested for expiry/refresh
- Responsive UI tested on multiple screen sizes

---

## 🧠 Future Improvements
- Add profile photos with cloud uploads
- Real-time chat using Socket.io
- In-app notifications
- Enhanced interest-based algorithm
- Friend suggestions with ML clustering

---

## 👨‍💻 Author
**Dipendra Kumar**  
Built with 💙 using MERN + PostgreSQL.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
