
<template>
<el-select-v2   placeholder="选择角色" v-model="selectrole.selectid" :options="allrolelist" style="width: 250px" @change="changeselect"/>
</template>
<script setup>
import {  ref, onMounted,reactive} from 'vue';
import { defineProps,watch } from 'vue';



const allrolelist=ref([])
const selectrole=reactive({selectid:"member"})
const props = defineProps({
  modelValue: {
    required: true
  }
})
const emit = defineEmits(['update:modelValue'])

function list_AllRole(){
  allrolelist.value=[
    {label:"组员",value:"member"},
    {label:"组长",value:"leader"},
    {label:"主任",value:"director"},
    {label:"管理员",value:"admin"},
  ]
}

function changeselect(){
    emit('update:modelValue',selectrole.selectid)
}


watch(() => props.modelValue,newValue => {
  for (let i in allrolelist.value){
    if (allrolelist.value[i].value==newValue){
      selectrole.selectid=allrolelist.value[i].value
      break
    }
  }
})




onMounted(list_AllRole)

</script>

<style scoped>



</style>