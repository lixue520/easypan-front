<template>
  <div>
    <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      width="400px"
      :showCancel="false"
      @close="dialogConfig.show = false"
    >
      <el-form :model="formData" ref="formDataRef" label-width="80px" @submit.prevent>
        <el-form-item label="昵称">
          {{ formData.nickName }}
        </el-form-item>
        <el-form-item label="头像">
          <AvatarUpload v-model="formData.avatar"></AvatarUpload>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import AvatarUpload from '../components/AvatarUpload.vue'
import { ref, reactive, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const { proxy } = getCurrentInstance()
const route = useRoute()
const router = useRouter()
const api = {
  updateUserAvatar: '/updateUserAvatar',
}
const formData = ref({})
const formDataRef = ref()
const show = (data) => {
  formData.value = Object.assign({}, data)
  formData.value.avatar = { userId: data.userId, qqAvatar: data.avatar }
  dialogConfig.value.show = true
}
defineExpose({ show })
const dialogConfig = ref({
  show: false,
  title: '修改头像',
  buttons: [
    {
      type: 'primary',
      text: '确定',
      click: (e) => {
        submitForm()
      },
    },
  ],
})
const emit = defineEmits()
const submitForm = async () => {
  if (!(formData.value.avatar instanceof File)) {
    dialogConfig.value.show = false
    return
  }
  let result = await proxy.Request({
    url: api.updateUserAvatar,
    params: {
      avatar: formData.value.avatar,
    },
  })
  if (!result) {
    return
  }
  dialogConfig.value.show = false
  const cookieUserInfo = proxy.VueCookies.get('userInfo')
  delete cookieUserInfo.avatar
  proxy.VueCookies.set('userInfo', cookieUserInfo, 0)
  emit('updateAvatar')
}
</script>

<style lang="scss" scoped></style>
