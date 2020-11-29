<template>
  <div class="container-fluid px-0 flex-shrink-0">
    <Golbal-header :user="currentUser"></Golbal-header>
    <!-- <Home></Home> -->
    <Login></Login>
  </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import GolbalHeader, { UserProps } from './components/GolbalHeader.vue'
// import Home from './views/Home.vue'
import Login from './views/Login.vue'

const currentUser: UserProps = {
  isLogin: true,
  name: 'mil'
}

export default defineComponent({
  name: 'App',
  components: {
    GolbalHeader,
    // Home,
    Login
  },

  setup() {
    return {
      currentUser,
      // Home
      Login
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
