<template>
  <div>
    <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      width="600px"
      :showCancel="showCancel"
      @close="dialogConfig.show = false"
    >
      <el-form
        :model="formData"
        :rules="rules"
        ref="formDataRef"
        label-width="100px"
        @submit.prevent
      >
        <!--input输入-->
        <el-form-item label="文件名">
          {{ formData.fileName }}
        </el-form-item>
        <template v-if="showType == 0">
          <!-- 单选 -->
          <el-form-item label="有效期" prop="validType">
            <el-radio-group v-model="formData.validType">
              <el-radio :label="0">1天</el-radio>
              <el-radio :label="1">7天</el-radio>
              <el-radio :label="2">30天</el-radio>
              <el-radio :label="3">永久有效</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="提取码" prop="codeType">
            <el-radio-group v-model="formData.codeType">
              <el-radio :label="0">自定义</el-radio>
              <el-radio :label="1">系统生成</el-radio>
            </el-radio-group>
          </el-form-item>
          <!--input输入-->
          <el-form-item prop="code" v-if="formData.codeType == 0">
            <el-input
              clearable
              placeholder="请输入五位提取码"
              :maxLength="5"
              v-model.trim="formData.code"
              :style="{ width: '130px' }"
            ></el-input>
          </el-form-item>
        </template>
        <template v-else>
          <!--input输入-->
          <el-form-item label="分享链接"> {{ shareUrl }}{{ resultInfo.shareId }} </el-form-item>
          <el-form-item label="提取码">
            {{ resultInfo.code }}
          </el-form-item>
          <el-form-item label="提取码">
            <el-button type="primary" @click="copy">复制链接和提取码</el-button>
          </el-form-item>
        </template>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
// 复制
import useClipboard from 'vue-clipboard3'
const { toClipboard } = useClipboard()
import { ref, reactive, getCurrentInstance, nextTick } from 'vue'
const { proxy } = getCurrentInstance()
const shareUrl = ref(document.location.origin + '/share/')
const api = {
  shareFile: '/share/shareFile',
}
// 0分享表单，1分享结果
const showType = ref(0)
const formData = ref({})
const formDataRef = ref()
const rules = {
  validType: [{ required: true, message: '请选择有效器' }],
  codeType: [{ required: true, message: '请选择提取码类型' }],
  code: [
    { required: true, message: '请输入提取码' },
    { validator: proxy.Verify.shareCode, message: '请输入提取码' },
    { min: 5, message: '提取码为五位' },
  ],
}
const showCancel = ref(true)
const dialogConfig = ref({
  show: false,
  title: '分享',
  buttons: [
    {
      type: 'primary',
      text: '确定',
      click: (e) => {
        share()
      },
    },
  ],
})
const resultInfo = ref({})
const share = async () => {
  if (Object.keys(resultInfo.value).length > 0) {
    dialogConfig.value.show = false
  }
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return
    }
    let params = {}
    Object.assign(params, formData.value)
    let result = await proxy.Request({
      url: api.shareFile,
      params: params,
    })
    if (!result) {
      return
    }
    showType.value = 1
    resultInfo.value = result.data
    dialogConfig.value.buttons[0].text = '关闭'
    showCancel.value = false
  })
}
const show = (data) => {
  showType.value = 0
  dialogConfig.value.show = true
  dialogConfig.value.buttons[0].text = '确定'
  showCancel.value = true
  resultInfo.value = {}
  nextTick(() => {
    formDataRef.value.resetFields()
    formData.value = Object.assign({}, data)
  })
}
defineExpose({ show })
const copy = async () => {
  await toClipboard(
    `链接:${shareUrl.value}${resultInfo.value.shareId} 提取码:${resultInfo.value.code}`,
  )
  proxy.Message.success('复制成功')
}
</script>

<style lang="scss" scoped></style>
