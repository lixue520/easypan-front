<template>
  <div class="share">
    <div class="header">
      <div class="header-content">
        <div class="logo" @click="jump">
          <span class="iconfont icon-pan"></span>
          <span class="name">Easy云盘</span>
        </div>
      </div>
    </div>
  </div>
  <div class="share-body">
    <template v-if="Object.keys(shareInfo).length == 0">
      <div class="loading" v-if="Object.keys(shareInfo).length == 0"></div>
    </template>
    <template v-else>
      <div class="share-panel">
        <div class="share-user-info">
          <div class="avatar">
            <Avatar :userId="shareInfo.userId" :avatar="shareInfo.avatar" :width="50"></Avatar>
          </div>
          <div class="share-info">
            <div class="user-info">
              <div class="nick-name">{{ shareInfo.nickName }}</div>
              <div class="share-time">分享于：{{ shareInfo.shareTime }}</div>
            </div>
            <div class="file-name">分享文件：{{ shareInfo.fileName }}</div>
          </div>
        </div>
        <div class="share-op-btn">
          <el-button type="primary" @click="cancelShare(row)" v-if="shareInfo.currentUser">
            <span class="iconfont icon-cancel"></span>
            取消分享
          </el-button>
          <el-button
            type="primary"
            @click="saveToMyPan(row)"
            v-else
            :disabled="selectIdList.length == 0"
          >
            <span class="iconfont icon-import"></span>
            保存到我的网盘
          </el-button>
        </div>
      </div>
      <Navigation ref="navigationRef" @navChange="navChange" :shareId="shareId"></Navigation>
      <div class="file-list">
        <Table
          ref="dataTableRef"
          :columns="columns"
          :dataSource="tableData"
          :fetch="loadDataList"
          :initFetch="false"
          :options="tableOptions"
          @rowSelected="rowSelected"
        >
          <template #fileName="{ index, row }">
            <div class="file-item" @mouseenter="showOp(row)" @mouseleave="cancelShowOp(row)">
              <template v-if="(row.fileType == 3 || row.fileType == 1) && row.status == 2">
                <Icon :cover="row.fileCover" :width="32"></Icon>
              </template>
              <template v-else>
                <Icon v-if="row.folderType == 0" :fileType="row.fileType"></Icon>
                <Icon v-if="row.folderType == 1" :fileType="0"></Icon>
              </template>
              <span class="file-name" :title="row.fileName">
                <span @click="preview(row)">{{ row.fileName }}</span>
              </span>
              <span class="op">
                <span
                  class="iconfont icon-download"
                  v-if="row.folderType == 0"
                  @click="download(row)"
                  >下载
                </span>
                <span
                  class="iconfont icon-import"
                  @click="saveToMyPanSingle(row)"
                  v-if="row.showOp && !shareInfo.currentUser"
                >
                  保存到网盘
                </span>
              </span>
            </div>
          </template>
          <template #fileSize="{ index, row }">
            <span v-if="row.fileSize">{{ Utils.sizeToStr(row.fileSize) }}</span>
          </template>
        </Table>
      </div>
    </template>
    <!-- 目录选择 -->
    <FolderSelect ref="folderSelectRef" @folderSelect="saveToMyPanDone"></FolderSelect>
    <!-- 预览 -->
    <Preview ref="previewRef"></Preview>
  </div>
</template>

