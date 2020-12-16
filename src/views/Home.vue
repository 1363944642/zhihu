<template>
  <div class="home-page">
    <section class="py-5 text-center container">
      <div class="row py-lg-5">
        <div class="col-lg-6 col-md-8 mx-auto">
          <img src="../assets/callout.svg" alt="callout" class="w-50" />
          <h2 class="font-weight-light">随心写作，自由表达</h2>
          <p>
            <router-link to="/create" class="btn btn-primary my-2"
              >开始写文章</router-link
            >
          </p>
        </div>
      </div>
    </section>
    <h4 class="font-weight-bold text-center">发现精彩</h4>
    <ColumnList :list="list"></ColumnList>
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
import { defineComponent, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '../store'
import ColumnList from '../components/ColumnList.vue'

export default defineComponent({
  name: 'Home',
  components: {
    ColumnList
  },
  setup() {
    const store = useStore<GlobalDataProps>()

    const size = computed(() => store.state.ColumnsSize)

    const totalPage = computed(() => store.state.columns.totalPage)

    const page = computed(() => store.state.columns.page)

    const isLoaded = computed(() => store.state.columns.isLoaded)

    onMounted(() => {
      if (isLoaded.value) {
        store.dispatch('fetchColumns', { size: size.value, isLoaded: isLoaded.value }).then(
          (data) => {
            store.getters.getColumnTotalPage(Math.ceil(data.data.count / size.value))
          }
        )
      }
    })

    const loadMorePage = () => {
      store.dispatch('fetchColumns', { size: size.value, isLoaded: true }).then(
        (data) => {
          totalPage.value = Math.ceil(data.data.count / size.value)
        }
      )
    }

    const isLastPage = computed(() => {
      return page.value > totalPage.value
    })

    const list = computed(() => store.state.columns.data)
    return {
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
