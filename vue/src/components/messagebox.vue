<template>
  <div>
    <el-dialog :class="type[state.type]" v-model="state.centerDialogVisible" :title="state.title" width="500"   center>
        <span  >
          {{state.message}}
        </span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="state.centerDialogVisible = false" size="large"  v-if="state.cancelVisible">取消</el-button>
          <el-button type="primary"  size="large" @click="state.action">
           确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
  
<script  setup>
import {reactive,defineExpose,onMounted} from 'vue'
import { eventBus, EVENT_TYPES } from '@/utils/eventBus'
let state=reactive({
  type:null,
  message:null,
  action:null,
  centerDialogVisible:false,
  title:'未知',
  cancelVisible:false,
})
const type={
  error:'dialog-error',
  info:'dialog-info',
  confirm:'dialog-confirm',
}
function openmessagebox(intype,intitle,inmessage,inaction){
  state.type=intype
  state.title=intitle
  state.message=inmessage
  state.action=inaction

  if (state.type==='error'){
    state.action=()=>{
      state.centerDialogVisible=false
      state.cancelVisible=false
    }
  }
  if(state.type==='info'){
    state.cancelVisible=false
    state.action=()=>{
      state.centerDialogVisible=false
    }
  }
  if(state.type==='confirm'){
    state.cancelVisible=true
  }
  state.centerDialogVisible=true
}
function closemessagebox(){
  state.centerDialogVisible=false
}
defineExpose({openmessagebox,closemessagebox})
onMounted(() => {
    eventBus.on(EVENT_TYPES.SHOW_MESSAGEBOX,(a)=>{
    openmessagebox(a.type,a.title,a.message,a.action)
  })
    eventBus.on(EVENT_TYPES.CLOSE_MESSAGEBOX,closemessagebox)
})

</script>
<style>

.dialog-error{
  background-color: #d94141;
  border-radius: 15px;
  font-weight: bold;
}
.dialog-error  .el-dialog__body  {
  color: rgb(255, 255, 255);
  font-weight: 350;
}
.dialog-error  .el-dialog__title  {
  color: rgb(255, 255, 255);
}

.dialog-info{
  border-radius: 10px;
  font-weight: bold;
}

.dialog-confirm{
  border-radius: 10px;
  font-weight: bold;
}


</style>