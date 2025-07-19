<template>
<div id="editbox" :style="uiState.editboxstyle1" >
      <div id="topbg"><p>{{uiState.edittoptext}}</p> </div>
      <div id="content1">
        <p>用户名</p>  
        <el-input v-model="formData.username" style="width: 300px" placeholder="用户名"  />
        <p>密码</p>  
        <el-input v-model="formData.password" style="width: 300px" placeholder="密码" />
      </div>
      <div id="content2">
        <p>角色</p>  
        <role_select v-model="formData.role" style="width: 300px" placeholder="角色" />
        <p>团队</p>  
        <team_select v-model="formData.teamid" style="width: 300px" placeholder="团队" />
      </div>
      <div id="editboxbutton">
        <el-button class="button" size="large" type="warning" :style="uiState.editbuttonhide" @click="user_update"  :disabled="uiState.editbox_disablebutton" >修改</el-button>
        <el-button class="button" size="large" type="success" :style="uiState.addbuttonhide" @click="user_add"  :disabled="uiState.editbox_disablebutton">增加</el-button>
        <el-button class="button" size="large" type="info" @click="closeeditbox">取消</el-button>
      </div>
  </div>
<messagebox ref="messageboxRef"></messagebox>
</template>
<script setup>
import { defineExpose, ref, reactive } from 'vue';
import { api_user_add,api_user_update } from '@/api/user.js'
import messagebox from '@/components/messagebox.vue'
import { eventBus, EVENT_TYPES } from '@/utils/eventBus'
import team_select from '@/components/team_select.vue'
import role_select from '@/components/role_select.vue'
// 使用reactive统一管理表单数据
const formData = reactive({
  id:null,
  username: '',
  role:'user',
  teamid:null,
  using:true,
  password:''
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
function openmessagebox(a,b,c){
  messageboxRef.value.openmessagebox(a,b,c)
}

defineExpose({
  openeditbox,
  closeeditbox,
  openaddbox,

})
// 重置表单数据
function resetForm() {
  Object.assign(formData, {
    username: '',
    role:'user',
    teamid:1,
    using:true,
    password:''
  })
}

function openeditbox(editdata) {
  uiState.editboxstyle1.display = "block"
  uiState.blockstyle.display = "block"
  uiState.edittoptext = "修改用户"
  uiState.addbuttonhide.display = "none"
  uiState.editbuttonhide.display = "unset"

  uiState.editbox_allowedit = true
  
  // 使用Object.assign更新表单数据
  Object.assign(formData, {
    id:editdata.id,
    username: editdata.username,
    role: editdata.role,
    teamid: editdata.teamid,
    password: ''

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
  uiState.edittoptext = "增加用户"
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
    required: ['username', 'role', 'teamid']
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

function user_update() {
  api_user_update(formData)
    .then(data => {
      closeeditbox()
      // 触发模板更新事件，通知父组件刷新列表
      eventBus.emit(EVENT_TYPES.USER_UPDATED)
    })
    .catch(err => {
      openmessagebox('error',err.response.data.msg,null)
    })
}
function user_add() {
  api_user_add(formData)
    .then(data => {
      closeeditbox()
      // 触发模板更新事件，通知父组件刷新列表
      eventBus.emit(EVENT_TYPES.USER_UPDATED)
    })
    .catch(err => {
      openmessagebox('error',err.response.data.msg,null)
    })
}
</script>

<style scoped>

#editbox{
  position: absolute;
  z-index: 2;
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