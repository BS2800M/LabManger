<template>
  <messagebox ref="to_messagebox" ></messagebox>
</template>
<script setup>
import { api_signout } from '../api/login';
import { ref ,onMounted} from 'vue';
import messagebox from '@/components/messagebox.vue';
import { useRouter } from 'vue-router'


let to_messagebox=ref()
const router=useRouter()
function signout(){
    api_signout()
  .then(data=>{
    localStorage.removeItem('token') //清除缓存token
    router.push("/login")
 } )
  .catch(err=>{
    to_messagebox.value.messagebox_warn(err)
                })
}
onMounted(signout)
</script>

  
<style scoped>

</style>