import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View, Pressable, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { searchMovies } from '../api/omdbApi';
import { useFavorites } from '../context/FavoritesContext';
import MovieCard from '../components/MovieCard';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import { colors, spacing, radius, fontSize } from '../constants/theme';

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState('');

  const { isFavorite, toggleFavorite } = useFavorites();

  async function handleSearch() {
    const trimmed = query.trim();
    if (!trimmed) {
      return;
    }

    Keyboard.dismiss();
    setStatus('loading');
    setErrorMessage('');

    try {
      const results = await searchMovies(trimmed);
      setMovies(results);
      setStatus('success');
    } catch (error) {
      setMovies([]);
      setErrorMessage(error.message);
      setStatus('error');
    }
  }

  function renderContent() {
    if (status === 'loading') {
      return <LoadingIndicator label="Buscando películas..." />;
    }

    if (status === 'error') {
      return <ErrorMessage message={errorMessage} onRetry={handleSearch} />;
    }

    if (status === 'success' && movies.length === 0) {
      return (
        <EmptyState
          icon="search-outline"
          title="Sin resultados"
          subtitle="Intenta con otro título de película."
        />
      );
    }

    if (status === 'idle') {
      return (
        <EmptyState
          icon="film-outline"
          title="Explorador de Películas"
          subtitle="Busca tu película favorita usando el campo de arriba."
        />
      );
    }

    return (
      <FlatList
        data={movies}
        keyExtractor={(item) => item.imdbID}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <MovieCard
            movie={item}
            isFavorite={isFavorite(item.imdbID)}
            onToggleFavorite={() => toggleFavorite(item)}
            onPress={() => navigation.navigate('Details', { imdbID: item.imdbID })}
          />
        )}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.input}
          placeholder="Buscar película por título..."
          placeholderTextColor={colors.textSecondary}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <Pressable style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Buscar</Text>
        </Pressable>
      </View>
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: fontSize.body,
    paddingVertical: spacing.sm,
    marginLeft: spacing.sm,
  },
  searchButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  searchButtonText: {
    color: colors.textPrimary,
    fontWeight: '600',
    fontSize: fontSize.body,
  },
  listContent: {
    paddingBottom: spacing.lg,
  },
});
