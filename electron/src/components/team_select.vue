
<template>
<el-select-v2   placeholder="选择检验小组" v-model="selectteam.selectid" :options="allteamlist" style="width: 250px" @change="changeselect"/>
</template>
<script setup>
import {  ref, onMounted,reactive} from 'vue';
import { api_team_show } from '../api/team';
const allteamlist=ref([])
const selectteam=reactive({selectid:0,teamid:0})

function list_AllTeam(){
  api_team_show({name:"",page:1,pagesize:100})
  .then(data=>{
    let i=0
    for (i in data.data.data)
    {
      allteamlist.value.push({
      label:data.data.data[i].name,
      value:i,
      teamid:data.data.data[i].id
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