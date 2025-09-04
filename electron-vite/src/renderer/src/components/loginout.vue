<template>
</template>
<script setup>
import { ref ,onMounted} from 'vue';
import { useRouter } from 'vue-router'

const router=useRouter()
async function logout(){
    try {
        localStorage.removeItem("token")
    } catch (err) {
        openmessagebox('error', err.response.data.msg, null)
    }
    router.push("/login")
}
onMounted(logout)
</script>

  
<style scoped>

</style>