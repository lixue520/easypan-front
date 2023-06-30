<template>
  <Dialog
    :show="dialogConfig.show"
    :title="dialogConfig.title"
    :buttons="dialogConfig.buttons"
    width="400px"
    :showCancel="false"
    @close="dialogConfig.show = false"
  >
    <el-form :model="formData" :rules="rules" ref="formDataRef" label-width="80px" @submit.prevent>
      <el-form-item label="新密码" prop="password">
        <el-input
          type="password"
          placeholder="请输入密码"
          v-model.trim="formData.password"
          show-password
        >
          <template #prefix>
            <span class="iconfont icon-passowrd"></span>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="rePassword">
        <el-input
          type="password"
          placeholder="请再次输入密码"
          v-model.trim="formData.rePassword"
          show-password
        >
          <template #prefix>
            <span class="iconfont icon-rePassword"></span>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from 'vue'
const { proxy } = getCurrentInstance()
const formData = ref({})
const formDataRef = ref()
const api = {
  updatePassword:'/updatePassword'
}
const checkRePassword = (rule, value, callback) => {
  if (value !== formData.value.password) {
    callback(new Error(rule.message))
  } else {
    callback()
  }
}
const rules = {
  password: [
    { required: true, message: '请输入密码' },
    { validator: proxy.Verify.password, message: '密码只能是数字,字母,特殊字符8-18位' },
  ],
  rePassword: [
    { required: true, message: '请再次输入密码' },
    { validator: checkRePassword, message: '两次输入的密码不一致' },
  ],
}
const dialogConfig = ref({
  show: false,
  title: '修改密码',
  buttons: [
    {
      type: 'danger',
      text: '确定',
      click: (e) => {
        submitForm()
      },
    },
  ],
})
const show = () => {
  dialogConfig.value.show = true
  nextTick(() => {
    formDataRef.value.resetFields()
    formData.value = {}
  })
}
defineExpose({ show })
const submitForm=()=>{
  formDataRef.value.validate(async (valid) => {
     if (!valid) {
       return;
     }
     let result = await proxy.Request({
       url: api.updatePassword,
       params:{
        password:formData.value.password
       },
     });
     if (!result) {
       return;
     }
     dialogConfig.value.show=false
     proxy.Message.success('密码修改成功')
  });
}
</script>

<style lang="scss" scoped></style>
