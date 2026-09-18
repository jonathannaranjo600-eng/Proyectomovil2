import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { readFavorites, writeFavorites } from '../storage/favoritesStorage';

// Estado global de favoritos, disponible para toda la app mediante Context API.
const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    readFavorites().then((stored) => {
      setFavorites(stored);
      setIsLoading(false);
    });
  }, []);

  const isFavorite = useCallback(
    (imdbID) => favorites.some((movie) => movie.imdbID === imdbID),
    [favorites]
  );

  const addFavorite = useCallback((movie) => {
    setFavorites((current) => {
      if (current.some((item) => item.imdbID === movie.imdbID)) {
        return current;
      }
      const updated = [...current, movie];
      writeFavorites(updated);
      return updated;
    });
  }, []);

  const removeFavorite = useCallback((imdbID) => {
    setFavorites((current) => {
      const updated = current.filter((item) => item.imdbID !== imdbID);
      writeFavorites(updated);
      return updated;
    });
  }, []);

  const toggleFavorite = useCallback(
    (movie) => {
      if (isFavorite(movie.imdbID)) {
        removeFavorite(movie.imdbID);
      } else {
        addFavorite(movie);
      }
    },
    [isFavorite, removeFavorite, addFavorite]
  );

  const value = {
    favorites,
    isLoading,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites debe usarse dentro de un FavoritesProvider');
  }
  return context;
}
