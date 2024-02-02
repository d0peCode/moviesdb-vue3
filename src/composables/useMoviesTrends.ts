import { ref } from "vue";
import useApi from "@composables/useApi";
import {GET_MOVIES_POPULAR} from "@/stores/movies.api";
import {useLocalStorage} from "@vueuse/core";
import {LOCALSTORAGE_MOVIES_FAVORITES} from "@/app.storages";
import {TMovieData} from "@/types/movies";

const useMoviesTrends = () => {
  const favorites = useLocalStorage<TMovieData[]>(LOCALSTORAGE_MOVIES_FAVORITES, [])
  const trends = ref([]);
  const error = ref("");
  const loading = ref(false);

  const getTrends = async () => {
    loading.value = true;
    const response = await useApi(GET_MOVIES_POPULAR);

    if (response.isSuccess) {
      trends.value = response.data.results.slice(0, 4);
    }
    loading.value = false;
  };

  const addFavorite = (movie: TMovieData) => {
    favorites.value.push(movie)
  }

  const removeFavorite = (movie: TMovieData) => {
    favorites.value = favorites.value.filter(e => (e.id !== movie.id))
  }

  return { favorites, trends, error, loading, getTrends, addFavorite, removeFavorite };
};

export default useMoviesTrends;
