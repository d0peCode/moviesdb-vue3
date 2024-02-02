import { ref } from "vue";
import useApi from "@composables/useApi";
import {GET_MOVIES_POPULAR} from "@/stores/movies.api";
import {TMovieData} from "@/types/movies";

const useMoviesTrends = () => {
  const movies = ref<TMovieData[]>([]);
  const error = ref("");
  const loading = ref(false);

  const getTrends = async () => {
    loading.value = true;
    const response = await useApi(GET_MOVIES_POPULAR);

    if (response.isSuccess) {
      movies.value = response.data.results.slice(0, 4);
      console.log('after set', movies.value)
    }
    loading.value = false;
  };

  return { movies, error, loading, getTrends };
};

export default useMoviesTrends;
