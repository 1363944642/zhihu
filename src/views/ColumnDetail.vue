<template>
  <div class="column-detail-page w-75 mx-auto">
    <div
      class="column-info row mb-4 border-bottom pb-4 align-items-center"
      v-if="column"
    >
      <div class="col-3 text-center">
        <img
          v-if="column.avatar"
          :src="column.avatar.url"
          :alt="column.title"
          class="rounded-circle border w-100"
        />
      </div>
      <div class="col-9">
        <h4>{{ column.title }}</h4>
        <p class="text-muted">{{ column.description }}</p>
      </div>
    </div>
    <post-list :list="list"></post-list>
    <button
      class="btn btn-outline-primary JiaZaiBtn mt-2 mb-5 mx-auto btn-block w-25"
      @click="loadMorePage"
      v-if="!isLastPage"
    >
      加载更多
    </button>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { GlobalDataProps } from '../store'
import PostList from '../components/PostList.vue'
export default defineComponent({
  name: 'ColumnDetail',
  components: {
    PostList
  },
  setup() {
    const store = useStore<GlobalDataProps>()
    const route = useRoute()
    const currentId = route.params.id

    const size = computed(() => store.state.postsSize)
    const totalPage = computed(() => store.state.posts.totalPage)
    const page = computed(() => store.state.posts.page)
    const loadedColumns = computed(() => store.state.posts.loadedColumns)

    onMounted(() => {
      store.dispatch('fetchColumn', currentId)

      if (!loadedColumns.value.includes(currentId)) {
        page.value = store.getters.initializePotsPage()
        store.dispatch('fetchPosts', { cid: currentId, size: size.value }).then((data) => {
          store.getters.getPotsTotalPage(Math.ceil(data.data.count / size.value))
        })
      }
    })

    const loadMorePage = () => {
      store.dispatch('fetchPosts', { cid: currentId, size: size.value }).then((data) => {
        store.getters.getPotsTotalPage(Math.ceil(data.data.count / size.value))
      })
    }

    const isLastPage = computed(() => {
      return page.value > totalPage.value
    })

    const column = computed(() => store.getters.getColumnById(currentId))
    const list = computed(() => store.getters.getPostsByCid(currentId))

    return {
      column,
      list,
      loadMorePage,
      isLastPage
    }
  }
})
</script>

<style scoped>
.JiaZaiBtn {
  display: flex;
  justify-content: center;
}
</style>
