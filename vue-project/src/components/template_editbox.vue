<template>
<div id="editbox" :style="uiState.editboxstyle1" >
      <div id="topbg"><p>{{uiState.edittoptext}}</p> </div>
      <div id="content1">
        <p>试剂名称</p>  
        <el-input v-model="formData.name" style="width: 300px" placeholder="输入试剂的名称"  />
        <p>试剂规格</p>  
        <el-input v-model="formData.specifications" style="width: 300px" placeholder="如：盒 箱 瓶"  />
        <p>试剂设置的初始库存数量</p>  
        <el-input-number  :disabled="uiState.editbox_allowedit" v-model="formData.reagent_initnumber" :min="0" :max="9999" placeholder="0" @change="checkinput"  />
        <p>生成初始批号</p>
        <el-switch v-model="formData.is_generate_lot" :disabled="uiState.editbox_allowedit" size="large" @change="checkinput" />
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
        <p>试剂存放地点</p>  
        <el-input v-model="formData.location" style="width: 300px" placeholder="如：君和 总院" />
      </div>
      <div id="editboxbutton">
        <el-button class="button" size="large" type="warning" :style="uiState.editbuttonhide" @click="modify_Template"  :disabled="uiState.editbox_disablebutton" >修改</el-button>
        <el-button class="button" size="large" type="success" :style="uiState.addbuttonhide" @click=" add_Template"  :disabled="uiState.editbox_disablebutton">增加</el-button>
        <el-button class="button" size="large" type="info" @click="closeeditbox">取消</el-button>
      </div>
  </div>
<messagebox ref="messageboxRef"></messagebox>
</template>
<script setup>
import { defineExpose, ref, reactive } from 'vue';
import { api_modify_Template, api_add_Template } from '@/api/reagent_manger.js'
import messagebox from '@/components/messagebox.vue'
import { eventBus, EVENT_TYPES } from '@/utils/eventBus'

// 使用reactive统一管理表单数据
const formData = reactive({
  name: '',
  specifications: '',
  reagent_initnumber: 0,
  warn_number: 0,
  price: 0,
  creation_time: '',
  location: '',
  seleteid: null,
  warn_days: 0,
  is_generate_lot: false
})

// 验证规则配置对象
const validationRules = {
  // 定义必填字段数组，包含需要验证的字段名
  required: ['reagent_initnumber', 'warn_number', 'price', 'warn_days']
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
  is_generate_lot: false
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
    specifications: '',
    reagent_initnumber: 0,
    warn_number: 0,
    price: 0,
    creation_time: '',
    location: '',
    seleteid: null,
    warn_days: 0,
    is_generate_lot: false
  })
}

function openeditbox(editdata) {
  uiState.editboxstyle1.display = "block"
  uiState.blockstyle.display = "block"
  uiState.edittoptext = "修改试剂模板"
  uiState.addbuttonhide.display = "none"
  uiState.editbuttonhide.display = "unset"
  formData.seleteid = editdata.id
  uiState.editbox_allowedit = true
  
  // 使用Object.assign更新表单数据
  Object.assign(formData, {
    name: editdata.name,
    specifications: editdata.specifications,
    reagent_initnumber: editdata.reagent_initnumber,
    warn_number: editdata.warn_number,
    price: editdata.price,
    creation_time: editdata.creation_time,
    location: editdata.location,
    warn_days: editdata.warn_days
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

/**
 * 检查表单输入是否有效
 * 用于控制修改/增加按钮的禁用状态
 */
function checkinput() {
  // 使用some方法检查必填字段数组中是否存在无效字段
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

function modify_Template() {
  const { name, specifications, reagent_initnumber, warn_number, price, location, warn_days} = formData
  api_modify_Template(formData.seleteid, name, specifications, reagent_initnumber, warn_number, price, location, warn_days)
    .then(data => {
      closeeditbox()
      // 触发模板更新事件，通知父组件刷新列表
      eventBus.emit(EVENT_TYPES.TEMPLATE_UPDATED)
    })
    .catch(err => {
      messageboxRef.value.messagebox_warn(err)
    })
}
function add_Template() {
  const { name, specifications, reagent_initnumber, warn_number, price, location, warn_days,is_generate_lot} = formData
  api_add_Template(name, specifications, reagent_initnumber, warn_number, price, location, warn_days,is_generate_lot)
    .then(data => {
      closeeditbox()
      // 触发模板更新事件，通知父组件刷新列表
      eventBus.emit(EVENT_TYPES.TEMPLATE_UPDATED)
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