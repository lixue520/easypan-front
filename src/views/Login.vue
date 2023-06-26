<template>
  <div class="login-body">
    <div class="bg"></div>
    <div class="login-panel">
      <el-form
        class="login-register"
        :model="formData"
        :rules="rules"
        ref="formDataRef"
        @submit.prevent
      >
        <div class="login-title">EasyPan</div>
        <!--邮箱-->
        <el-form-item prop="email">
          <el-input size="large" clearable placeholder="请输入邮箱" v-model.trim="formData.email">
            <template #prefix>
              <span class="iconfont icon-account"></span>
            </template>
          </el-input>
        </el-form-item>
        <!-- 登陆密码 -->
        <el-form-item prop="password" v-if="opType == 1">
          <el-input
            type="password"
            placeholder="请输入密码"
            size="large"
            show-password
            v-model.trim="formData.password"
          >
            <template #prefix>
              <span class="iconfont icon-password"></span>
            </template>
          </el-input>
        </el-form-item>
        <!-- 注册 -->
        <div v-if="opType == 0 || opType == 2">
          <el-form-item prop="emailCode">
            <div class="send-email-panel">
              <el-input
                size="large"
                placeholder="请输入邮箱验证码"
                v-model.trim="formData.emailCode"
              >
                <template #prefix>
                  <span class="iconfont icon-checkcode"></span>
                </template>
              </el-input>
              <el-button class="send-mail-btn" type="primary" size="large" @click="getEmailCode"
                >获取验证码</el-button
              >
            </div>
            <el-popover placement="left" :width="500" trigger="click">
              <div>
                <p>1：在垃圾箱里查找邮箱验证码</p>
                <p>2：在邮箱中设置头像=>设置->反垃圾=>白名单=>设置邮箱白名单</p>
                <p>3：将邮箱【laoluo@wuhancoder.com】加入白名单</p>
                <a href="http://easybbs.wuhancoder.com/post/46lrsLUQjQhpZyP" class="a-link"
                  >不知道怎么设置 ？</a
                >
              </div>
              <template #reference>
                <span class="a-link" :style="{ 'font-size': '14px' }">未收到邮箱验证码 ？</span>
              </template>
            </el-popover>
          </el-form-item>
          <!--昵称-->
          <el-form-item prop="nickName" v-if="opType == 0">
            <el-input
              size="large"
              clearable
              placeholder="请输入昵称"
              v-model.trim="formData.nickName"
              maxLength="20"
            >
              <template #prefix>
                <span class="iconfont icon-account"></span>
              </template>
            </el-input>
          </el-form-item>
          <!-- 注册密码，找回密码 -->
          <el-form-item prop="registerPassword">
            <el-input
              type="password"
              placeholder="请输入密码"
              v-model.trim="formData.registerPassword"
              show-password
            >
              <template #prefix>
                <span class="iconfont icon-password"></span>
              </template>
            </el-input>
          </el-form-item>
          <!-- 重复密码 -->
          <el-form-item prop="reRegisterPassword">
            <el-input
              type="password"
              placeholder="请再次输入密码"
              v-model.trim="formData.reRegisterPassword"
              show-password
            >
              <template #prefix>
                <span class="iconfont icon-password"></span>
              </template>
            </el-input>
          </el-form-item>
        </div>
        <!-- 验证码 -->
        <el-form-item prop="checkCode">
          <div class="check-code-panel">
            <el-input
              clearable
              placeholder="请输入验证码"
              v-model.trim="formData.checkCode"
              @keyup.enter="doSubmit"
            >
              <template #prefix>
                <span class="iconfont icon-checkcode"></span>
              </template>
            </el-input>
            <img :src="checkCodeUrl" class="check-code" @click="changeCheckCode(0)" />
          </div>
        </el-form-item>
        <el-form-item v-if="opType == 1">
          <div class="rememberme-panel">
            <el-checkbox v-model="formData.rememberMe">记住我</el-checkbox>
          </div>
          <div class="no-account">
            <a href="Javascript:void(0)" class="a-link" @click="showPanel(2)">忘记密码?</a>
            <a href="javascript:void(0)" class="a-link" @click="showPanel(0)">注册账号?</a>
          </div>
        </el-form-item>
        <el-form-item v-if="opType == 2">
          <a href="javascript:void(0)" class="a-link" @click="showPanel(1)">去登陆?</a>
        </el-form-item>
        <el-form-item v-if="opType == 0">
          <a href="javascript:void(0)" class="a-link" @click="showPanel(1)">已有账号？</a>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="op-btn" size="large" @click="doSubmit">
            <span v-if="opType == 1">登陆</span>
            <span v-if="opType == 0">注册</span>
            <span v-if="opType == 2">重置密码</span>
          </el-button>
        </el-form-item>
        <div class="login-btn-qq" v-if="opType==1">
          快捷登陆<img src="@/assets/QQ.jpg" @click="qqlogin">
        </div>
      </el-form>
    </div>
    <Dialog
      :show="dialogConfig4SendMailCode.show"
      :title="dialogConfig4SendMailCode.title"
      :buttons="dialogConfig4SendMailCode.buttons"
      width="500px"
      :showCancel="false"
      @close="dialogConfig4SendMailCode.show = false"
    >
      <el-form
        :model="formData4SendMailCode"
        :rules="rules"
        ref="formData4SendMailCodeRef"
        label-width="80px"
        @submit.prevent
      >
        <el-form-item label="邮箱">
          {{ formData.email }}
        </el-form-item>
        <el-form-item label="验证码" prop="checkCode">
          <div class="check-code-panel">
            <el-input
              clearable
              placeholder="请输入验证码"
              v-model.trim="formData4SendMailCode.checkCode"
            >
              <template #prefix>
                <span class="iconfont icon-checkcode"></span>
              </template>
            </el-input>
            <img :src="checkCodeUrl4SendMailCode" class="check-code" @click="changeCheckCode(1)" />
          </div>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import md5 from 'js-md5'
