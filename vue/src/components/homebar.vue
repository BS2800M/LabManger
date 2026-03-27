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
    </el-menu>
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
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeIndex = ref('3')
const isDark = ref(false)
const THEME_KEY = 'labmanger-theme'
let themeTransitionId = 0
const keyPathMap: Record<string, string> = {
  '3-1-0': '/reagent-lot',
  '3-1-3': '/inbound',
  '3-1-4': '/outbound',
  '3-1-5': '/operation',
  '3-1-6': '/inventory',
  '3-2-0': '/location-sensor-record'
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
  margin: 0 auto;
}

.theme-switch-wrap {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 101;
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
  background: linear-gradient(90deg, #0f766e 0%, #0ea5e9 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

:global(.homebar-popup .el-menu-item),
:global(.homebar-popup .el-sub-menu__title) {
  min-height: 50px;
  line-height: 50px;
}

:global(::view-transition-old(root)),
:global(::view-transition-new(root)) {
  animation: none;
  mix-blend-mode: normal;
}

:global(html.theme-ripple::view-transition-new(root)) {
  animation: theme-reveal 320ms ease-in-out both;
}

@keyframes theme-reveal {
  from {
    clip-path: circle(0 at calc(100% - 24px) 24px);
  }
  to {
    clip-path: circle(115vmax at calc(100% - 24px) 24px);
  }
}

</style>
