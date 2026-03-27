<template>
  <div id="background">
    <div id="dashbord">
      <p class="title">试剂库存</p>
      <p :class="dashbord.warning_totalnum > 0 ? 'warn' : 'no_warn'" class="line">总种类：{{ dashbord.total }} / 警告种类：{{ dashbord.warning_totalnum }}</p>
      <p :class="dashbord.warning_numnum > 0 ? 'warn' : 'no_warn'" class="line">数量警告：{{ dashbord.warning_numnum }}</p>
      <p :class="dashbord.warning_expirnum > 0 ? 'warn' : 'no_warn'" class="line">有效期警告：{{ dashbord.warning_expirnum }}</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import { api_inventory_dashboard } from '@/api/inventory'

const dashbord = reactive({
  total: 0,
  warning_totalnum: 0,
  warning_numnum: 0,
  warning_expirnum: 0
})

async function readdashbord() {
  const data = await api_inventory_dashboard()
  if (!data || !data.data) return
  dashbord.total = data.data.totalNum
  dashbord.warning_totalnum = data.data.warningTotalNum
  dashbord.warning_numnum = data.data.warningNumNum
  dashbord.warning_expirnum = data.data.warningExpNum
}

onMounted(() => {
  readdashbord()
})
</script>

<style scoped>
#background {
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgb(30, 42, 54);
  height: 100vh;
  width: 100vw;
  z-index: 0;
}

#dashbord {
  position: absolute;
  width: 420px;
  min-height: 180px;
  top: 100px;
  left: 250px;
  color: white;
  background-color: rgb(60, 83, 108);
  border-radius: 20px;
  padding: 16px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
}

.title {
  font-size: 36px;
  font-weight: bold;
  margin: 0 0 12px 0;
}

.line {
  font-size: 20px;
  font-weight: 400;
  margin: 8px 0;
}

.warn {
  color: rgb(211, 139, 6);
}

.no_warn {
  color: rgb(166, 255, 0);
}
</style>
