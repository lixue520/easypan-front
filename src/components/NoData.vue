<template>
  <div class="no-data">
    <div>
      <Icon iconName="no_data" :width="240" fit="fill"></Icon>
    </div>
    <div class="msg">{{ msg }}</div>
  </div>
</template>
<script setup>
const props=defineProps({
  msg:{
    type:String
  }
})
</script>
<style lang='scss'>
.no-data{
  padding: 10px 0;
  text-align: center;
  .icon-empty{
    font-size: 50px;
    color: #bbb;
  }
  .msg{
    color: #909399;
    font-size: 14px;
  }
}
</style>