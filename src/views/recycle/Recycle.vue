<template>
  <div class="top">
    <el-button type="success" @click="actionType(0)"
      ><span class="iconfont icon-revert"></span>还原</el-button
    >
    <el-button type="danger" @click="actionType(1)">
      <span class="iconfont icon-del"></span>批量删除</el-button
    >
  </div>
  <div class="file-list">
    <Table
      ref="dataTableRef"
      :columns="columns"
      :dataSource="tableData"
      :fetch="loadDataList"
      :initFetch="true"
      :options="tableOptions"
      @rowSelected="rowSelected"
    >
      <template #fileName="{ index, row }">
        <div class="file-item" @mouseenter="showOp(row)" @mouseleave="cancelShowOp(row)">
          <template v-if="(row.fileType == 3 || row.fileType == 1) && row.status != 0">
            <Icon :cover="row.fileCover"></Icon>
          </template>
          <template v-else>
            <Icon v-if="row.folderType == 0" :fileType="row.fileType"></Icon>
            <Icon v-if="row.folderType == 1" :fileType="0"></Icon>
          </template>
          <span class="file-name" :title="row.fileName">{{ row.fileName }}</span>
          <span class="op">
            <template v-if="row.showOp">
              <span class="iconfont icon-revert" @click="revert(row)">还原</span>
              <span class="iconfont icon-del" @click="delFile(row)">删除</span>
            </template>
          </span>
        </div>
      </template>
      <template #fileSize="{ index, row }">
        <span v-if="row.fileSize">{{ Utils.sizeToStr(row.fileSize) }}</span>
      </template>
    </Table>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from 'vue'
const { proxy } = getCurrentInstance()
const api = {
  loadDataList: '/recycle/loadRecycleList',
  recoverFile: '/recycle/recoverFile',
  delFile: '/recycle/delFile',
}
const columns = [
  {
    label: '文件名',
    prop: 'fileName',
    scopedSlots: 'fileName',
  },
  {
    label: '删除时间',
    prop: 'recoveryTime',
    width: 200,
  },
  {
    label: '大小',
    prop: 'fileSize',
    width: 200,
    scopedSlots: 'fileSize',
  },
]
const tableData = ref({})
const dataTableRef = ref()
const tableOptions = ref({
  extHeight: 50,
  selectType: 'checkbox',
})
const loadDataList = async () => {
  let params = {
    pageNo: tableData.value.pageNo,
    pageSize: tableData.value.pageSize,
  }

  let result = await proxy.Request({
    url: api.loadDataList,
    showLoading: false,
    params: params,
  })
  if (!result) {
    return
  }
  tableData.value = result.data
}
const selectFileIdList = ref([])
const rowSelected = (rows) => {
  selectFileIdList.value = []
  rows.forEach((item) => {
    selectFileIdList.value.push(item.fileId)
  })
}
const showOp = (row) => {
  tableData.value.list.forEach((item) => {
    item.showOp = false
  })
  row.showOp = true
}
const cancelShowOp = (row) => {
  row.showOp = false
}
const emit = defineEmits(['reload'])
const revert = (row) => {
  proxy.Confirm(`你确定要还原【${row.fileName}】文件吗`, async () => {
    let result = await proxy.Request({
      url: api.recoverFile,
      params: {
        fileIds: row.fileId,
      },
    })
    if (!result) {
      return
    }
    emit('reload')
    proxy.Message.success(`${row.fileName}文件还原成功`)
    loadDataList()
  })
}
const delFile = (row) => {
  proxy.Confirm(`你确定要彻底删除【${row.fileName}】文件吗`, async () => {
    let result = await proxy.Request({
      url: api.delFile,
      params: {
        fileIds: row.fileId,
      },
    })
    if (!result) {
      return
    }
    emit('reload')
    proxy.Message.success(`${row.fileName}文件已彻底删除`)
    loadDataList()
  })
}
// type 0表示还原，1表示彻底删除
const actionType = (type) => {
  proxy.Confirm(`你确定要${type == 0 ? '还原' : '彻底删除'}这些文件吗`, async () => {
    let url = null
    if (type == 0) {
      url = api.delFile
    } else {
      url = api.recoverFile
    }
    let result = await proxy.Request({
      url: url,
      params: {
        fileIds: selectFileIdList.value.join(),
      },
    })
    if (!result) {
      return
    }
    emit('reload')
    if (type == 0) {
      proxy.Message.success(`这些文件已还原成功`)
    } else {
      proxy.Message.success(`这些文件已彻底删除`)
    }
    loadDataList()
  })
}
</script>

<style lang="scss" scoped>
@import '@/assets/file.list.scss';
.file-list {
  margin-top: 10px;
  .file-item {
    .op {
      width: 120px;
    }
  }
}
</style>
