import { OMDB_API_KEY, OMDB_BASE_URL } from '../constants/config';

// Toda la comunicación con la API de OMDb vive en este archivo,
// separada de la lógica de almacenamiento local y de las vistas.

async function fetchFromOmdb(params) {
  const query = new URLSearchParams({ apikey: OMDB_API_KEY, ...params }).toString();
  const response = await fetch(`${OMDB_BASE_URL}?${query}`);

  if (!response.ok) {
    throw new Error('No se pudo conectar con el servidor. Verifica tu conexión.');
  }

  const data = await response.json();

  if (data.Response === 'False') {
    throw new Error(data.Error || 'Ocurrió un error al consultar la API.');
  }

  return data;
}

export async function searchMovies(title) {
  const data = await fetchFromOmdb({ s: title, type: 'movie' });
  return data.Search;
}

export async function getMovieDetails(imdbID) {
  return fetchFromOmdb({ i: imdbID, plot: 'full' });
}
