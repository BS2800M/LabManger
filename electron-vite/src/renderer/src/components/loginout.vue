<template>
  <messagebox ref="messageboxRef" ></messagebox>
</template>
<script setup>
import { api_logout } from '../api/loginout';
import { ref ,onMounted} from 'vue';
import messagebox from '@/components/messagebox.vue';
import { useRouter } from 'vue-router'

function openmessagebox(a,b,c){
  messageboxRef.value.openmessagebox(a,b,c)
}
let  messageboxRef=ref()
const router=useRouter()
function logout(){
    api_logout(localStorage.username)
  .then(data=>{
    localStorage.removeItem('token') //清除缓存token
    router.push("/login")
 } )
  .catch(err=>{
    openmessagebox('error',err.response.data.msg,null)
                })
}
onMounted(logout)
</script>

  
<style scoped>

</style>