const { proxy } = getCurrentInstance()
const route = useRoute()
const router = useRouter()
const api = {
  checkCode: '/api/checkCode',
  sendEmailCode: '/sendEmailCode',
  register: '/register',
  login: '/login',
  resetPwd: '/resetPwd',
  qqlogin: '/qqlogin',
}
// 操作类型 0注册1登陆2重置密码
const opType = ref(1)
const showPanel = (type) => {
  opType.value = type
  resetForm()
}
onMounted(() => {
  showPanel(1)
})
const formData = ref({})
const formDataRef = ref()
const checkRePassword = (rule, value, callback) => {
  if (value !== formData.value.registerPassword) {
    callback(new Error(rule.message))
  } else {
    callback()
  }
}
const rules = {
  email: [
    { required: true, message: '请输入邮箱' },
    { validator: proxy.Verify.email, message: '请输入正确的邮箱' },
  ],
  password: [{ required: true, message: '请输入密码' }],
  emailCode: [{ required: true, message: '请输入邮箱验证码' }],
  nickName: [{ required: true, message: '请输入昵称' }],
  registerPassword: [
    { required: true, message: '请输入密码' },
    { validator: proxy.Verify.password, message: '密码只能是数字,字母,特殊字符8-18位' },
  ],
  reRegisterPassword: [
    { required: true, message: '请再次输入密码' },
    { validator: checkRePassword, message: '两次输入的密码不一致' },
  ],
  checkCode: [{ required: true, message: '请输入图片验证码' }],
}
const checkCodeUrl = ref(api.checkCode)
const checkCodeUrl4SendMailCode = ref(api.checkCode)
const changeCheckCode = (type) => {
  if (type == 0) {
    checkCodeUrl.value = api.checkCode + '?type=' + type + '&time' + new Date().getTime()
  } else {
    checkCodeUrl4SendMailCode.value =
      api.checkCode + '?type=' + type + '&time' + new Date().getTime()
  }
}

// 发送邮箱验证码
const formData4SendMailCode = ref({})
const formData4SendMailCodeRef = ref()
const dialogConfig4SendMailCode = reactive({
  show: false,
  title: '发送邮箱验证码',
  buttons: [
    {
      type: 'primary',
      text: '发送验证码',
      click: (e) => {
        sendEmailCode()
      },
    },
  ],
})
const getEmailCode = () => {
  formDataRef.value.validateField('email', (valid) => {
    if (!valid) {
      return
    }
    dialogConfig4SendMailCode.show = true
    nextTick(() => {
      changeCheckCode(1)
      formData4SendMailCodeRef.value.resetFields()
      formData4SendMailCode.value = {
        email: formData.value.email,
      }
    })
  })
}
// 发送邮箱验证码
const sendEmailCode = () => {
  formData4SendMailCodeRef.value.validate(async (valid) => {
    if (!valid) {
      return
    }
    const params = Object.assign({}, formData4SendMailCode.value)
    params.type = opType.value == 0 ? 0 : 1
    let result = await proxy.Request({
      url: api.sendEmailCode,
      params: params,
      errorCallback: () => {
        changeCheckCode(1)
      },
    })
    if (!result) {
      return
    }
    proxy.Message.success('验证码发送成功，请登陆邮箱查看')
    dialogConfig4SendMailCode.show = false
  })
}

