<template>
  <RouterView name="main"></RouterView>
  <RouterView name="bar"></RouterView>
  <messagebox ref="messageboxRef"  ></messagebox>
</template>
<script>
  import messagebox from '@/components/messagebox.vue'
  export default{
    name:'APP',
    components:{
      messagebox
    }
  }
</script>
