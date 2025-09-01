
<template>
<el-select-v2  placeholder="选择检验小组" v-model="selectvalue" 
:options="allteamlist" style="width: 250px" @change="changeselect"
:filterable="true"
/>
</template>
<script setup>
import {  ref, onMounted,reactive} from 'vue';
import { api_team_show } from '@/api/team.js';
import { defineProps,watch } from 'vue';



const allteamlist=ref([])
const selectvalue=ref(null)
const props = defineProps({
  modelValue: {
    required: true
  }
})
const emit = defineEmits(['update:modelValue'])

async function list_AllTeam(){
let data= await  api_team_show({name:"",page:1,pagesize:999})
    for (let i in data.data)
    {
      allteamlist.value.push({
      label:data.data[i].name,
      value:i,
      teamid:data.data[i].id})
    }
}

function changeselect(){
    let teamid=allteamlist.value[selectvalue.value].teamid
    emit('update:modelValue',teamid) // 将teamid传递给父组件
    
}
function start_watch(){
    watch(() => props.modelValue, (newValue) => {  //当teamid改变的时候 改变选择的value
      if(newValue===null){
        selectvalue.value=null
      }
      if (newValue && allteamlist.value.length > 0) {
          for (let i in allteamlist.value) {
          if (allteamlist.value[i].teamid === newValue) {
            selectvalue.value = i // 设置selectvalue
            break}
        }
      }
    }, { immediate: true }) // 添加 immediate: true，确保组件挂载时立即执行
}


onMounted(async()=>{
  await list_AllTeam()
  start_watch()
})

</script>

<style scoped>



</style>