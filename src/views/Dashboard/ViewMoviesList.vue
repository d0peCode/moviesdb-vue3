<script setup lang="ts">
import { ref, Ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useInfiniteScroll } from "@vueuse/core";
import useMoviesGenres from "@/composables/useMoviesGenres";
import { CategoriesTabs, MovieCard } from "@/app.organizer";
import { TCategoryItem } from "@/types/movies";
import { ROUTE_DASHBOARD_MOVIES_LIST } from "@/app.routes";

const router = useRouter();
const refInfiniteList = ref();
const currentTab: Ref<TCategoryItem | undefined> = ref();

const categories = [
  {
    name: "All",
    value: [28, 16, 12, 35, 99],
  },
  {
    name: "Action",
    value: [28],
  },
  {
    name: "Animation",
    value: [16],
  },
  {
    name: "Adventure",
    value: [12],
  },
  {
    name: "Comedy",
    value: [35],
  },
  {
    name: "Documentary",
    value: [99],
  },
];

const getCategory = (name: string): TCategoryItem | undefined => {
  return categories.find(e => e.name === name);
};

const queryGenre = (router.currentRoute?.value?.query?.genre as string) || null;
if (queryGenre) {
  let categoryQuery = getCategory(queryGenre);
  if (categoryQuery) currentTab.value = categoryQuery;
} else {
  currentTab.value = categories[0];
}

const { movies, currentPage, end, getGenre } = useMoviesGenres();

useInfiniteScroll(
  refInfiniteList,
  () => {
    if (!end.value) {
      const category = currentTab.value;
      if (category) getGenre(category.value, currentPage.value + 1);
    }
  },
  { distance: 400 }
);

const onChangeTab = (tab: TCategoryItem) => {
  router.push({
    name: ROUTE_DASHBOARD_MOVIES_LIST.name,
    query: { genre: tab.name },
  });
  currentTab.value = tab;
  getGenre(tab.value, 1);
  refInfiniteList.value.scrollTo(0, 0);
};

onMounted(() => {
  const category = currentTab.value;
  if (category) getGenre(category.value, currentPage.value);
  if (window.innerHeight > 1300 && category) {
    // for large screen only first page is loaded
    // user can not trigger infinite scroll callback
    // we fix it by adding one more page to load onMounted
    // (sorry for comments I usually don't write them at all)
    getGenre(category.value, currentPage.value + 1);
  }
});
</script>

<template>
  <div class="db-movies-list flex-1 flex flex-col p-1 pt-16 overflow-hidden">
    <CategoriesTabs
      :items="categories"
      @onChange="onChangeTab"
      :value="currentTab"
      class="a-04 fadeInDown"
    />
    <div
      :ref="(ref) => (refInfiniteList = ref)"
      class="a-07 fadeInUp h-10 overflow-y-scroll flex-auto"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <MovieCard
          v-for="(movie, index) in movies"
          :key="'m-' + index"
          :data="movie"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss"></style>
