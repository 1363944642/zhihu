<template>
  <Golbal-header :user="currentUser"></Golbal-header>
  <h1 v-if="isLoading">loading....Ovo!!!</h1>
  <div class="container">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">

import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import 'bootstrap/dist/css/bootstrap.min.css'
import GolbalHeader from './components/GolbalHeader.vue'

export default defineComponent({
  name: 'App',
  components: {
    GolbalHeader
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
