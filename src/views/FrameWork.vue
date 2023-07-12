<template>
  <div class="framework">
    <div class="header">
      <div class="logo">
        <span class="iconfont icon-pan"></span>
        <div class="name">Easy云盘</div>
      </div>
      <div class="right-panel">
        <el-popover
          :width="800"
          trigger="click"
          v-model:visible="showUploader"
          :offset="20"
          transition="none"
          :hide-after="0"
          :popper-style="{ padding: '0px' }"
        >
          <template #reference>
            <span class="iconfont icon-transfer"></span>
          </template>
          <template #default>
            <Uploader ref="uploaderRef" @uploadCallback="uploadCallbackHandler"></Uploader>
          </template>
        </el-popover>
        <el-dropdown>
          <div class="user-info">
            <div class="avatar">
              <Avatar
                :userId="userInfo.userId"
                :avatar="userInfo.avatar"
                :timestamp="timestamp"
                :width="46"
              ></Avatar>
            </div>
            <div class="nick-name">{{ userInfo.nickName }}</div>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="updateAvatar">修改头像</el-dropdown-item>
              <el-dropdown-item @click="updatePassword">修改密码</el-dropdown-item>
              <el-dropdown-item @click="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <div class="body">
      <div class="left-sider">
        <div class="menu-list">
          <template v-for="item in menus">
            <div
              v-if="item.allShow"
              :class="['menu-item', item.menuCode == currenMenu.menuCode ? 'active' : '']"
              @click="jump(item)"
            >
              <div :class="['iconfont', 'icon-' + item.icon]"></div>
              <div class="text">{{ item.name }}</div>
            </div>
          </template>
        </div>
        <div class="menu-sub-list">
          <div
            :class="['menu-item-sub', currenPath == sub.path ? 'active' : '']"
            v-for="sub in currenMenu.children"
            @click="jump(sub)"
          >
            <span :class="['iconfont', 'icon-' + sub.icon]" v-if="sub.icon"></span>
            <span class="text">{{ sub.name }}</span>
          </div>
          <div class="tops" v-if="currenMenu && currenMenu.tips">
            {{ currenMenu.tips }}
          </div>
          <div class="space-info">
            <div>空间使用</div>
            <div class="percent">
              <el-progress
                :percentage="
                  Math.floor((useSpaceInfo.useSpace / useSpaceInfo.totalSpace) * 10000) / 100
                "
                color="#409eff"
              ></el-progress>
            </div>
            <div class="space-use">
              <div class="use">
                {{ Utils.sizeToStr(useSpaceInfo.useSpace) }}/{{
                  Utils.sizeToStr(useSpaceInfo.totalSpace)
                }}
              </div>
              <div class="iconfont icon-refresh" @click="getUserSpace"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="body-content">
        <!-- 将子路由定义为组件，否则子路由调用父路由的内容没法调用 -->
        <router-view v-slot="{ Component }">
          <component
            ref="routerViewRef"
            :is="Component"
            @addFile="addFile"
            @reload="reload"
          ></component>
        </router-view>
      </div>
    </div>
    <UpdateAvatar ref="updateAvatarRef" @updateAvatar="reloadAvatar"></UpdateAvatar>
    <UpdatePassword ref="updatePasswordRef"></UpdatePassword>
  </div>
</template>

