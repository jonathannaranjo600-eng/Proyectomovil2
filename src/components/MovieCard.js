import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, fontSize } from '../constants/theme';

const PLACEHOLDER_POSTER = 'https://via.placeholder.com/300x445/1B1D3A/A0A3BD?text=Sin+imagen';

export default function MovieCard({ movie, onPress, isFavorite, onToggleFavorite }) {
  const posterUri = movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : PLACEHOLDER_POSTER;

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image source={{ uri: posterUri }} style={styles.poster} resizeMode="cover" />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.Title}
        </Text>
        <Text style={styles.year}>{movie.Year}</Text>
      </View>
      {onToggleFavorite ? (
        <Pressable
          style={styles.favoriteButton}
          onPress={onToggleFavorite}
          hitSlop={10}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={22}
            color={isFavorite ? colors.accent : colors.textSecondary}
          />
        </Pressable>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  poster: {
    width: 80,
    height: 110,
    backgroundColor: colors.surfaceAlt,
  },
  info: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    justifyContent: 'center',
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSize.subtitle,
    fontWeight: '600',
  },
  year: {
    color: colors.textSecondary,
    fontSize: fontSize.body,
    marginTop: spacing.xs,
  },
  favoriteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
});
