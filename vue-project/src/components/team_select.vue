


<template>
<el-select-v2   placeholder="选择检验小组" v-model="selectteam.selectid" :options="allteamlist" style="width: 250px" @change="changeselect"/>
</template>
<script setup>
import {  ref, onMounted,reactive} from 'vue';
import { api_list_ALLTeam } from '../api/test_manger';
const allteamlist=ref([])
const selectteam=reactive({selectid:0,teamid:0})

function list_AllTeam(){
  api_list_ALLTeam()
  .then(data=>{
    let i=0
    for (i in data.data.list)
    {
      allteamlist.value.push({
      label:data.data.list[i].name,
      value:i,
      teamid:data.data.list[i].id
    })
    }
    selectteam.teamid=localStorage.getItem('t_teamid')
    selectteam.selectid=localStorage.getItem('t_selectid')
  })
}

function changeselect(){
    selectteam.teamid=allteamlist.value[selectteam.selectid].teamid
    localStorage.setItem('t_teamid',selectteam.teamid)
    localStorage.setItem('t_selectid',selectteam.selectid)
    
}


onMounted(list_AllTeam)

</script>

<style scoped>



</style>