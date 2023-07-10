<template>
  <div class="top">
    <el-button type="primary" :disabled="selectShareIdList == 0" @click="cancelShareBatch">
      <span class="iconfont icon-cancel"></span>取消分享
    </el-button>
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
              <span class="iconfont icon-link" @click="copy(row)">复制链接</span>
              <span class="iconfont icon-cancel" @click="cancelShare(row)">取消分享</span>
            </template>
          </span>
        </div>
      </template>
    </Table>
  </div>
</template>

<script setup>
import useClipboard from 'vue-clipboard3'
const { toClipboard } = useClipboard()
import { ref, reactive, getCurrentInstance, nextTick } from 'vue'
const { proxy } = getCurrentInstance()
const api = {
  loadDataList: '/share/loadShareList',
  cancelShare: '/share/cancelShare',
}
const columns = [
  {
    label: '文件名',
    prop: 'fileName',
    scopedSlots: 'fileName',
  },
  {
    label: '分享时间',
    prop: 'shareTime',
    width: 200,
  },
  {
    label: '失效时间',
    prop: 'expireTime',
    width: 200,
  },
  {
    label: '浏览次数',
    prop: 'showCount',
    width: 200,
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
  if (params.category != 'all') {
    delete params.filePid
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
// 多选
const selectShareIdList = ref([])
const rowSelected = (rows) => {
  selectShareIdList.value = []
  rows.forEach((item) => {
    selectShareIdList.value.push(item.shareId)
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

const shareUrl = ref(document.location.origin + '/share/')
const copy = async (row) => {
  await toClipboard(`链接:${shareUrl.value}${row.shareId} 提取码:${row.code}`)
  proxy.Message.success('复制成功')
}
// 取消分享
const cancelShareIdList = ref([])
const cancelShareBatch = () => {
  if (selectShareIdList.value.length == 0) {
    return
  }
  cancelShareIdList.value = selectShareIdList.value
  cancelShareDone()
}
const cancelShare = (row) => {
  cancelShareIdList.value = [row.shareId]
  cancelShareDone()
}
const cancelShareDone = () => {
  proxy.Confirm('你确定要取消分享吗?', async () => {
    let result = await proxy.Request({
      url: api.cancelShare,
      params: {
        shareIds: cancelShareIdList.value.join(),
      },
    })
    if (!result) {
      return
    }
    proxy.Message.success('取消分享成功')
    loadDataList()
  })
}
</script>

<style lang="scss" scoped>
@import '@/assets/file.list.scss';
.file-list {
  margin-top: 10px;
  .file-item {
    .file-name {
      span {
        &:hover {
          color: #494944;
        }
      }
    }
    .op {
      width: 170px;
    }
  }
}
</style>
