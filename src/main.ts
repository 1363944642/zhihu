import { createApp } from 'vue'
import axios from 'axios'
import App from './App.vue'
import appRouter from './router'
import store from './store'

// 创建应用
const app = createApp(App)

// axiox
axios.defaults.baseURL = 'http://apis.imooc.com/api/'
// EF46985D7C85D229
// 57951175B9EC3618
// E47D035F540B0CD9
axios.interceptors.request.use(config => {
  config.params = { ...config.params, icode: 'EF46985D7C85D229' }
  config.data = { ...config.data, icode: 'EF46985D7C85D229' }
  // if (config.data instanceof FormData) {
  //   config.data.append('icode', 'EF46985D7C85D229')
  // } else {
  //   config.data = { ...config.data, icode: 'EF46985D7C85D229' }
  // }
  return config
})

axios.interceptors.request.use(config => {
  store.commit('setLoading', true)
  return config
})
axios.interceptors.response.use(config => {
  store.commit('setLoading', false)
  return config
})

// 应用路由
app.use(appRouter)

// 应用store
app.use(store)

// 挂载应用
app.mount('#app')
