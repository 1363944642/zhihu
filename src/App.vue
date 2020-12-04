<template>
  <Golbal-header :user="currentUser"></Golbal-header>
  <Loader
    v-if="isLoading"
    text="加载中..."
    background="rgba(0,0,0,0.8)"
  ></Loader>
  <div class="container">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">

import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import 'bootstrap/dist/css/bootstrap.min.css'
import GolbalHeader from './components/GolbalHeader.vue'
import Loader from './components/Loader.vue'

export default defineComponent({
  name: 'App',
  components: {
    GolbalHeader,
    Loader
  },

  setup() {
    const store = useStore()
    const currentUser = computed(() => store.state.user)
    const isLoading = computed(() => store.state.loading)
    return {
      currentUser,
      isLoading
    }
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
