<template>
  <div>登陆中请勿刷新页面</div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance ,onMounted} from 'vue'
import { useRoute, useRouter } from 'vue-router'
const { proxy } = getCurrentInstance()
const route = useRoute()
const router = useRouter()
const api ={
  logincallback:"/qqlogin/callback"
}
const login =async()=>{
  let result =await proxy.Request({
    url:api.logincallback,
    params:router.currentRoute.value.query,
    errorCallback:()=>{
      router.push('/')
    }
  })
  if(!result){
    return
  }
  let redirectUrl =result.data.errorCallback || '/'
  if(redirectUrl=='/login'){
    redirectUrl='/'
  }
  proxy.VueCookies.set('userInfo',result.data.userInfo,0)
  router.push(redirectUrl)
}
onMounted(()=>{
  login()
})
</script>

<style lang="scss">
</style>
