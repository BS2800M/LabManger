<template>
  <div class="home-page">
    <section class="welcome-panel">
      <h1>欢迎 {{ username }}</h1>
      <p>有什么需要帮助的</p>
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const username = ref('用户')

onMounted(() => {
  username.value = localStorage.getItem('currentUserName') || '用户'
})
</script>

<style scoped>
.home-page {
  height: calc(100dvh - 82px);
  margin: 72px auto 0;
  padding: 8px 12px;
  max-width: 1900px;
  box-sizing: border-box;
}

.welcome-panel {
  height: 100%;
  border: 1px solid var(--el-border-color-light);
  border-radius: 10px;
  background: var(--el-bg-color-overlay);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  text-align: center;
}

.welcome-panel h1 {
  margin: 0;
  color: var(--el-text-color-primary);
  font-size: 40px;
  font-weight: 800;
}

.welcome-panel p {
  margin: 0;
  color: var(--el-text-color-regular);
  font-size: 22px;
  font-weight: 500;
}
</style>
