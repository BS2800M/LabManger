<template>
  <div class="homebar-wrap">
    <el-menu
      :default-active="activeIndex"
      class="homebar-menu"
      mode="horizontal"
      @select="handleSelect"
    >
    <el-menu-item index="1"><span class="brand-title">LabManger</span></el-menu-item>
      <el-sub-menu index="3" popper-class="homebar-popup">
        <template #title>实验室管理</template>
      <el-sub-menu index="3-1" popper-class="homebar-popup">
        <template #title>试剂与库存</template>
        <el-menu-item index="3-1-0">试剂与批号管理</el-menu-item>
        <el-menu-item index="3-1-3">入库</el-menu-item>
        <el-menu-item index="3-1-4">出库</el-menu-item>
        <el-menu-item index="3-1-5">操作查询</el-menu-item>
        <el-menu-item index="3-1-6">库存查询</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="3-2" popper-class="homebar-popup">
        <template #title>环境监测</template>
        <el-menu-item index="3-2-0">地点与监测管理</el-menu-item>
      </el-sub-menu>
      </el-sub-menu>
      <el-sub-menu index="4" popper-class="homebar-popup">
        <template #title>系统管理</template>
        <el-menu-item index="4-1">小组管理</el-menu-item>
        <el-menu-item index="4-2">用户管理</el-menu-item>
      </el-sub-menu>
    </el-menu>
    <div class="toolbar-actions">
      <div class="identity-actions">
        <IdentityActionPopover
          label="检验者"
          mode="checker"
          :username="checkerUsername"
        />
        <IdentityActionPopover
          label="审核者"
          mode="reviewer"
          :username="reviewerUsername"
        />
      </div>
      <div class="theme-time">
      <div class="theme-switch-wrap">
        <span class="theme-label">{{ isDark ? '黑夜' : '白天' }}</span>
        <el-switch
          v-model="isDark"
          inline-prompt
          active-text="夜"
          inactive-text="日"
          @change="handleThemeChange"
        />
      </div>
      <span class="server-time-value">时间:{{ serverTimeText }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import IdentityActionPopover from '@/components/identity_action_popover.vue'
import { api_others_time } from '@/api/others'

const router = useRouter()
const activeIndex = ref('3')
const isDark = ref(false)
const checkerUsername = ref('未登录')
const reviewerUsername = ref('未登录')
const serverTimeText = ref('--')
const THEME_KEY = 'labmanger-theme'
let themeTransitionId = 0
let serverTimeTimer: number | null = null
let serverTimeOffsetMs: number | null = null
const keyPathMap: Record<string, string> = {
  '3-1-0': '/reagent-lot',
  '3-1-3': '/inbound',
  '3-1-4': '/outbound',
  '3-1-5': '/operation',
  '3-1-6': '/inventory',
  '3-2-0': '/location-sensor-record',
  '4-1': '/team',
  '4-2': '/user',
}

const handleSelect = (key: string) => {
  const target = keyPathMap[key]
  if (target) {
    router.push(target)
  }
}

const applyTheme = (value: boolean) => {
  const root = document.documentElement
  if (value) {
    root.classList.add('dark')
    localStorage.setItem(THEME_KEY, 'dark')
  } else {
    root.classList.remove('dark')
    localStorage.setItem(THEME_KEY, 'light')
  }
}

const updateIdentityInfo = () => {
  checkerUsername.value = localStorage.getItem('checkerUsername') || '未登录'
  reviewerUsername.value = localStorage.getItem('reviewerUsername') || '未登录'
}

const updateServerTimeText = () => {
  if (serverTimeOffsetMs === null) {
    serverTimeText.value = '--'
    return
  }
  const serverNowMs = Date.now() + serverTimeOffsetMs
  serverTimeText.value = new Date(serverNowMs).toLocaleString('sv-SE', { hour12: false }).slice(0, 16)
}

const fetchServerTime = async () => {
  try {
    const res = await api_others_time()
    const unixMs = res?.data?.unixMs
    if (typeof unixMs !== 'number') {
      serverTimeOffsetMs = null
      serverTimeText.value = '--'
      return
    }
    serverTimeOffsetMs = unixMs - Date.now()
    updateServerTimeText()
  } catch (error) {
    serverTimeOffsetMs = null
    serverTimeText.value = '--'
  }
}

const handleThemeChange = async (value: boolean) => {
  const root = document.documentElement
  const doc = document as Document & {
    startViewTransition?: (callback: () => void) => {
      ready?: Promise<void>
      finished?: Promise<void>
    }
  }
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!doc.startViewTransition || prefersReducedMotion) {
    applyTheme(value)
    return
  }

  const currentTransitionId = ++themeTransitionId
  root.classList.add('theme-ripple')
  const transition = doc.startViewTransition(() => {
    applyTheme(value)
  })

  try {
    await (transition.finished ?? transition.ready ?? Promise.resolve())
  } finally {
    if (currentTransitionId === themeTransitionId) {
      root.classList.remove('theme-ripple')
    }
  }
}

onMounted(() => {
  const savedTheme = localStorage.getItem(THEME_KEY)
  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  applyTheme(isDark.value)
  updateIdentityInfo()
  fetchServerTime()
  serverTimeTimer = window.setInterval(() => {
    updateServerTimeText()
  }, 1000)
})

onBeforeUnmount(() => {
  if (serverTimeTimer !== null) {
    window.clearInterval(serverTimeTimer)
    serverTimeTimer = null
  }
})

</script>

<style scoped>
.homebar-wrap {
  position: fixed;
  top: 0px;
  left: 0;
  width: 100%;
  z-index: 100;
}

.homebar-menu {
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  --el-menu-horizontal-height: 70px;
  --el-menu-item-height: 50px;
  --el-menu-hover-bg-color: var(--menu-hover-bg);
  margin: 0 auto;
}

.toolbar-actions {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 14px;
  z-index: 101;
}

.server-time-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  min-width: 170px;
}

.server-time-label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  line-height: 1;
}

.server-time-value {
  font-size: 14px;
  font-weight: 700;
  color: var(--el-text-color-primary);
  line-height: 1;
}

.identity-actions {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 6px;
}

.theme-time {
  display: flex;
  flex-direction: column;
  flex-direction: column;
  gap: 8px;
  justify-content: flex-start;

}
.theme-switch-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.theme-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.brand-title {
  font-family: "Trebuchet MS", "Segoe UI", sans-serif;
  font-size: 22px;
  font-weight: 1000;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--el-text-color-primary);
}

:global(.homebar-popup .el-menu-item),
:global(.homebar-popup .el-sub-menu__title) {
  min-height: 50px;
  line-height: 50px;
}

:global(.homebar-popup .el-menu-item:hover),
:global(.homebar-popup .el-sub-menu__title:hover) {
  background-color: var(--menu-hover-bg) !important;
  color: var(--el-text-color-primary) !important;
}

:global(.homebar-menu.el-menu--horizontal > .el-menu-item:hover),
:global(.homebar-menu.el-menu--horizontal > .el-sub-menu .el-sub-menu__title:hover) {
  background-color: var(--menu-hover-bg) !important;
  color: var(--el-text-color-primary) !important;
}

:global(::view-transition-old(root)),
:global(::view-transition-new(root)) {
  animation: none;
  mix-blend-mode: normal;
}
:global(html.theme-ripple::view-transition-new(root)) {
  animation: theme-reveal 420ms ease-in-out both;
}

@keyframes theme-reveal {
  from {
    clip-path: circle(0 at calc(100% - 100px) 24px);
  }
  to {
    clip-path: circle(110vmax at calc(100% - 250px) 150px);
  }
}

</style>
