# Explorador de Películas 🎬

Proyecto Programado 2 — Programación para Dispositivos Móviles (TPA-4001).

Aplicación móvil desarrollada con **React Native + Expo** que permite buscar películas en tiempo real usando la API pública de [OMDb](https://www.omdbapi.com/), ver el detalle de cada título y guardar favoritos de forma persistente en el dispositivo.

## Funcionalidades

- **Búsqueda de películas** por título, consumiendo la API de OMDb.
- **Manejo de estados de carga y error** durante las peticiones a la API.
- **Detalle de película**: póster, año, duración, género, director, reparto, calificación de IMDb y sinopsis.
- **Favoritos persistentes**: agregar y quitar películas de favoritos desde la búsqueda o el detalle, guardadas localmente con `AsyncStorage` (se mantienen aunque se cierre la app).
- **Estado global** de favoritos compartido entre pantallas mediante Context API.
- **Navegación** por pestañas (Buscar / Favoritos) con pantalla de detalle en cada flujo.

## Tecnologías

- [Expo](https://expo.dev/) / React Native
- [React Navigation](https://reactnavigation.org/) (bottom tabs + native stack)
- [`@react-native-async-storage/async-storage`](https://react-native-async-storage.github.io/async-storage/) para persistencia local
- Context API para el estado global de favoritos
- [OMDb API](https://www.omdbapi.com/) como fuente de datos

## Arquitectura del proyecto

El código está organizado separando la lógica de red, la lógica de datos locales y las vistas, tal como lo pide la rúbrica del curso:

```
src/
├── api/                # Lógica de red: llamadas a la API de OMDb
│   └── omdbApi.js
├── storage/             # Lógica de base de datos local (AsyncStorage)
│   └── favoritesStorage.js
├── context/             # Estado global (Context API)
│   └── FavoritesContext.js
├── navigation/           # Configuración de navegación
│   └── AppNavigator.js
├── screens/              # Vistas / pantallas
│   ├── SearchScreen.js
│   ├── FavoritesScreen.js
│   └── DetailsScreen.js
├── components/           # Componentes de UI reutilizables
│   ├── MovieCard.js
│   ├── LoadingIndicator.js
│   ├── ErrorMessage.js
│   └── EmptyState.js
└── constants/            # Tema visual y configuración
    ├── theme.js
    └── config.js
```

## Cómo ejecutar el proyecto

1. Clonar el repositorio e instalar dependencias:

   ```bash
   npm install
   ```

2. Iniciar el proyecto con Expo:

   ```bash
   npx expo start
   ```

3. Escanear el código QR con la app **Expo Go** (Android/iOS) o presionar `w` para abrirlo en el navegador.

## Nota sobre la API

La aplicación usa una API key de prueba de OMDb ya incluida en `src/constants/config.js` para facilitar la ejecución del proyecto en el contexto académico del curso.
