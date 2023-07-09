<template>
  <div class="pdf">
    <vue-pdf-embed
      ref="pdfRef"
      :source="state.url"
      class="vue-pdf-embed"
      width="1000"
      :pages="state.pageNum"
    ></vue-pdf-embed>
  </div>
</template>

<script setup>
import VuePdfEmbed from 'vue-pdf-embed'
import { ref, reactive, getCurrentInstance, nextTick, onMounted } from 'vue'
const { proxy } = getCurrentInstance()
const props = defineProps({
  url: {
    type: String,
  },
})
const pdfRef = ref()
const state = ref({
  url: '',
  pageNum: 0,
  numPages: 0,
})
const initPdf = async () => {
  state.value.url = '/api' + props.url
}
onMounted(() => {
  initPdf()
})
</script>

<style lang="scss">
.pdf {
  width: 100%;
}
</style>
