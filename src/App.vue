<template>
  <Golbal-header :user="currentUser"></Golbal-header>
  <div class="container">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">

import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import 'bootstrap/dist/css/bootstrap.min.css'
import GolbalHeader, { UserProps } from './components/GolbalHeader.vue'

export default defineComponent({
  name: 'App',
  components: {
    GolbalHeader
  },

  setup() {
    const store = useStore()
    const currentUser = computed(() => store.state.user)
    return {
      currentUser
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
