<template>
  <div class="identity-popover-wrap">
    <el-popover
      v-model:visible="visible"
      trigger="click"
      placement="bottom-end"
      :width="popoverWidth"
    >
      <template #reference>
        <el-button class="identity-trigger" type="primary" plain size="small">
          <span class="identity-text">{{ `${props.label}：${props.username}` }}</span>
        </el-button>
      </template>
      <div v-if="props.mode === 'checker'" class="identity-popover-content checker-content">
        <el-input v-model="loginAccount" size="default" placeholder="账号" @input="syncSelectedByAccount" />
        <el-input v-model="loginPassword" size="default" type="password" show-password placeholder="密码" />
        <div class="checker-table-wrap">
          <input
            class="checker-table-search"
            v-model="tableKeyword"
            type="text"
            placeholder="搜索用户名或账户"
          >
          <div class="checker-mini-table">
            <el-auto-resizer>
              <template #default="{ width, height }">
                <el-table-v2
                  :columns="userTableColumns"
                  :data="filteredUserRows"
                  :width="width"
                  :height="height"
                  :row-height="32"
                  :header-height="32"
                  :row-class="({ rowData }) => getUserRowClass(rowData)"
                  :row-event-handlers="{ onClick: handleUserRowClick }"
                />
              </template>
            </el-auto-resizer>
          </div>
        </div>
        <div class="actions-row">
          <el-button class="action-btn checker-action-btn" size="default" type="primary" @click="handleLogin">登录</el-button>
          <el-button class="action-btn checker-action-btn" size="default" type="danger" plain @click="handleLogout">登出</el-button>
        </div>
      </div>
      <div v-else class="identity-popover-content reviewer-content">
        <el-button class="action-btn" size="small" type="danger" plain @click="handleLogout">登出</el-button>
      </div>
    </el-popover>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { api_signin_checker, api_signout } from '@/api/auth.js'
import { api_user_showall } from '@/api/user.js'
import { openErrorMessageBox } from '@/utils/messagebox'

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    default: '未登录',
  },
  mode: {
    type: String,
    default: 'checker',
  },
})

const visible = ref(false)
const loginAccount = ref('')
const loginPassword = ref('')
const popoverWidth = computed(() => (props.mode === 'checker' ? 360 : 120))
const tableKeyword = ref('')
const selectedUserId = ref(null)
const userOptions = ref([])
const userTableColumns = [
  { key: 'account', dataKey: 'account', title: '账户', width: 165, flexGrow: 1 },
  { key: 'userName', dataKey: 'userName', title: '用户名', width: 165, flexGrow: 1 },
]
const router = useRouter()

const filteredUserRows = computed(() => {
  const keyword = String(tableKeyword.value || '').trim().toLowerCase()
  if (!keyword) {
    return userOptions.value
  }
  return userOptions.value.filter((item) => {
    return String(item.userName || '').toLowerCase().includes(keyword) || String(item.account || '').toLowerCase().includes(keyword)
  })
})

const closePopover = () => {
  visible.value = false
  loginPassword.value = ''
}

const refreshPage = () => {
  window.location.reload()
}

const handleUserRowClick = ({ rowData }) => {
  selectedUserId.value = rowData.id
  loginAccount.value = rowData.account
}

const getUserRowClass = (rowData) => {
  return selectedUserId.value === rowData.id ? 'current-row' : ''
}

const syncSelectedByAccount = () => {
  const account = loginAccount.value.trim()
  if (!account) {
    selectedUserId.value = null
    return
  }
  const matched = userOptions.value.find((item) => item.account === account)
  selectedUserId.value = matched ? matched.id : null
}

const loadUserOptions = async () => {
  try {
    const response = await api_user_showall()
    userOptions.value = (response.data || []).map((item) => ({
      id: item.id,
      account: item.account,
      userName: item.userName,
    }))
    syncSelectedByAccount()
  } catch {}
}

watch(visible, (isOpen) => {
  if (isOpen && props.mode === 'checker' && userOptions.value.length === 0) {
    loadUserOptions()
  }
})

const handleLogin = async () => {
  if (props.mode !== 'checker') {
    return
  }
  const account = loginAccount.value.trim()
  const passWord = loginPassword.value
  if (!account || !passWord) {
    openErrorMessageBox({ message: '请输入账号和密码' })
    return
  }
  const reviewerSessionId = localStorage.getItem('reviewerSessionId')
  if (!reviewerSessionId) {
    openErrorMessageBox({ message: '请先登录审核者' })
    router.push('/signin')
    return
  }

  try {
    const response = await api_signin_checker(account, passWord, reviewerSessionId)
    const sessionId = response.data?.sessionId
    if (!sessionId) {
      openErrorMessageBox({ message: '登录失败' })
      return
    }
    const checkerName = response.data.userName
    localStorage.setItem('checkerSessionId', sessionId)
    localStorage.setItem('checkerUsername', checkerName)
    closePopover()
    refreshPage()
  } catch {}
}

const handleLogout = async () => {
  if (props.mode === 'checker') {
    const sessionId = localStorage.getItem('checkerSessionId')
    if (sessionId) {
      try {
        await api_signout(sessionId)
      } catch {}
    }
    localStorage.removeItem('checkerSessionId')
    localStorage.removeItem('checkerUsername')
  } else {
    const checkerSessionId = localStorage.getItem('checkerSessionId')
    if (checkerSessionId) {
      try {
        await api_signout(checkerSessionId)
      } catch {}
    }

    const reviewerSessionId = localStorage.getItem('reviewerSessionId')
    if (reviewerSessionId) {
      try {
        await api_signout(reviewerSessionId)
      } catch {}
    }

    localStorage.removeItem('checkerSessionId')
    localStorage.removeItem('checkerUsername')
    localStorage.removeItem('reviewerSessionId')
    localStorage.removeItem('reviewerUsername')
    localStorage.removeItem('reviewerRole')
    localStorage.removeItem('currentUserName')
    closePopover()
    router.push('/signin')
    return
  }
  closePopover()
  refreshPage()
}
</script>

<style scoped>
.identity-popover-wrap {
  width: 210px;
}

.identity-trigger {
  width: 100%;
  justify-content: flex-start;
  height: 30px;
  padding: 0 8px;
  font-size: 12px;
}

.identity-text {
  display: inline-block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
}

.identity-popover-content {
  display: flex;
  gap: 8px;
}

.checker-content {
  flex-direction: column;
  gap: 12px;
}

.checker-content :deep(.el-input__wrapper) {
  min-height: 40px;
  padding: 0 12px;
}

.checker-content :deep(.el-input__inner) {
  font-size: 14px;
}

.checker-content :deep(.el-input__inner::placeholder) {
  font-size: 14px;
}

.checker-table-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.checker-table-search {
  width: 100%;
  height: 34px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  padding: 0 10px;
  font-size: 13px;
  color: var(--el-text-color-primary);
  background: var(--el-bg-color-overlay);
  outline: none;
  box-sizing: border-box;
}

.checker-mini-table {
  height: 164px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  overflow: hidden;
  background: var(--el-bg-color-overlay);
}

.checker-mini-table :deep(.el-table-v2__row.current-row .el-table-v2__row-cell) {
  background-color: var(--table-current-row-bg) !important;
  color: var(--table-current-row-text) !important;
}

.reviewer-content {
  justify-content: flex-end;
}

.actions-row {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.action-btn {
  min-width: 62px;
  min-height: 38px;
  font-size: 14px;
}

.checker-action-btn {
  min-width: 78px;
  min-height: 38px;
  font-size: 14px;
  padding: 0 14px;
}
</style>
