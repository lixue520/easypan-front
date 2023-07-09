<template>
  <div ref="docRef" class="doc-content"></div>
</template>

<script setup>
import * as docx from 'docx-preview'
import { ref, reactive, getCurrentInstance, nextTick, onMounted } from 'vue'
const { proxy } = getCurrentInstance()
const props = defineProps({
  url: {
    type: String,
  },
})
const docRef = ref()
const initDoc = async () => {
  let result = await proxy.Request({
    url: props.url,
    responseType: 'blob',
  })
  if (!result) {
    return
  }
  docx.renderAsync(result, docRef.value)
}
onMounted(() => {
  initDoc()
})
</script>

<style lang="scss">
.doc-content {
  margin: 0px auto;
  .docx-wrapper {
    background-color: #fff;
    padding: 10px 0px;
  }
  .docx-wrapper > section.docx {
    margin-bottom: 0px;
  }
}
</style>
