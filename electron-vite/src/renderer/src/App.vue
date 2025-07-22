<template>
  <messagebox ref="messageboxRef"  ></messagebox>
  <RouterView name="main"></RouterView>
  <RouterView name="bar"></RouterView>
</template>
<script>
  import messagebox from '@/components/messagebox.vue'
  export default{
    name:'APP',
  }
</script>
