import { createApp } from 'vue'
import axios from 'axios'
import App from './App.vue'
import appRouter from './router'
import store from './store'

// 创建应用
const app = createApp(App)

// axiox
axios.defaults.baseURL = 'http://apis.imooc.com/api/'

axios.interceptors.request.use(config => {
  config.params = { ...config.params, icode: 'EF46985D7C85D229' }
  return config
})

// 应用路由
app.use(appRouter)

// 应用store
app.use(store)

// 挂载应用
app.mount('#app')
