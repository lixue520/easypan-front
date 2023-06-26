import { createRouter, createWebHistory } from 'vue-router'
import VueCookies from 'vue-cookies'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
    }, {
      path: '/qqlogincallback',
      name: 'qq登陆回调',
      component: () => import('@/views/QqLoginCallback.vue'),
    }, {
      path: '/',
      name: 'layout',
      component: () => import('@/views/Layout.vue'),
    }
  ]
})
router.beforeEach((to, from, next) => {
  const userInfo = VueCookies.get('userInfo')
  if (to.meta.needLogin != null && to.meta.needLogin && userInfo == null){
    router.push('/login')
  }
  next()
})
export default router
