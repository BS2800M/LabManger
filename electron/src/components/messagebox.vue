<template>
    <el-dialog v-model="centerDialogVisible" title="警告" width="500" center>
      <span style="font-size: 25px;">
        {{state.message}}
      </span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="centerDialogVisible = false" size="large">取消</el-button>
          <el-button type="primary"  size="large" @click="state.action">
           确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </template>
  
  <script  setup>
import {ref,reactive,defineExpose,defineProps,watch} from 'vue'
let centerDialogVisible = ref(false)

let state=reactive({
type:null,
message:null,
action:null,
centerDialogVisible:false,
})
function openmessagebox(intype,inmessage,action){
state.type=intype
state.message=inmessage
state.action=action
centerDialogVisible.value=true
if (state.type==='error'){
  state.action=()=>{
    centerDialogVisible.value=false
  }
}
}


function closemessagebox(){
  centerDialogVisible.value=false
}


defineExpose({openmessagebox,closemessagebox})


</script>