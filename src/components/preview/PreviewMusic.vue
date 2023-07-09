<template>
  <div class="music">
    <div class="body-content">
      <div class="cover">
        <img src="@/assets/icon-image/music.png" />
      </div>
      <div ref="playerRef" class="music-player"></div>
    </div>
  </div>
</template>

<script setup>
import APlayer from 'aplayer'
import 'Aplayer/dist/Aplayer.min.css'
import { ref, reactive, getCurrentInstance, nextTick, onMounted, onUnmounted } from 'vue'
import { read } from 'xlsx'
const { proxy } = getCurrentInstance()
const props = defineProps({
  url: {
    type: String,
  },
  fileName: {
    type: String,
  },
})
const playerRef = ref()
const player = ref({})

onMounted(() => {
  player.value = new APlayer({
    container: playerRef.value,
    audio: {
      url: `/api/${props.url}`,
      name: props.fileName,
      cover: new URL('@/assets/icon-image/music.png', import.meta.url).href,
    },
  })
})

onUnmounted(() => {
  player.value.destroy()
})
</script>

<style lang="scss" scoped>
.music {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  .body-content{
    text-align: center;
    width: 80%;
    .cover{
      margin: 0 auto;
      width: 200px;
      text-align: center;
      img{
        width: 100%;
      }
    }
    .music-player{
      margin-top: 20px;
    }
  }
}
</style>
