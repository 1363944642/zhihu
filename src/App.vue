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

import { computed, defineComponent, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import GolbalHeader from './components/GolbalHeader.vue'
import Loader from './components/Loader.vue'
import createMessage from './components/createMessage'
import { GlobalDataProps } from './store'

export default defineComponent({
  name: 'App',
  components: {
    GolbalHeader,
    Loader
  },

  setup() {
    const store = useStore<GlobalDataProps>()
    const currentUser = computed(() => store.state.user)
    const isLoading = computed(() => store.state.loading)
    const token = computed(() => store.state.token)
    const error = computed(() => store.state.error)
    onMounted(() => {
      if (!currentUser.value.isLogin && token.value) {
        axios.defaults.headers.common.Authorization = `Bearer ${token.value}`
        store.dispatch('fetchCurrentUser')
      }
    })
    watch(() => error.value.status, () => {
      const { status, message } = error.value
      if (status && message) {
        createMessage(message, 'error')
      }
    })
    return {
      currentUser,
      isLoading,
      error
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
