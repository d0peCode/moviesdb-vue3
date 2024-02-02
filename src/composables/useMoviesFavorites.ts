import {createSharedComposable, useLocalStorage} from "@vueuse/core";
import {LOCALSTORAGE_MOVIES_FAVORITES} from "@/app.storages";
import {TMovieData} from "@/types/movies";

const useMoviesFavorites = createSharedComposable(() => {
  const favorites = useLocalStorage<TMovieData[]>(LOCALSTORAGE_MOVIES_FAVORITES, [])

  const addFavorite = (movie: TMovieData) => {
    favorites.value.push(movie)
  }

  const removeFavorite = (movie: TMovieData) => {
    favorites.value = favorites.value.filter(e => (e.id !== movie.id))
  }

  return { favorites, addFavorite, removeFavorite };
});

export default useMoviesFavorites;
