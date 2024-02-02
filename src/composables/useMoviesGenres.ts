import { ref } from "vue";
import { TMovieData } from "@/types/movies";
import { GET_MOVIES_GENRES } from "@/stores/movies.api";
import useApi from "@composables/useApi";

const useMoviesGenres = () => {
  const movies = ref<TMovieData[]>([]);
  const error = ref("");
  const loading = ref(false);
  const currentPage = ref(1);
  const end = ref(false);

  const getGenre = async (genre: number[], page: number = 1) => {
    loading.value = true;
    const response = await useApi(GET_MOVIES_GENRES, {
      query: {
        with_genres: !genre.includes(0) ? genre.join("|") : null,
        page: page,
      }
    })

    if (response.isSuccess) {
      movies.value = page <= currentPage.value
        ? response.data.results
        : movies.value.concat(response.data.results);
      end.value = response.data.total_pages === page;
      currentPage.value = page;
    }
    loading.value = false;
  };

  return { movies, error, loading, end, currentPage, getGenre };
};

export default useMoviesGenres;
