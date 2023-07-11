<template>
  <div class="top-panel">
    <el-form :model="searchformData" label-width="80px" @submit.prevent>
      <el-row>
        <el-col :span="4">
          <el-form-item label="用户昵称">
            <el-input
              clearable
              placeholder="支持模糊搜索"
              v-model.trim="searchformData.nickNameFuzzy"
              @keyup.enter="loadDataList"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="状态" prop="">
            <el-select clearable placeholder="请选择状态" v-model="searchformData.status">
              <el-option :value="1" label="启用"></el-option>
              <el-option :value="0" label="禁用"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4" :style="{ 'padding-left': '10px' }">
          <el-button type="primary" @click="loadDataList">搜索查询</el-button>
        </el-col>
      </el-row>
    </el-form>
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
      <template #avatar="{ index, row }">
        <div class="avatar">
          <Avatar :userId="row.userId" :avatar="row.qqAvatar"></Avatar>
        </div>
      </template>
      <template #space="{ index, row }">
        {{ Utils.sizeToStr(row.useSpace) }}/{{ Utils.sizeToStr(row.totalSpace) }}
      </template>
      <template #status="{ index, row }">
        <span v-if="row.status == 1" style="color: #529b2e">启用</span>
        <span v-if="row.status == 0" style="color: #f56c62">禁用</span>
      </template>
      <template #op="{ index, row }">
        <span class="a-link" @click="updateSpace(row)">分配空间</span>
        <el-divider direction="vertical"></el-divider>
        <span class="a-link" @click="updateUserStatus(row)">
          {{ row.status == 0 ? '启用' : '禁用' }}
        </span>
      </template>
    </Table>
  </div>
  <Dialog
    :show="dialogConfig.show"
    :title="dialogConfig.title"
    :buttons="dialogConfig.buttons"
    width="400px"
    :showCancel="false"
    @close="dialogConfig.show = false"
  >
    <el-form :model="formData" :rules="rules" ref="formDataRef" label-width="80px" @submit.prevent>
      <!--input输入-->
      <el-form-item label="昵称" prop="">
        {{ formData.nickName }}
      </el-form-item>
      <el-form-item label="空间大小" prop="changeSpace">
        <el-input clearable placeholder="请输入空间大小" v-model.trim="formData.changeSpace">
          <template #suffix>MB</template>
        </el-input>
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from 'vue'
const { proxy } = getCurrentInstance()
const api = {
  loadDataList: '/admin/loadUserList',
  updateUserStatus: '/admin/updateUserStatus',
  updateUserSpace: '/admin/updateUserSpace',
}
const searchformData = ref({})

const columns = [
  {
    label: '头像',
    prop: 'avatar',
    scopedSlots: 'avatar',
    width: 80,
  },
  {
    label: '昵称',
    prop: 'nickName',
  },
  {
    label: '邮箱',
    prop: 'email',
  },
  {
    label: '空间使用',
    prop: 'space',
    scopedSlots: 'space',
  },
  {
    label: '加入时间',
    prop: 'joinTime',
  },
  {
    label: '最后登录时间',
    prop: 'lastLoginTime',
  },
  {
    label: '状态',
    prop: 'status',
    width: 80,
    scopedSlots: 'status',
  },
  {
    label: '操作',
    prop: 'op',
    width: 200,
    scopedSlots: 'op',
  },
]
const tableData = ref({})
const loadDataList = async () => {
  let params = {
    pageNo: tableData.value.pageNo,
    pageSize: tableData.value.pageSize,
  }
  Object.assign(params, searchformData.value)
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
// 修改状态
const updateUserStatus = (row) => {
  proxy.Confirm(`你确定要【${row.status == 0 ? '启用' : '禁用'}】`, async () => {
    let result = await proxy.Request({
      url: api.updateUserStatus,
      params: {
        userId: row.userId,
        status: row.status == 0 ? 1 : 0,
      },
    })
    if (!result) {
      return
    }
    loadDataList()
  })
}
const formData = ref({})
const formDataRef = ref()
const rules = {
  changeSpace: [{ required: true, message: '请输入空间大小' }],
}
const dialogConfig = reactive({
  show: false,
  title: '修改空间大小',
  buttons: [
    {
      type: 'primary',
      text: '确定',
      click: (e) => {
        submitForm()
      },
    },
  ],
})
const updateSpace = (data) => {
  dialogConfig.show = true
  nextTick(() => {
    formDataRef.value.resetFields()
    formData.value = Object.assign({}, data)
  })
}
const submitForm = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return
    }
    let params = {}
    Object.assign(params, formData.value)
    let result = await proxy.Request({
      url: api.updateUserSpace,
      params: params,
    })
    if (!result) {
      return
    }
    dialogConfig.show=false
    proxy.Message.success('修改空间成功')
    loadDataList()
  })
}
</script>

<style lang="scss" scoped>
@import '@/assets/file.list.scss';

.top-panel {
  padding-top: 10px;
  height: 50px;
  border-radius: 25px;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
