<template>
  <div class="sys-setting-panel">
    <el-form :model="formData" :rules="rules" ref="formDataRef" label-width="120px" @submit.prevent>
      <el-form-item label="注册邮箱标题" prop="registerEmailTitle">
        <el-input
          clearable
          placeholder="请输入注册邮件验证码标题"
          v-model.trim="formData.registerEmailTitle"
        ></el-input>
      </el-form-item>
      <el-form-item label="注册邮箱内容" prop="registerEmailContent">
        <el-input
          clearable
          placeholder="请输入注册邮件验证码内容"
          v-model.trim="formData.registerEmailContent"
        ></el-input>
      </el-form-item>
      <el-form-item label="初始空间大小" prop="userInitUseSpace">
        <el-input
          clearable
          placeholder="初始化空间大小"
          v-model.trim="formData.userInitUseSpace"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveSettings">按钮</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick, onMounted } from 'vue'
const { proxy } = getCurrentInstance()
const api = {
  getSysSettings: '/admin/getSysSettings',
  saveSysSettings: '/admin/saveSysSettings',
}
const formData = ref({})
const formDataRef = ref()
const rules = {
  registerEmailTitle: [{ required: true, message: '请输入注册邮件验证码标题' }],
  registerEmailContent: [{ required: true, message: '请输入注册邮件验证码内容' }],
  userInitUseSpace: [
    { required: true, message: '初始化空间大小' },
    { validator: proxy.Verify.number, message: '只能是数字' },
  ],
}
const getSysSettings = async () => {
  let result = await proxy.Request({
    url: api.getSysSettings,
  })
  if (!result) {
    return
  }
  formData.value = result.data
}
getSysSettings()
const saveSettings=async()=>{
  formDataRef.value.validate(async (valid) => {
     if (!valid) {
       return;
     }
     let params = {};
     Object.assign(params, formData.value);
     let result = await proxy.Request({
       url: api.saveSysSettings,
       params,
     });
     if (!result) {
       return;
     }
     proxy.Message.success('系统设置修改成功')
     getSysSettings()
  });
}
</script>

<style lang="scss" scoped>
.sys-setting-panel {
  margin-top: 20px;
  width: 600px;
}
</style>
