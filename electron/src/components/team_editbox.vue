<template>
<div id="editbox" :style="uiState.editboxstyle1" >
      <div id="topbg"><p>{{uiState.edittoptext}}</p> </div>
      <div id="content1">
        <p>检验小组名称</p>  
        <el-input v-model="formData.name" style="width: 300px" placeholder="检验小组名称"  />
        <p>联系电话</p>  
        <el-input v-model="formData.phone" style="width: 300px" placeholder="填写电话"  />
      </div>
      <div id="content2">
        <p>其他说明</p>  
        <el-input v-model="formData.note" style="width: 300px" placeholder="" />
      </div>
      <div id="editboxbutton">
        <el-button class="button" size="large" type="warning" :style="uiState.editbuttonhide" @click="team_update"  :disabled="uiState.editbox_disablebutton" >修改</el-button>
        <el-button class="button" size="large" type="success" :style="uiState.addbuttonhide" @click="team_add"  :disabled="uiState.editbox_disablebutton">增加</el-button>
        <el-button class="button" size="large" type="info" @click="closeeditbox">取消</el-button>
      </div>
  </div>
<messagebox ref="messageboxRef"></messagebox>
</template>
<script setup>
import { defineExpose, ref, reactive } from 'vue';
import { api_team_update,api_team_add } from '@/api/team.js'
import messagebox from '@/components/messagebox.vue'
import { eventBus, EVENT_TYPES } from '@/utils/eventBus'

// 使用reactive统一管理表单数据
const formData = reactive({
  id:null,
  name: '',
  phone: '',
  note:'',
  using:true,
})




// UI状态管理
const uiState = reactive({
  editboxstyle1: { display: 'none' },
  edittoptext: '',
  editbuttonhide: { display: 'none' },
  addbuttonhide: { display: 'none' },
  editbox_allowedit: true,
  editbox_disablebutton: true,
  blockstyle: { display: 'none' },  
})

let messageboxRef = ref()

defineExpose({
  openeditbox,
  closeeditbox,
  openaddbox,

})
// 重置表单数据
function resetForm() {
  Object.assign(formData, {
    name: '',
    phone: '',
    note:'',
    using:true,
  })
}

function openeditbox(editdata) {
  uiState.editboxstyle1.display = "block"
  uiState.blockstyle.display = "block"
  uiState.edittoptext = "修改检验小组"
  uiState.addbuttonhide.display = "none"
  uiState.editbuttonhide.display = "unset"
  formData.id = editdata.id
  uiState.editbox_allowedit = true
  
  // 使用Object.assign更新表单数据
  Object.assign(formData, {
    id:editdata.id,
    name: editdata.name,
    phone: editdata.phone,
    note: editdata.note
  })
  checkinput()
}

function closeeditbox() {
  uiState.editboxstyle1.display = "none"
  uiState.blockstyle.display = "none"
  resetForm()
}

function openaddbox() {
  resetForm()
  uiState.editboxstyle1.display = "block"
  uiState.blockstyle.display = "block"
  uiState.editbuttonhide.display = "none"
  uiState.addbuttonhide.display = "unset"
  uiState.edittoptext = "增加检验小组"
  uiState.editbox_allowedit = false
  checkinput()
}

/**
 * 检查表单输入是否有效
 * 用于控制修改/增加按钮的禁用状态
 */
function checkinput() {
  // 使用some方法检查必填字段数组中是否存在无效字段
  var validationRules = {
    required: ['name', 'phone']
  }
  const hasEmptyField = validationRules.required.some(field => {
    // 获取当前字段的值
    const value = formData[field]
    
    // 检查字段值是否为null或undefined
    // 不再检查是否为0，因为0是有效值
    return value == null
  })
  
  // 更新按钮禁用状态
  uiState.editbox_disablebutton = hasEmptyField
}

function team_update() {
  api_team_update(formData)
    .then(data => {
      closeeditbox()
      // 触发模板更新事件，通知父组件刷新列表
      eventBus.emit(EVENT_TYPES.TEAM_UPDATED)
    })
    .catch(err => {
      messageboxRef.value.messagebox_warn(err)
    })
}
function team_add() {
  api_team_add(formData)
    .then(data => {
      closeeditbox()
      // 触发模板更新事件，通知父组件刷新列表
      eventBus.emit(EVENT_TYPES.TEAM_UPDATED)
    })
    .catch(err => {
      messageboxRef.value.messagebox_warn(err)
    })
}
</script>

<style scoped>

#editbox{
  position: absolute;
  z-index: 2;
  background-color: rgb(255, 255, 255);
  width: 90vw;
  height: 90vh;
  left:5vw;
  top:5vh;
  box-shadow:5px 5px 10px 1px rgb(0, 0, 0); ;
  border-width: 3px;
  display: none;
}
#editbox #topbg{
  position: absolute;
  z-index: 2;
  width: 90vw;
  background-color: whitesmoke;
  left:0px;
  text-align: center;
}
#editbox #topbg p{
  font-size: 40px;
  font-weight: bolder;
  margin: 20px
}
#editbox #content1 {
  position: absolute;
  z-index: 2;
  font-size: large;
  top: 100px;
  left: 100px;
}
#editbox #content2 {
  position: absolute;
  z-index: 2;
  font-size: large;
  top: 100px;
  right: 100px;
}
#editbox #editboxbutton {
  position: relative;
  z-index: 1;
  top: 90%;
  left:0px;
  text-align: center;
}

</style>