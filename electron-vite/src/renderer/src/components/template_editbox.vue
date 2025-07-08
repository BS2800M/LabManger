<template>
<div id="editbox" :style="uiState.editboxstyle1" >
      <div id="topbg"><p>{{uiState.edittoptext}}</p> </div>
      <div id="content1">
        <p>试剂名称</p>  
        <el-input v-model="formData.name" style="width: 300px" placeholder="输入试剂的名称"  />
        <p>试剂规格</p>  
        <el-input v-model="formData.specifications" style="width: 300px" placeholder="如：盒 箱 瓶"  />
        <p>试剂的储存环境</p>  
        <el-input v-model="formData.storge_condition" style="width: 300px" placeholder="如：常温 冷藏 冷冻"  />
        <p>生成初始批号</p>
        <el-switch v-model="formData.generate_lot" :disabled="uiState.editbox_allowedit" size="large" @change="checkinput" />
      </div>
      <div id="content2">
        <p>预警数量</p>  
        <el-input-number v-model="formData.warn_number" :min="0" :max="9999" placeholder="0" @change="checkinput" />
        <p>预警天数</p>  
        <el-input-number v-model="formData.warn_days" :min="0" :max="9999" placeholder="0" @change="checkinput" />
        <p>价格</p>  
        <el-input-number v-model="formData.price" :min="0" :max="99999999" placeholder="0" @change="checkinput"/>
        <p>创建时间</p>  
        <el-input disabled v-model="formData.creation_time" style="width: 300px" placeholder="系统自动生成" />
      </div>
      <div id="editboxbutton">
        <el-button class="button" size="large" type="warning" :style="uiState.editbuttonhide" @click="reagent_update"  :disabled="uiState.editbox_disablebutton" >修改</el-button>
        <el-button class="button" size="large" type="success" :style="uiState.addbuttonhide" @click="reagent_add"  :disabled="uiState.editbox_disablebutton">增加</el-button>
        <el-button class="button" size="large" type="info" @click="closeeditbox">取消</el-button>
      </div>
  </div>
  <messagebox ref="messageboxRef"  ></messagebox>
</template>
<script setup>
import { defineExpose, ref, reactive } from 'vue';
import { api_reagent_update, api_reagent_add } from '@/api/reagent'
import messagebox from '@/components/messagebox.vue'
import { eventBus, EVENT_TYPES } from '@/utils/eventBus'
import { format_iso_YYYYMMDDHHmm } from '@/api/dateformat'
const messageboxRef=ref(null)
function openmessagebox(a,b,c){
  messageboxRef.value.openmessagebox(a,b,c)
}


// 使用reactive统一管理表单数据
const formData = reactive({
  name: '',
  specifications: '',
  storage_condition: '',
  warn_number: 0,
  price: 0,
  creation_time: '',
  id: null,
  warn_days: 0,
  generate_lot: false,
  using:true
})
// 验证规则配置对象
const validationRules = {
  // 定义必填字段数组，包含需要验证的字段名
  required: ['name', 'specifications', 'storage_condition', 'warn_number', 'price', 'warn_days']
}

// UI状态管理
const uiState = reactive({
  editboxstyle1: { display: 'none' },
  edittoptext: '',
  editbuttonhide: { display: 'none' },
  addbuttonhide: { display: 'none' },
  editbox_allowedit: true,
  editbox_disablebutton: true,
  blockstyle: { display: 'none' },
  generate_lot: false
})

defineExpose({
  openeditbox,
  closeeditbox,
  openaddbox,

})

// 重置表单数据
function resetForm() {
  Object.assign(formData, {
    name: '',
    specifications: '',
    storage_condition: '',
    warn_number: 0,
    price: 0,
    creation_time: '',
    warn_days: 0,
    generate_lot: false,
  })
}

function openeditbox(editdata) {
  uiState.editboxstyle1.display = "block"
  uiState.blockstyle.display = "block"
  uiState.edittoptext = "修改试剂模板"
  uiState.addbuttonhide.display = "none"
  uiState.editbuttonhide.display = "unset"
  uiState.editbox_allowedit = true
  
  // 使用Object.assign更新表单数据
  Object.assign(formData, {
    id:editdata.id,
    name: editdata.name,
    specifications: editdata.specifications,
    storge_condition: editdata.storge_condition,
    warn_number: editdata.warn_number,
    price: editdata.price,
    creation_time: format_iso_YYYYMMDDHHmm(editdata.creation_time),
    warn_days: editdata.warn_days,
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
  formData.creation_time = "创建后自动添加"
  uiState.editboxstyle1.display = "block"
  uiState.blockstyle.display = "block"
  uiState.editbuttonhide.display = "none"
  uiState.addbuttonhide.display = "unset"
  uiState.edittoptext = "增加试剂模板"
  uiState.editbox_allowedit = false
  checkinput()
}


function checkinput() {

  // 使用some方法检查必填字段数组中是否存在无效字段
  const hasEmptyField = validationRules.required.some(field => {
    const value = formData[field]
    return value == null
  })
  // 更新按钮禁用状态   
  uiState.editbox_disablebutton = hasEmptyField
}

function reagent_update() {
  api_reagent_update(formData)
    .then(data => {
      closeeditbox()
      // 触发模板更新事件，通知父组件刷新列表
      eventBus.emit(EVENT_TYPES.TEMPLATE_UPDATED)
    })
    .catch(err => {
      openmessagebox('error',err.response.data.msg,null)
    })
}
function reagent_add() {
  api_reagent_add(formData)
    .then(data => {
      closeeditbox()
      // 触发模板更新事件，通知父组件刷新列表
      eventBus.emit(EVENT_TYPES.TEMPLATE_UPDATED)
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