<template>
<div id="editbox" :style="uiState.editboxstyle1" >
      <div id="topbg"><p>{{uiState.edittoptext}}</p> </div>
      <div id="content1">
        <p>批号数字</p>  
        <el-input v-model="formData.lot" style="width: 300px" placeholder="输入批号"  />
        <p>批号有效期</p>  
        <el-config-provider :locale=zhCn> <el-date-picker v-model="formData.Expiration_date" type="date"placeholder="选择日期" size="default" @change="checkinput" value-format="YYYY-MM-DD"/>   </el-config-provider>
        <p>所属试剂名字</p>  
        <el-select-v2  v-model="formData.seletevalue" filterable :options="allreagentlist" placeholder="选择试剂" @change="checkinput" :disabled="uiState.editbox_allowselete" style="width: 240px"  />
        <p>所属试剂id</p>  
        <el-input v-model="formData.reagent_id" style="width: 300px" @change="checkinput" disabled  />
        <p>所属试剂地点</p>  
        <el-input v-model="formData.reagent_location" style="width: 300px" @change="checkinput" disabled  />
      </div>
      <div id="content2">
        <p>创建时间</p>  
        <el-input disabled v-model="formData.creation_time" style="width: 300px"  />
      </div>
        <div id="editboxbutton">
          <el-button class="button" size="large" type="warning" :style="uiState.editbuttonhide" @click="modify_lot"  :disabled="uiState.editbox_disablebutton">修改</el-button>
          <el-button class="button" size="large" type="success" :style="uiState.addbuttonhide" @click="add_lot"  :disabled="uiState.editbox_disablebutton">增加</el-button>
          <el-button class="button" size="large" type="info" @click="closeeditbox">取消</el-button>
        </div>
  </div>
  <messagebox ref="messageboxRef"></messagebox>
</template>

<script setup>
import messagebox from './messagebox.vue'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import {ref,onMounted,defineExpose,reactive} from 'vue'
import {api_list_alltemplate,api_modify_lot,api_add_lot} from '@/api/reagent_manger'
import { eventBus, EVENT_TYPES } from '@/utils/eventBus'

// 使用reactive统一管理表单数据
const formData = reactive({
  lot: '',                    // 批号数字
  Expiration_date: null,      // 批号有效期
  reagent_id: null,          // 所属试剂id
  reagent_location: '',      // 所属试剂地点
  creation_time: '',         // 创建时间
  seletevalue: null,         // 选择的试剂值
  seleteid: null             // 选中的批号id
})

// 验证规则配置对象
const validationRules = {
  // 定义必填字段数组
  required: ['lot', 'Expiration_date', 'reagent_id']
}

// UI状态管理
const uiState = reactive({
  editboxstyle1: { display: 'none' },
  edittoptext: '',
  editbuttonhide: { display: 'none' },
  addbuttonhide: { display: 'none' },
  editbox_allowedit: true,
  editbox_disablebutton: true,
  editbox_allowselete: false,
  blockstyle: { display: 'none' }
})

// 试剂列表数据
const allreagentlist = ref([])

// 其他必要的ref

let messageboxRef = ref()

defineExpose({
openeditbox,
closeeditbox,
openaddbox,
});

onMounted(list_alltemplate)

function openeditbox(editdata){
  uiState.editboxstyle1.display = "block"
  uiState.blockstyle.display = "block"
  uiState.edittoptext = "修改试剂批号"
  uiState.addbuttonhide.display = "none"
  uiState.editbuttonhide.display = "unset"
  formData.seleteid = editdata.id
  uiState.editbox_allowedit = true
  
  // 更新表单数据
  Object.assign(formData, {
    lot: editdata.lot,
    Expiration_date: editdata.Expiration_date,
    creation_time: editdata.creation_time,
    reagent_id: editdata.reagent_id
  })

  // 设置试剂选择
  const buffer = allreagentlist.value.find((item) => item.id == formData.reagent_id)
  if (buffer == undefined) {
    uiState.editbox_allowselete = true
  } else {
    formData.seletevalue = buffer.value
    uiState.editbox_allowselete = false
  }
  
  checkinput()
}
function closeeditbox()
{
  uiState.editboxstyle1.display = "none"
  uiState.blockstyle.display = "none"
  resetForm()
}

function openaddbox(){
  resetForm()
  formData.creation_time = "创建后自动添加"
  uiState.editboxstyle1.display = "block"
  uiState.blockstyle.display = "block"
  uiState.editbuttonhide.display = "none"
  uiState.addbuttonhide.display = "unset"
  uiState.edittoptext = "增加试剂批号"
  uiState.editbox_allowedit = false
  checkinput()
}

function checkinput(){
  // 如果选择了试剂，更新相关字段
  if (formData.seletevalue != null) {
    formData.reagent_id = allreagentlist.value[formData.seletevalue].id
    formData.reagent_location = allreagentlist.value[formData.seletevalue].location
  }

  // 检查必填字段
  const hasEmptyField = validationRules.required.some(field => {
    const value = formData[field]
    return value == null || value === ''
  })
  uiState.editbox_disablebutton = hasEmptyField
}

function modify_lot(){
  const { reagent_id, lot, Expiration_date } = formData
  api_modify_lot(formData.seleteid, reagent_id, lot, Expiration_date)
    .then(data => {
      closeeditbox()
      eventBus.emit(EVENT_TYPES.LOT_UPDATED)
    })
    .catch(err => {
      messageboxRef.value.messagebox_warn(err)
    })
}

function add_lot(){
  api_add_lot(formData.reagent_id,formData.lot,formData.Expiration_date)
  .then(data=>{
    closeeditbox()
    eventBus.emit(EVENT_TYPES.LOT_UPDATED)
 } )
  .catch(err=>{
    messageboxRef.value.messagebox_warn(err)
                })
}

function list_alltemplate(){
  api_list_alltemplate()
  .then(data=>{
            let i=""
            for (i in data.data.list){
              allreagentlist.value.push({
                label:data.data.list[i].name,
                value:i,
                id:data.data.list[i].id,
                location:data.data.list[i].location
              })
            }
        } )
  .catch(err=>{
    messageboxRef.value.messagebox_warn(err)
                })
}

function resetForm() {
  Object.assign(formData, {
    lot: '',
    Expiration_date: null,
    reagent_id: null,
    reagent_location: '',
    creation_time: '',
    seletevalue: null,
    seleteid: null
  })
}

</script>
<style scoped>
#editbox{
  position: absolute;
  z-index: 2;
  background-color: rgb(255, 255, 255);
  width: 90vw;
  height: 80vh;
  left: 5vw;
  top: 10vh;
  box-shadow:5px 5px 10px 1px rgb(0, 0, 0);
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
  z-index: 1;
  font-size: large;
  top: 100px;
  left: 100px;
}
#editbox #content2 {
  position: absolute;
  z-index: 1;
  font-size: large;
  top: 100px;
  right:150px;
}
#editbox #editboxbutton {
  position: relative;
  z-index: 1;
  top: 90%;
  left:0px;
  text-align: center;
}

</style>