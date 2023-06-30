<template>
  <div class="avatar" :style="{ width: width + 'px', height: width + 'px' }">
    <el-image
      :src="avatar && avatar != '' ? avatar : `${globalInfo.avatarUrl}${userId}?${timestamp}`"
      v-if="userId"
    ></el-image>
  </div>
</template>
<script setup>
const props = defineProps({
  userId: {
    type: String,
  },
  avatar: {
    type: String,
  },
  width: {
    type: Number,
    default: 40,
  },
  timestamp: {
    type: Number,
    default: 0,
  },
})
</script>
<style lang="scss" scoped>
.avatar {
  display: flex;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  img {
    width: 100%;
    object-fit: cover;
  }
}
</style>
