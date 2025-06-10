<template>
    <el-dialog v-model="centerDialogVisible" title="警告" width="500" center>
      <span style="font-size: 25px;">
        {{state.message}}
      </span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="centerDialogVisible = false" size="large">取消</el-button>
          <el-button type="primary"  size="large" @click="yes(state.action,state.deleteid,state.refresh)">
           确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </template>
  
  <script  setup>
import {ref,reactive,defineExpose,defineProps,watch} from 'vue'
import { eventBus, EVENT_TYPES } from '@/utils/eventBus'
let centerDialogVisible = ref(false)

let state=reactive({
type:'',
message:'',
action:'',
deleteid:'',
centerDialogVisible:false,
refresh:''
})
function openmessagebox(intype,inmessage,inaction,indeleteid,inrefresh){
state.type=intype
state.message=inmessage
state.action=inaction
state.deleteid=indeleteid
state.refresh=inrefresh
centerDialogVisible.value=true
}





defineExpose({openmessagebox})

function yes(action,deleteid,refresh){
if (action!=='close'){                     
action(deleteid).then(
data=>{
    eventBus.emit(refresh)
  }
  )}
centerDialogVisible.value = false
}
</script>