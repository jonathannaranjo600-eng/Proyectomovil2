import AsyncStorage from '@react-native-async-storage/async-storage';

// Toda la lectura/escritura en el almacenamiento local del dispositivo
// vive en este archivo, separada de la lógica de red y de las vistas.
const FAVORITES_KEY = '@movie_explorer:favorites';

export async function readFavorites() {
  try {
    const json = await AsyncStorage.getItem(FAVORITES_KEY);
    return json ? JSON.parse(json) : [];
  } catch (error) {
    console.warn('No se pudieron leer los favoritos guardados.', error);
    return [];
  }
}

export async function writeFavorites(favorites) {
  try {
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.warn('No se pudieron guardar los favoritos.', error);
  }
}
