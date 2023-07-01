<template>
  <div class="top">
    <div class="top-op">
      <div class="btn">
        <el-upload
          :show-file-list="false"
          :width-credentials="true"
          :multiple="true"
          :http-request="addFile"
          :accept="fileAccept"
        >
          <el-button type="primary">
            <span class="iconfont icon-upload"></span>
            上传
          </el-button>
        </el-upload>
      </div>
      <el-button type="success">
        <span class="iconfont icon-folder-add"></span>
        新建文件夹
      </el-button>
      <el-button type="danger">
        <span class="iconfont icon-del"></span>
        批量删除
      </el-button>
      <el-button type="warning">
        <span class="iconfont icon-move"></span>
        批量移动
      </el-button>
      <div class="search-panel">
        <el-input clearable placeholder="请输入文件名搜索">
          <template #suffix>
            <i class="iconfont -icon-search"></i>
          </template>
        </el-input>
      </div>
      <div class="iconfont icon-refresh"></div>
    </div>
    <!-- 导航 -->
    <div>全部文件</div>
    <div class="file-list">
      <Table
        ref="dataTableRef"
        :colums="colums"
        :dataSource="tableData"
        :fetch="loadDataList"
        :initFetch="true"
        :options="tableOptions"
        @rowSelected="rowSelected"
      >
        <template #fileName="{ index, row }">
          <div class="file-item" @mouseenter="showOP(row)" @mouseleave="cancelShowOp(row)">
            <template v-if="(row.fileType == 3 || row.fileType == 1) && row.status == 2">
              <Icon :cover="row.fileCover" :width="32"></Icon>
            </template>
            <template v-else>
              <Icon v-if="row.folderType == 0" :fileType="row.fileType"></Icon>
              <Icon v-else :fileType="0"></Icon>
            </template>
            <span class="file-name" :title="row.fileName">
              <span>{{ row.fileName }}</span>
              <span v-if="row.status == 1" class="transfer-status">转码中</span>
              <span v-if="row.status == 1" class="transfer-status transfer-fail">失败</span>
              <div class="edit-panel">
                
              </div>
              <span class="op">
                <template v-if="row.showOp && row.fileId && row.status == 2">
                  <span class="iconfont icon-sharel">分享</span>
                  <span class="iconfont icon-download" v-if="row.folderType==0">下载</span>
                  <span class="icofont icon-del">删除</span>
                  <span class="icofont icon-edit">重命名</span>
                  <span class="icofont icon-move">移动</span>
                </template>
              </span>
            </span>
          </div>
        </template>
        <template #fileSize="{index,row}">
          <span v-if="row.fileSize">{{ Utils.sizeToStr(row.fileSize) }}</span>
        </template>
      </Table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const { proxy } = getCurrentInstance()
const route = useRoute()
const router = useRouter()
const api = {
  loadDataList: '/file/loadDataList',
  rename: '/file/rename',
  newFoloder: '/file/newFoloder',
  getFoloderInfo: '/file/getFoloderInfo',
  delFile: '/file/delFile',
  changeFileDolder: '/file/changeFileDolder',
  createDownloadUrl: '/file/createDownloadUrl',
  downLoad: '/api/file/download',
}
const colums = [
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
const tableOptions = ref({
  extHeight: 50,
  selectType: 'checkbox',
})
const fileNameFuzzy = ref()
const category = ref()
const loadDataList = async () => {
  let params = {
    pageNo: tableData.value.pageNo,
    pageSize: tableData.value.pageSize,
    fileNameFuzzy: fileNameFuzzy.value,
    // category:category.value,
    filePid: 0,
  }
  if (params.category != 'all') {
    delete params.filePid
  }
  let result = await proxy.Request({
    url: api.loadDataList,
    params: params,
  })
  if (!result) {
    return
  }
  tableData.value = result.data
}
const rowSelected = () => {}
// 展示操作按钮
const showOP=(row)=>{
  tableData.value.list.forEach(item=>{
    item.showOp=false
  })
  row.showOp=true
}
const cancelShowOp=(row)=>{
  row.showOP=false
}
</script>

<style lang="scss" scoped>
@import '@/assets/file.list.scss';
</style>
