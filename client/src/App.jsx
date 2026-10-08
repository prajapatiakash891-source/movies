import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import PageLoader from './components/PageLoader';

// Lazy Loaded Pages for performance & code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const MoviesPage = lazy(() => import('./pages/MoviesPage'));
const WebSeriesPage = lazy(() => import('./pages/WebSeriesPage'));
const MovieDetailPage = lazy(() => import('./pages/MovieDetailPage'));
const SeriesDetailPage = lazy(() => import('./pages/SeriesDetailPage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Admin Lazy Loaded Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminMoviesPage = lazy(() => import('./pages/admin/AdminMoviesPage'));
const AdminMovieFormPage = lazy(() => import('./pages/admin/AdminMovieFormPage'));
const AdminSeriesPage = lazy(() => import('./pages/admin/AdminSeriesPage'));
const AdminSeriesFormPage = lazy(() => import('./pages/admin/AdminSeriesFormPage'));
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsersPage'));
const AdminGenresPage = lazy(() => import('./pages/admin/AdminGenresPage'));

// Protected User Route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Admin Protected Route wrapper
const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <PageLoader />;
  if (!user || !isAdmin) return <Navigate to="/login" replace />;
  return children;
};

export function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Main Public & User Routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="movies" element={<MoviesPage />} />
              <Route path="web-series" element={<WebSeriesPage />} />
              <Route path="movie/:slug" element={<MovieDetailPage />} />
              <Route path="series/:slug" element={<SeriesDetailPage />} />
              <Route path="series/:slug/season/:seasonNum/episode/:episodeNum" element={<SeriesDetailPage />} />
              <Route path="category/:slug" element={<CategoryPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              
              {/* User Protected Routes */}
              <Route
                path="favorites"
                element={
                  <ProtectedRoute>
                    <FavoritesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="movies" element={<AdminMoviesPage />} />
              <Route path="movies/create" element={<AdminMovieFormPage />} />
              <Route path="movies/edit/:id" element={<AdminMovieFormPage />} />
              <Route path="series" element={<AdminSeriesPage />} />
              <Route path="series/create" element={<AdminSeriesFormPage />} />
              <Route path="series/edit/:id" element={<AdminSeriesFormPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="genres" element={<AdminGenresPage />} />
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