<script setup>
import Uploader from '@/views/main/Uploader.vue'
import UpdateAvatar from './UpdateAvatar.vue'
import UpdatePassword from './UpdatePassword.vue'
import { ref, reactive, getCurrentInstance, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const { proxy } = getCurrentInstance()
const route = useRoute()
const router = useRouter()
const api = {
  logout: '/logout',
  getUseSpace: '/getUseSpace',
}
const showUploader = ref(false)
const uploaderRef = ref()
// 添加文件
const addFile = (data) => {
  const { file, filePid } = data
  showUploader.value = true
  uploaderRef.value.addFile(file, filePid)
}

const routerViewRef = ref()
// 上传文件回调
const uploadCallbackHandler = () => {
  nextTick(() => {
    routerViewRef.value.reload()
    // TODO更新用户空间
    getUserSpace()
  })
}
const userInfo = ref(proxy.VueCookies.get('userInfo'))
const timestamp = ref(0)
const menus = [
  {
    icon: 'cloude',
    name: '首页',
    menuCode: 'main',
    path: '/main/all',
    allShow: true,
    children: [
      {
        icon: 'all',
        name: '全部',
        category: 'all',
        path: '/main/all',
      },
      {
        icon: 'video',
        name: '视频',
        category: 'avideo',
        path: '/main/video',
      },
      {
        icon: 'music',
        name: '音频',
        category: 'music',
        path: '/main/music',
      },
      {
        icon: 'doc',
        name: '文档',
        category: 'doc',
        path: '/main/doc',
      },
      {
        icon: 'more',
        name: '其他',
        category: 'others',
        path: '/main/others',
      },
    ],
  },
  {
    path: '/myshare',
    icon: 'share',
    name: '分享',
    allShow: true,
    menuCode: 'share',
    children: [
      {
        name: '分享记录',
        path: '/myshare',
      },
    ],
  },
  {
    path: '/recycle',
    icon: 'del',
    name: '回收站',
    menuCode: 'recycle',
    tips: '回收站为你保存10天内删除的文件',
    allShow: true,
    children: [
      {
        name: '删除的文件',
        path: '/recycle',
      },
    ],
  },
  {
    path: '/settings/fileList',
    icon: 'settings',
    name: '设置',
    menuCode: 'settings',
    allShow: false,
    children: [
      {
        name: '用户文件',
        path: '/settings/fileList',
      },
      {
        name: '用户管理',
        path: '/settings/userList',
      },
      {
        name: '系统设置',
        path: '/settings/sysSetting',
      },
    ],
  },
]
const currenMenu = ref({})
const currenPath = ref()
const jump = (data) => {
  if (!data.path || data.menuCode == currenMenu.value.menuCode) {
    return
  }
  router.push(data.path)
}
const setMenu = (menuCode, path) => {
  const menu = menus.find((item) => {
    return item.menuCode == menuCode
  })
  currenMenu.value = menu
  currenPath.value = path
}
watch(
  () => route,
  (newVal, oldVal) => {
    if (newVal.meta.menuCode) {
      setMenu(newVal.meta.menuCode, newVal.path)
    }
  },
  { immediate: true, deep: true },
)
// 修改头像
const updateAvatarRef = ref()
const updateAvatar = () => {
  updateAvatarRef.value.show(userInfo.value)
}
const reloadAvatar = () => {
  userInfo.value = proxy.VueCookies.get('userInfo')
  timestamp.value = new Date().getTime()
}
// 修改密码
const updatePasswordRef = ref()
const updatePassword = () => {
  updatePasswordRef.value.show()
}
// 退出登陆
const logout = async () => {
  proxy.Confirm('你确定要退出吗？', async () => {
    let result = await proxy.Request({
      url: api.logout,
    })
    if (!result) {
      return
    }
    proxy.VueCookies.remove
    router.push('/login')
  })
}
// 使用空间
const useSpaceInfo = ref({
  useSpace: 0,
  totalSpace: 1,
})
const getUserSpace = async () => {
  let result = await proxy.Request({
    url: api.getUseSpace,
    showLoading: false,
  })
  if (!result) {
    return
  }
  useSpaceInfo.value = result.data
}
getUserSpace()
// 回收站还原和删除文件回调用户空间
const reload = () => {
  getUserSpace()
}
</script>
<style lang="scss" scoped>
.header {
  box-shadow: 0 3px 10px 0 rgb(0 0 0 / 6%);
  height: 56px;
  padding-left: 24px;
  padding-right: 24px;
  position: relative;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .logo {
    display: flex;
    align-items: center;
    font-size: 25px;
    color: #05a1f5;
    .icon-pan {
      font-size: 30px;
      display: flex;
      align-items: center;
    }
    .name {
      font-weight: bold;
      margin-left: 5px;
    }
  }
  .right-panel {
    display: flex;
    align-items: center;
    .icon-transfer {
      cursor: pointer;
    }
    .user-info {
      margin-right: 10px;
      display: flex;
      align-items: center;
      cursor: pointer;
      .avatar {
        margin: 0 5px 0 15px;
      }
      .nick-name {
        color: #05a1f5;
      }
    }
  }
}
.body {
  display: flex;
  .left-sider {
    border-right: 1px solid #f1f2f4;
    display: flex;
    .menu-list {
      height: calc(100vh - 56px);
      width: 80px;
      box-shadow: 0 3px 10px 0 rgb(0 0 0 / 6%);
      border-right: 1px solid #f1f2f4;
      .menu-item {
        text-align: center;
        font-size: 14px;
        font-weight: bold;
        padding: 20px 0px;
        cursor: pointer;
        &:hover {
          background-color: #f3f3f3;
        }
        .iconfont {
          font-weight: normal;
          font-size: 28px;
        }
      }
      .active {
        .iconfont {
          color: #06a7ff;
        }
        .text {
          color: #06a7ff;
        }
      }
    }
    .menu-sub-list {
      width: 200px;
      padding: 20px 10px 0;
      position: relative;
      .menu-item-sub {
        text-align: center;
        line-height: 40px;
        border-radius: 5px;
        cursor: pointer;
        &:hover {
          background-color: #f3f3f3;
        }
        .iconfont {
          font-size: 14px;
          margin-right: 20px;
        }
        .text {
          font-size: 13px;
        }
      }
      .active {
        background-color: #eef9fe;
        .iconfont {
          color: #05a1f5;
        }
        .text {
          color: #05a1f5;
        }
      }
      .tips {
        margin-top: 10px;
        color: #888888;
        font-size: 13px;
      }
      .space-info {
        position: absolute;
        bottom: 10px;
        width: 100%;
        padding: 0 5px;
        .percent {
          padding-right: 10px;
        }
        .space-use {
          margin-top: 5px;
          color: #7e7e7e;
          display: flex;
          justify-content: space-around;
          .use {
            flex: 1;
          }
          .iconfont {
            cursor: pointer;
            margin-right: 20px;
            color: #05a1f5;
          }
        }
      }
    }
  }
  .body-content {
    flex: 1;
    width: 0px;
    padding-left: 20px;
  }
}
</style>