<script setup>
import FolderSelect from '@/components/FoldersSelect.vue'
import { ref, reactive, getCurrentInstance, nextTick } from 'vue'
const { proxy } = getCurrentInstance()
import { NavigationFailureType, useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const api = {
  getShareLoginInfo: '/showShare/getShareLoginInfo',
  loadFileList: '/showShare/loadFileList',
  createDownloadUrl: '/showShare/createDownloadUrl',
  download: '/api/showShare/download',
  cancelShare: '/share/cancelShare',
  saveShare: '/showShare/saveShare',
}
const shareId = route.params.shareId
const shareInfo = ref({})
const getShareInfo = async () => {
  let result = await proxy.Request({
    url: api.getShareLoginInfo,
    showLoading: false,
    params: {
      shareId: shareId,
    },
  })
  if (!result) {
    return
  }
  if (result.data == null) {
    router.push(`/shareCheck/${shareId}`)
    return
  }
  shareInfo.value = result.data
}
getShareInfo()
const columns = [
  {
    label: '文件名',
    prop: 'fileName',
    scopedSlots: 'fileName',
  },
  {
    label: '修改时间',
    prop: 'lastUpdateTime',
    width: 200,
  },
  {
    label: '大小',
    prop: 'fileSize',
    scopedSlots: 'fileSize',
    width: 200,
  },
]
const tableData = ref({})
const dataTableRef = ref()
const tableOptions = ref({
  extHeight: 80,
  selectType: 'checkbox',
})

const loadDataList = async () => {
  let params = {
    pageNo: tableData.value.pageNo,
    pageSize: tableData.value.pageSize,
    shareId: shareId,
    filePid: currentFolder.value.fileId,
  }
  if (params.category != 'all') {
    delete params.filePid
  }
  let result = await proxy.Request({
    url: api.loadFileList,
    showLoading: false,
    params: params,
  })
  if (!result) {
    return
  }
  tableData.value = result.data
}
const selectIdList = ref([])
const rowSelected = (rows) => {
  selectIdList.value = []
  rows.forEach((item) => {
    selectIdList.value.push(item.fileId)
  })
}
// 展示操作按钮
const showOp = (row) => {
  tableData.value.list.forEach((item) => {
    item.showOp = false
  })
  row.showOp = true
}
const cancelShowOp = (row) => {
  row.showOp = false
}
// 预览
const previewRef = ref()
const navigationref = ref()
const preview = (data) => {
  if (data.folderType == 1) {
    navigationref.value.openFolder(data)
  }
  // 文件
  if (data.status !== 2) {
    proxy.Message.warning('文件未完成转码，无法预览')
    return
  }
  previewRef.value.showPreview(data, 2)
}
const currentFolder = ref({ fileId: '0' })
const navChange = (data) => {
  const { curFolder } = data
  currentFolder.value = curFolder
  loadDataList()
}
// 下载
const download = async (row) => {
  let result = await proxy.Request({
    url: api.createDownloadUrl + '/' + shareId + '/' + row.fileId,
  })
  if (!result) {
    return
  }
  window.location.href = api.download + '/' + result.data
}
// 保存到我的网盘
const folderSelectRef = ref()
const saveToMyPanFileArray = ref([])
const saveToMyPan = () => {
  if (selectIdList.value.length == 0) {
    return
  }
  if (!proxy.VueCookies.get('userInfo')) {
    router.push(`/login?redirectUrl=${route.path}`)
    return
  }
  saveToMyPanFileArray.value = selectIdList.value
  folderSelectRef.value.showFolderDialog()
}
const saveToMyPanSingle=(row)=>{
  if (!proxy.VueCookies.get('userInfo')) {
    router.push(`/login?redirectUrl=${route.path}`)
    return
  }
  saveToMyPanFileArray.value = [row.fileId]
  folderSelectRef.value.showFolderDialog()
}
const saveToMyPanDone = async (folderId) => {
  let result = await proxy.Request({
    url: api.saveShare,
    params: {
      shareId:shareId,
      shareFileIds:saveToMyPanFileArray.value.join(),
      myFolderId:folderId
    },
  })
  if (!result) {
    return
  }
  proxy.Message.success('文件已保存到网盘中')
  folderSelectRef.value.close()
}
// 取消分享
const cancelShare=()=>{
  proxy.Confirm('你确定要取消分享吗？',async()=>{
    let result = await proxy.Request({
       url:api.cancelShare,
       params:{
        shareIds:shareId
       }
    })
    if(!result){
      return;
    }
    proxy.Message.success('取消分享成功')
    router.push('/')
  })
}
const jump=()=>{
  router.push('/')
}
</script>

<style lang="scss" scoped>
@import '@/assets/file.list.scss';
.header {
  width: 100%;
  position: fixed;
  background-color: #0c95f7;
  height: 50px;
  .header-content {
    width: 70%;
    margin: 0 auto;
    color: #fff;
    line-height: 50px;
    .logo {
      display: flex;
      align-items: center;
      cursor: pointer;
      .icon-pan {
        font-size: 40px;
      }
      .name {
        font-weight: bold;
        margin-left: 5px;
        font-size: 25px;
      }
    }
  }
}
.share-body {
  width: 70%;
  margin: 0 auto;
  padding-top: 50px;
  .loading {
    height: calc(100vh / 2);
    width: 100%;
  }
  .share-panel {
    margin-top: 20px;
    display: flex;
    justify-content: space-around;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
    .share-user-info {
      flex: 1;
      display: flex;
      align-items: center;
      .avatar {
        margin-right: 5px;
      }
      .share-info {
        .user-info {
          display: flex;
          align-items: center;
          .nick-name {
            font-size: 15px;
          }
          .share-time {
            margin-left: 20px;
            font-size: 12px;
          }
        }
        .file-name {
          margin-top: 10px;
          font-size: 12px;
        }
      }
    }
  }
}
.file-list {
  margin-top: 10px;
  .file-item {
    .op {
      width: 170px;
    }
  }
}
</style>
