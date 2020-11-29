<template>
  <Golbal-header :user="currentUser"></Golbal-header>
  <div class="container">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import GolbalHeader, { UserProps } from './components/GolbalHeader.vue'

const currentUser: UserProps = {
  isLogin: true,
  name: 'mil'
}

export default defineComponent({
  name: 'App',
  components: {
    GolbalHeader
  },

  setup() {
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
