import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useFavorites } from '../context/FavoritesContext';
import MovieCard from '../components/MovieCard';
import EmptyState from '../components/EmptyState';
import LoadingIndicator from '../components/LoadingIndicator';
import { colors, spacing } from '../constants/theme';

export default function FavoritesScreen({ navigation }) {
  const { favorites, isLoading, isFavorite, toggleFavorite } = useFavorites();

  if (isLoading) {
    return <LoadingIndicator label="Cargando favoritos..." />;
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="heart-outline"
          title="Aún no tienes favoritos"
          subtitle="Agrega películas desde la pestaña Buscar tocando el corazón."
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
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
  listContent: {
    paddingBottom: spacing.lg,
  },
});
