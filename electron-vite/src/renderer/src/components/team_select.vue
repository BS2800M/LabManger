
<template>
<el-select-v2   placeholder="选择检验小组" v-model="selectteam.selectid" :options="allteamlist" style="width: 250px" @change="changeselect"/>
</template>
<script setup>
import {  ref, onMounted,reactive} from 'vue';
import { api_team_show } from '../api/team';
import { defineProps,watch } from 'vue';



const allteamlist=ref([])
const selectteam=reactive({selectid:0,teamid:0})
const props = defineProps({
  modelValue: {
    required: true
  }
})
const emit = defineEmits(['update:modelValue'])

function list_AllTeam(){
  api_team_show({name:"",page:1,pagesize:99999})
  .then(data=>{
    let i=0
    for (i in data)
    {
      allteamlist.value.push({
      label:data[i].name,
      value:i,
      teamid:data[i].id
    })
    }

  })
}

function changeselect(){
    selectteam.teamid=allteamlist.value[selectteam.selectid].teamid
    emit('update:modelValue',selectteam.teamid)
}


watch(() => props.modelValue,newValue => {
  for (let i in allteamlist.value){
    if (allteamlist.value[i].teamid==newValue){
      selectteam.selectid=i
      break
    }
  }
})




onMounted(list_AllTeam)

</script>

<style scoped>



</style>