// 重置表单
const resetForm = () => {
  changeCheckCode(0)
  formDataRef.value.resetFields()
  formData.value = {}
  // 登陆
  if (opType.value == 1) {
    const cookieLoginInfo = proxy.VueCookies.get('loginInfo')
    if (cookieLoginInfo) {
      formData.value = cookieLoginInfo
    }
  }
}
// 登陆,注册,重置密码
const doSubmit = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return
    }
    let params = {}
    Object.assign(params, formData.value)
    // 注册找回密码
    if (opType.value == 0 || opType.value == 2) {
      params.password = params.registerPassword
      delete params.registerPassword
      delete params.reRegisterPassword
    }
    // 登陆
    if (opType.value == 1) {
      let cookieLoginInfo = proxy.VueCookies.get('loginInfo')
      let cookiePassword = cookieLoginInfo == null ? null : cookieLoginInfo.password
      if (params.password !== cookiePassword) {
        params.password = md5(params.password)
      }
    }
    let url = null
    if (opType.value == 0) {
      url = api.register
    } else if (opType.value == 1) {
      url = api.login
    } else if (opType.value == 2) {
      url = api.resetPwd
    }
    let result = await proxy.Request({
      url: url,
      params: params,
      errorCallback: () => {
        changeCheckCode(0)
      },
    })
    if (!result) {
      return
    }
    if (opType.value == 0) {
      proxy.Message.success('注册成功，请登陆')
      showPanel(1)
    } else if (opType.value == 1) {
      if (params.rememberMe) {
        const loginInfo = {
          email: params.email,
          password: params.password,
          rememberMe: params.rememberMe,
        }
        proxy.VueCookies.set('loginInfo', loginInfo, '7d')
      } else {
        proxy.VueCookies.remove('loginInfo')
      }
      proxy.Message.success('登陆成功')
      // 存储cookie
      proxy.VueCookies.set('userInfo', result.data, 0)
      // 重定行到原始页面
      const redirectUrl = route.query.redirectUrl || '/'
      router.push(redirectUrl)
    } else if (opType.value == 2) {
      proxy.Message.success('密码修改成功，请登陆')
      showPanel(1)
    }
  })
}
const qqlogin=async()=>{
  let result =await proxy.Request({
    url:api.qqlogin,
    params:{
      callbackUrl:route.query.redirectUrl || ''
    }
  })
  if(!result){
    return
  }
  proxy.VueCookies.remove('userInfo')
  document.location.href=result.data
}
</script>

<style lang="scss">
.login-body {
  height: calc(100vh);
  background-size: cover;
  background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
  display: flex;
  .bg {
    flex: 1;
    background-size: cover;
    background-position: center;
    background-size: 600px;
    background-repeat: no-repeat;
    background-image: url(../assets/login_bg.png);
  }
  .login-panel {
    width: 430px;
    margin-right: 15%;
    margin-top: calc((100vh - 500px) / 2);
    .login-register {
      padding: 25px;
      background: #fff;
      border-radius: 5px;
      .login-title {
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 20px;
      }
      .send-email-panel {
        display: flex;
        width: 100%;
        justify-content: space-between;
        .send-mail-btn {
          margin-left: 5px;
        }
      }
      .rememberme-panel {
        width: 100%;
      }
      .no-account {
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
      .op-btn {
        width: 100%;
      }
    }
  }
  .check-code-panel {
    width: 100%;
    display: flex;
    .check-code {
      margin-left: 5px;
      cursor: pointer;
    }
  }
  .login-btn-qq {
    margin-top: 20px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      cursor: pointer;
      margin-left: 10px;
      width: 20px;
    }
  }
}
</style>
