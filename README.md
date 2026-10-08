# AakashMovies — Production-Ready MERN Discovery Platform

AakashMovies is a modern, high-performance, dark-cinematic movie and web-series discovery platform built with the MERN stack (MongoDB, Express, React, Node.js), Vite, and Tailwind CSS.

![AakashMovies Platform](https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80)

---

## 🌟 Key Features

- **🎬 Modern Dark Cinematic UI**: Premium streaming-platform design with dark vignette backdrops, hover overlays, glassmorphism panels, and smooth micro-animations.
- **🔍 Real-Time Debounced Search**: Live search endpoint (`GET /api/movies/search?q=query`) with autocomplete suggestions, title, language, genre, year, and cast matching.
- **🍿 Curated Home & Listing Pages**: Horizontally scrollable carousels, responsive grid layouts, and sorting (Latest, Popular, Highest Rated, A-Z, Z-A).
- **📺 Web Series & Multi-Season System**: Dedicated season tabs, episode selection, and playback structure.
- **🔒 JWT Authentication & Role-Based Auth**: Secure user registration, password hashing via bcrypt, user roles (`user` vs `admin`), and protected watchlist/review routes.
- **👑 Full Admin Control Dashboard**: Stats overview, movie/series CRUD operations, genre management, user role management, and deletion confirmation dialogs.
- **⭐ User Reviews & Favorites**: Interactive 10-star rating system, review submission, and persistent user watchlist.
- **🚀 Performance & SEO Optimized**: Dynamic page titles, Open Graph tags, code splitting (`React.lazy` & `Suspense`), image lazy loading, and Mongoose indexing.
- **🛡️ Security**: Integrated `helmet`, `cors`, and `express-rate-limit` middlewares.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 + Vite 5
- **Routing**: React Router v6
- **Styling**: Tailwind CSS v3 + Custom Design Tokens
- **Icons**: Lucide React
- **SEO & Metadata**: React Helmet Async
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js ES Modules
- **Framework**: Express.js
- **Database**: MongoDB & Mongoose
- **Security**: JWT, bcryptjs, Helmet, CORS, Express Rate Limit
- **Utilities**: Slugify, Dotenv

---

## 🚀 Quick Start & Installation Guide

### Prerequisites
- **Node.js** (v18+)
- **MongoDB** (Running locally on `mongodb://localhost:27017` or Mongo Memory Server fallback)

### Setup Steps

1. **Clone & Install Dependencies**:
   ```bash
   # Install root concurrently runner and all subfolder dependencies
   npm run install:all
   ```

2. **Database Seeding**:
   Populate MongoDB with 20 movies, 10 web series, 10 genres, and demo accounts (`admin@aakashmovies.com` / `admin123` & `user@aakashmovies.com` / `user123`):
   ```bash
   npm run seed
   ```

3. **Start Development Application**:
   Run both frontend client and Express server concurrently:
   ```bash
   npm run dev
   ```
   - **Frontend**: [http://localhost:5173](http://localhost:5173)
   - **Backend API**: [http://localhost:5000](http://localhost:5000)

---

## 🔑 Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@aakashmovies.com` | `admin123` |
| **Standard User** | `user@aakashmovies.com` | `user123` |

---

## ⚙️ Environment Variables

### Backend (`server/.env`)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/aakashmovies
JWT_SECRET=aakashmovies_super_secret_jwt_key_2026_cinematic
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📡 Key REST API Routes

### Authentication
- `POST /api/auth/register` — Register a new account
- `POST /api/auth/login` — Sign in user & issue JWT
- `GET /api/auth/me` — Get current user profile & favorites

### Movies & Web Series
- `GET /api/movies` — Paginated movies list with filter & sort options
- `GET /api/movies/featured` — Homepage curated collections
- `GET /api/movies/search?q=query` — Live debounced search
- `GET /api/movies/:slug` — Single movie detail page
- `GET /api/series` — Web series list
- `GET /api/series/:slug` — Web series seasons & episodes detail

### Favorites & Reviews
- `GET /api/favorites` — Fetch user watchlist
- `POST /api/favorites/:movieId` — Add to watchlist
- `DELETE /api/favorites/:movieId` — Remove from watchlist
- `GET /api/reviews/:movieId` — Fetch movie reviews
- `POST /api/reviews` — Add/Update user review

### Admin Dashboard (Admin Role Required)
- `GET /api/admin/stats` — Overview metrics
- `POST /api/movies` — Create movie
- `PUT /api/movies/:id` — Update movie
- `DELETE /api/movies/:id` — Delete movie
- `GET /api/admin/users` — List registered users
- `PUT /api/admin/users/:id/role` — Update user role

---

## 📜 License
This project is open source and available under the [MIT License](LICENSE).
