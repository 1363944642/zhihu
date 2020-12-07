import { createApp } from 'vue'
import axios from 'axios'
import App from './App.vue'
import appRouter from './router'
import store from './store'

// 创建应用
const app = createApp(App)

// axiox
/**
 * 慕课网Icode配置
 */
// 替换 baseURL
axios.defaults.baseURL = 'http://apis.imooc.com/api/'
// EF46985D7C85D229
// 57951175B9EC3618
// E47D035F540B0CD9
axios.interceptors.request.use(config => {
  // git请求, icode添加到 url参数中
  config.params = { ...config.params, icode: 'EF46985D7C85D229' }
  // 其他请求, 添加到body中
  // 如果是上传文件,添加到FromData中
  if (config.data instanceof FormData) {
    config.data.append('icode', 'EF46985D7C85D229')
  } else {
    // 普通的body对象,添加到bata中
    config.data = { ...config.data, icode: 'EF46985D7C85D229' }
  }
  return config
})

axios.interceptors.request.use(config => {
  store.commit('setLoading', true)
  return config
})
axios.interceptors.response.use(config => {
  store.commit('setLoading', false)
  return config
}, e => {
  const { error } = e.response.data
  store.commit('setError', { status: true, message: error })
  store.commit('setLoading', false)
  return Promise.reject(error)
})

// 应用路由
app.use(appRouter)

// 应用store
app.use(store)

// 挂载应用
app.mount('#app')
