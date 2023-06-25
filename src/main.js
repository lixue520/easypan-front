import { createApp } from 'vue'
import App from './App.vue'
// 全局导入组件库
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
// 图标库
import '@/assets/icon/iconfont.css'
import '@/assets/base.scss'
// 引入cookie
import VueCookies from 'vue-cookies'
const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.use(VueCookies)
app.mount('#app')
