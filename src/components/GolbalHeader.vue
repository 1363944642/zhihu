<template>
  <nav class="navbar navbar-dark bg-primary justify-content-between mb-4 px-4">
    <div class="w-75 mx-auto navbar">
      <router-link to="/" class="navbar-brand" href="#">知乎专栏</router-link>
      <ul v-if="!user.isLogin" class="list-inline mb-0">
        <li class="list-inline-item">
          <router-link to="/Login" class="btn btn-outline-light my-2"
            >登陆</router-link
          >
        </li>
        <li class="list-inline-item">
          <a href="#" class="btn btn-outline-light my-2">注册</a>
        </li>
      </ul>
      <ul v-else class="list-inline mb-0">
        <li class="list-inline-item">
          <dropdown :title="`你好 ${user.nickName}`">
            <dropdown-item>
              <router-link to="/create" class="dropdown-item">
                新建文章
              </router-link>
            </dropdown-item>
            <dropdown-item>
              <router-link :to="`/column/${user.column}`" class="dropdown-item">
                我的专栏
              </router-link>
            </dropdown-item>
            <dropdown-item>
              <a href="#" class="dropdown-item">编辑资料</a>
            </dropdown-item>
            <dropdown-item @click="logout">
              <a href="#" class="dropdown-item">退出登陆</a>
            </dropdown-item>
          </dropdown>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import Dropdown from './Driodown.vue'
import DropdownItem from './DropdownItem.vue'
import { useStore } from 'vuex'
import { UserProps } from '../store'
import { useRouter } from 'vue-router'
import createMessage from '../components/createMessage'

export default defineComponent({
  name: 'GolbalHeader',
  components: {
    Dropdown,
    DropdownItem
  },
  props: {
    user: {
      type: Object as PropType<UserProps>,
      required: true
    }
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const logout = () => {
      store.commit('logout')
      createMessage('退出成功 2秒后跳转首页', 'success')
      setTimeout(() => {
        router.push('/')
      }, 2000)
    }
    return {
      logout
    }
  }
})
</script>

<style scoped>
</style>
