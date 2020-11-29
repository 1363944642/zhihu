import { createApp } from 'vue'
import App from './App.vue'
import appRouter from './router'

// 创建应用
const app = createApp(App)

// 应用路由
app.use(appRouter)

// 挂载应用
app.mount('#app')
