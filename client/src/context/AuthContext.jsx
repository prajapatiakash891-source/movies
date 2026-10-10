import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  // Check auth state on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('aakashmovies_token');
      if (token) {
        try {
          const res = await API.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
            const favIds = res.data.user.favorites
              ? res.data.user.favorites.map((f) => (typeof f === 'object' ? f._id : f))
              : [];
            setFavorites(favIds);
          }
        } catch (err) {
          console.error('Failed to load user session', err);
          localStorage.removeItem('aakashmovies_token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  // Login handler
  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    if (res.data.success) {
      localStorage.setItem('aakashmovies_token', res.data.token);
      setUser(res.data.user);
      const favIds = res.data.user.favorites
        ? res.data.user.favorites.map((f) => (typeof f === 'object' ? f._id : f))
        : [];
      setFavorites(favIds);
      return res.data;
    }
  };

  // Register handler
  const register = async (name, email, password) => {
    const res = await API.post('/auth/register', { name, email, password });
    if (res.data.success) {
      localStorage.setItem('aakashmovies_token', res.data.token);
      setUser(res.data.user);
      setFavorites([]);
      return res.data;
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('aakashmovies_token');
    setUser(null);
    setFavorites([]);
  };

  // Toggle favorite helper
  const toggleFavorite = async (movieId) => {
    if (!user) return false;

    const isFav = favorites.includes(movieId);
    try {
      if (isFav) {
        await API.delete(`/favorites/${movieId}`);
        setFavorites((prev) => prev.filter((id) => id !== movieId));
      } else {
        await API.post(`/favorites/${movieId}`);
        setFavorites((prev) => [...prev, movieId]);
      }
      return true;
    } catch (err) {
      console.error('Failed to update favorites', err);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        favorites,
        login,
        register,
        logout,
        toggleFavorite,
        isFavorite: (id) => favorites.includes(id),
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
