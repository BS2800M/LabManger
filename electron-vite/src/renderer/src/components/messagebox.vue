<template>
  <div>
    <el-dialog v-model="centerDialogVisible" :title="state.title" width="500"  id="dialog" center>
        <span style="font-size: 20px; color: white;">
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
  </div>
</template>
  
  <script  setup>
import {ref,reactive,defineExpose,onMounted,onUnmounted} from 'vue'
let centerDialogVisible = ref(false)
import { eventBus, EVENT_TYPES } from '@/utils/eventBus'
let state=reactive({
type:null,
message:null,
action:null,
centerDialogVisible:false,
title:'警告',
})
function openmessagebox(intype,inmessage,action){
state.type=intype
state.message=inmessage
state.action=action
centerDialogVisible.value=true
if (state.type==='error'){
  state.title='错误'
  state.action=()=>{
    centerDialogVisible.value=false
  }
}
}
function closemessagebox(){
  centerDialogVisible.value=false
}
defineExpose({openmessagebox,closemessagebox})
onMounted(() => {
    eventBus.on(EVENT_TYPES.SHOW_MESSAGEBOX,(a)=>{
    openmessagebox(a.type,a.message,a.action)
  })
    eventBus.on(EVENT_TYPES.CLOSE_MESSAGEBOX,closemessagebox)
})

</script>
<style>
#dialog{
  background-color: rgb(94, 53, 53);
}
</style>