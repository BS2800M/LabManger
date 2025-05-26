<template>
  <messagebox ref="messageboxRef" ></messagebox>
</template>
<script setup>
import { api_signout } from '../api/login';
import { ref ,onMounted} from 'vue';
import messagebox from '@/components/messagebox.vue';
import { useRouter } from 'vue-router'

function openmessagebox(a,b,c,d,e){
  messageboxRef.value.openmessagebox(a,b,c,d),e
}
let  messageboxRef=ref()
const router=useRouter()
function signout(){
    api_signout()
  .then(data=>{
    localStorage.removeItem('token') //清除缓存token
    router.push("/login")
 } )
  .catch(err=>{
    openmessagebox('error',err,'close',null,null)
                })
}
onMounted(signout)
</script>

  
<style scoped>

</style>