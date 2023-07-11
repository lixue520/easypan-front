<template>
  <div class="share">
    <div class="body-content">
      <div class="logo">
        <span class="iconfont icon-pan"></span>
        <span class="name">Easy云盘</span>
      </div>
      <div class="code-panel">
        <div class="file-info">
          <div class="avatar">
            <Avatar :userId="shareInfo.userId" :avatar="shareInfo.avatar" :width="50"></Avatar>
          </div>
          <div class="share-info">
            <div class="user-info">
              <span class="nick-name">{{ shareInfo.nickName }}</span>
              <span class="share-time">分享于：{{ shareInfo.shareTime }}</span>
            </div>
            <div class="file-name">分享文件：{{ shareInfo.fileName }}</div>
          </div>
        </div>
        <div class="code-body">
          <div class="tips">请输入提取码</div>
          <div class="input-area">
            <el-form :model="formData" :rules="rules" ref="formDataRef" @submit.prevent>
              <!--input输入-->
              <el-form-item prop="code">
                <el-input
                  class="input"
                  clearable
                  placeholder="请输入提取码"
                  v-model.trim="formData.code"
                  :maxLength="5"
                  @keyup.enter="checkShare"
                ></el-input>
                <el-button type="primary" @click="checkShare">提取文件</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from 'vue'
const { proxy } = getCurrentInstance()
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const api = {
  getShareInfo: '/showShare/getShareInfo',
  checkShareCode: '/showShare/checkShareCode',
}
const shareId = route.params.shareId
const shareInfo = ref({})
const getShareInfo = async () => {
  let result = await proxy.Request({
    url: api.getShareInfo,
    params: {
      shareId: shareId,
    },
  })
  if (!result) {
    return
  }
  shareInfo.value = result.data
}
getShareInfo()
const formData = ref({})
const formDataRef = ref()
const rules = {
  code: [
    { required: true, message: '请输入提取码' },
    { min: 5, message: '提取码为5位' },
  ],
}
const checkShare = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return
    }
    let params = {}
    Object.assign(params, formData.value)
    let result = await proxy.Request({
      url: api.checkShareCode,
      params: {
        shareId: shareId,
        code: formData.value.code,
      },
    })
    if (!result) {
      return
    }
    router.push(`/share/${shareId}`)
  })
}
</script>

<style lang="scss" scoped>
.share {
  height: calc(100vh);
  background: #2980b9;
  background: linear-gradient(to bottom, #ffffff, #6dd5fa, #2980b9);
  display: flex;
  justify-content: center;
  .body-content {
    margin-top: calc(100vh / 5);
    width: 500px;
    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      .icon-pan {
        font-size: 60px;
        color: #409eff;
      }
      .name {
        font-weight: bold;
        margin-left: 5px;
        font-size: 25px;
        color: #409eff;
      }
    }
    .code-panel {
      margin-top: 20px;
      background-color: #fff;
      border-radius: 5px;
      overflow: hidden;
      box-shadow: 0 0 7px 1px #5757574f;
      .file-info {
        padding: 10px 20px;
        background-color: #409eff;
        color: #fff;
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
      .code-body {
        padding: 30px 20px 60px 20px;
        .tips {
          font-weight: bold;
        }
        .input-area {
          margin-top: 10px;
          .input {
            flex: 1;
            margin-right: 10px;
          }
        }
      }
    }
  }
}
</style>
