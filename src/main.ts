import { createApp } from 'vue'
import App from './App.vue'
import appRouter from './router'
import store from './store'

// 创建应用
const app = createApp(App)

// 应用路由
app.use(appRouter)

// 应用store
app.use(store)

// 挂载应用
app.mount('#app')
