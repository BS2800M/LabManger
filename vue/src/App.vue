<template>
  <messagebox ref="messageboxRef" />
  <RouterView name="main"></RouterView>
  <RouterView name="bar"></RouterView>
</template>

<script>
import messagebox from './components/messagebox.vue' // 路径根据实际情况调整

export default {
  name: 'APP',
  components: {
    messagebox
  }
}
</script>
