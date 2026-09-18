import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getMovieDetails } from '../api/omdbApi';
import { useFavorites } from '../context/FavoritesContext';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorMessage from '../components/ErrorMessage';
import { colors, spacing, radius, fontSize } from '../constants/theme';

const PLACEHOLDER_POSTER = 'https://via.placeholder.com/300x445/1B1D3A/A0A3BD?text=Sin+imagen';

export default function DetailsScreen({ route }) {
  const { imdbID } = route.params;
  const [movie, setMovie] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [errorMessage, setErrorMessage] = useState('');

  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    loadDetails();
  }, [imdbID]);

  async function loadDetails() {
    setStatus('loading');
    try {
      const data = await getMovieDetails(imdbID);
      setMovie(data);
      setStatus('success');
    } catch (error) {
      setErrorMessage(error.message);
      setStatus('error');
    }
  }

  if (status === 'loading') {
    return <LoadingIndicator label="Cargando detalles..." />;
  }

  if (status === 'error') {
    return <ErrorMessage message={errorMessage} onRetry={loadDetails} />;
  }

  const posterUri = movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : PLACEHOLDER_POSTER;
  const favorite = isFavorite(movie.imdbID);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image source={{ uri: posterUri }} style={styles.poster} resizeMode="cover" />

      <View style={styles.headerRow}>
        <Text style={styles.title}>{movie.Title}</Text>
        <Pressable
          style={styles.favoriteButton}
          onPress={() =>
            toggleFavorite({
              imdbID: movie.imdbID,
              Title: movie.Title,
              Year: movie.Year,
              Poster: movie.Poster,
              Type: movie.Type,
            })
          }
        >
          <Ionicons
            name={favorite ? 'heart' : 'heart-outline'}
            size={28}
            color={favorite ? colors.accent : colors.textSecondary}
          />
        </Pressable>
      </View>

      <Text style={styles.subtitle}>
        {movie.Year} • {movie.Rated} • {movie.Runtime}
      </Text>

      <View style={styles.ratingRow}>
        <Ionicons name="star" size={18} color={colors.accent} />
        <Text style={styles.ratingText}>{movie.imdbRating} / 10 (IMDb)</Text>
      </View>

      <InfoRow label="Género" value={movie.Genre} />
      <InfoRow label="Director" value={movie.Director} />
      <InfoRow label="Reparto" value={movie.Actors} />

      <Text style={styles.sectionTitle}>Sinopsis</Text>
      <Text style={styles.plot}>{movie.Plot}</Text>
    </ScrollView>
  );
}

function InfoRow({ label, value }) {
  if (!value || value === 'N/A') {
    return null;
  }
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  poster: {
    width: '100%',
    height: 340,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceAlt,
    marginBottom: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: fontSize.headline,
    fontWeight: '700',
    marginRight: spacing.sm,
  },
  favoriteButton: {
    padding: spacing.xs,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: fontSize.body,
    marginTop: spacing.xs,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  ratingText: {
    color: colors.textPrimary,
    fontSize: fontSize.subtitle,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  infoRow: {
    marginBottom: spacing.sm,
  },
  infoLabel: {
    color: colors.accent,
    fontSize: fontSize.caption,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  infoValue: {
    color: colors.textPrimary,
    fontSize: fontSize.body,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.title,
    fontWeight: '700',
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  plot: {
    color: colors.textSecondary,
    fontSize: fontSize.body,
    lineHeight: 20,
  },
});
