<template>
  <div v-html="excelContent" class="table-info"></div>
</template>

<script setup>
import * as XLSX from 'xlsx'
import { ref, reactive, getCurrentInstance, nextTick, onMounted } from 'vue'
const { proxy } = getCurrentInstance()
const props = defineProps({
  url: {
    type: String,
  },
})
const excelContent = ref()
const initExcel = async () => {
  let result = await proxy.Request({
    url: props.url,
    responseType: 'arraybuffer',
  })
  if (!result) {
    return
  }
  let workbook = XLSX.read(new Uint8Array(result), { type: 'array' })
  let worksheet =workbook.Sheets[workbook.SheetNames[0]]
  excelContent.value=XLSX.utils.sheet_to_html(worksheet)
}
onMounted(() => {
  initExcel()
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
