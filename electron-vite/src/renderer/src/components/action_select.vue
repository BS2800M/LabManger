
<template>
<el-select-v2   placeholder="选择动作" v-model="selectaction.selectid" :options="allactionlist" style="width: 250px" @change="changeselect"/>
</template>
<script setup>
import {  ref, onMounted,reactive} from 'vue';
import {watch } from 'vue';



const allactionlist=ref([])
const selectaction=reactive({selectid:0})
const props = defineProps({
  modelValue: {
    required: true
  }
})
const emit = defineEmits(['update:modelValue'])

function list_AllRole(){
  allactionlist.value=[
    {label:"未知",value:0},
    {label:"入库",value:1},
    {label:"出库",value:2},
  ]
}

function changeselect(){
    emit('update:modelValue',selectaction.selectid)
}

function startwatch(){
watch(() => props.modelValue,newValue => {

  for (let i in allactionlist.value){
    if (allactionlist.value[i].value==newValue){
      selectaction.selectid=allactionlist.value[i].value
      break
    }
  }
},
{
  immediate:true
}
)
}




onMounted(()=>{
  list_AllRole()
  startwatch()
})


</script>

<style scoped>



</style>