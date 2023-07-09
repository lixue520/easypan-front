<template>
  <PreviewImage
    ref="imageViewRef"
    :imageList="[imageUrl]"
    v-if="fileInfo.fileCategory == 3"
  ></PreviewImage>
  <Window
    v-else
    :show="windowShow"
    @close="closeWindow"
    :width="fileInfo.fileCategory == 1 ? 1500 : 1000"
    :title="fileInfo.fileName"
    :align="fileInfo.fileCategory == 1 ? 'center' : 'top'"
  >
    <PreviewVideo :url="url" v-if="fileInfo.fileCategory == 1"></PreviewVideo>
    <PreviewDoc :url="url" v-if="fileInfo.fileType == 5"></PreviewDoc>
    <PreviewExcel :url="url" v-if="fileInfo.fileType == 6"></PreviewExcel>
  </Window>
</template>

<script setup>
import PreviewExcel from './PreviewExcel.vue';
import PreviewDoc from './PreviewDoc.vue';
import PreviewVideo from './PreviewVideo.vue'
import PreviewImage from './PreviewImage.vue'
import { ref, reactive, getCurrentInstance, nextTick, computed } from 'vue'
const { proxy } = getCurrentInstance()
const imageUrl = computed(() => {
  // 图片压缩失败所以无法显示小图，大图没问图
  return proxy.globalInfo.imageUrl + fileInfo.value.fileCover.replace('_.', '.')
})
const windowShow = ref(false)
const closeWindow = () => {
  windowShow.value = false
}
const FILE_URL_MAP = {
  0: {
    fileUrl: '/file/getFile',
    videoUrl: '/file/ts/getVideoInfo',
    createDownloadUrl: '/file/createDownloadUrl',
    downloadUrl: '/api/file/download',
  },
  1: {
    fileUrl: '/admin/getFile',
    videoUrl: '/admin/ts/getVideoInfo',
    createDownloadUrl: '/admin/createDownloadUrl',
    downloadUrl: '/api/admin/download',
  },
  1: {
    fileUrl: '/showShare/getFile',
    videoUrl: '/showShare/ts/getVideoInfo',
    createDownloadUrl: '/showShare/createDownloadUrl',
    downloadUrl: '/api/showShare/download',
  },
}
const url = ref(null)
const fileInfo = ref({})
const imageViewRef = ref()
const showPreview = (data, showPart) => {
  fileInfo.value = data
  if (data.fileCategory == 3) {
    nextTick(() => {
      imageViewRef.value.show(0)
    })
  } else {
    windowShow.value = true
    let _url = FILE_URL_MAP[showPart].fileUrl
    if (data.fileCategory == 1) {
      _url = FILE_URL_MAP[showPart].videoUrl
    }
    if (showPart == 0) {
      _url = _url + '/' + data.fileId
    }
    url.value=_url
  }
}
defineExpose({ showPreview })
</script>

<style lang="scss" scoped></style>
