<template>
<div id="editbox" :style="uiState.editboxstyle1" >
      <div id="topbg"><p>{{uiState.edittoptext}}</p> </div>
      <div id="content1">
        <p>批号数字</p>  
        <el-input v-model="formData.name" style="width: 300px" placeholder="输入批号"  />
        <p>批号有效期</p>  
        <el-config-provider :locale=zhCn> 
          <el-date-picker 
            v-model="formData.expiration_date" 
            type="date" 
            placeholder="选择日期" 
            size="default" 
            @change="checkinput" 
            value-format="YYYY-MM-DD 23:59:59"
          />   
        </el-config-provider>
        <p>所属试剂名字</p>  
        <el-select-v2  v-model="formData.seletevalue" filterable :options="allreagentlist" placeholder="选择试剂" @change="checkinput" :disabled="uiState.editbox_disable_selete" style="width: 240px"  />
        <p>所属试剂id</p>  
        <el-input v-model="formData.reagentid" style="width: 300px" @change="checkinput" disabled  />
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
import {ref,defineExpose,reactive} from 'vue'
import {api_lot_update,api_lot_add} from '@/api/lot'
import {api_reagent_showall} from '@/api/reagent'
import { eventBus, EVENT_TYPES } from '@/utils/eventBus'
import { format_iso_YYYYMMDDHHmm,format_YYYYMMDDHHmm_iso } from '@/api/dateformat'
// 使用reactive统一管理表单数据
const formData = reactive({
  name: '',                    // 批号数字  
  expiration_date: null,      // 批号有效期
  reagent_id: null,          // 所属试剂id
  creation_time: '',         // 创建时间
  seletevalue: null,         // 选择的试剂值
  id: null  ,           // 选中的批号id
  using:true,
  reagentid:null,
  reagentname:''
})

// 验证规则配置对象
const validationRules = {
  // 定义必填字段数组
  required: ['name', 'expiration_date', 'reagentid']
}

// UI状态管理
const uiState = reactive({
  editboxstyle1: { display: 'none' },
  edittoptext: '',
  editbuttonhide: { display: 'none' },
  addbuttonhide: { display: 'none' },
  editbox_allowedit: true,
  editbox_disablebutton: true,
  editbox_disable_selete:false,
  blockstyle: { display: 'none' }
})

// 试剂列表数据
const allreagentlist = ref([])

// 其他必要的ref

let messageboxRef = ref()


function openmessagebox(a,b,c){
  messageboxRef.value.openmessagebox(a,b,c)
}



defineExpose({
openeditbox,
closeeditbox,
openaddbox,
});


function resetForm(){
  Object.assign(formData, {
    name: '',
    expiration_date: null,
    reagentid: null,
  })
}



function openeditbox(editdata){
  uiState.editboxstyle1.display = "block"
  uiState.blockstyle.display = "block"
  uiState.edittoptext = "修改试剂批号"
  uiState.addbuttonhide.display = "none"
  uiState.editbuttonhide.display = "unset"
  formData.id = editdata.id
  uiState.editbox_allowedit = true
  uiState.editbox_disable_selete = true

  // 更新表单数据
  Object.assign(formData, {
    name: editdata.name,
    expiration_date: editdata.expiration_date,
    creation_time: format_iso_YYYYMMDDHHmm(editdata.creation_time),
    reagentid: editdata.reagentid,
    using:editdata.using
  })

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
  list_allreagent()
  formData.creation_time = "创建后自动添加"
  uiState.editboxstyle1.display = "block"
  uiState.blockstyle.display = "block"
  uiState.editbuttonhide.display = "none"
  uiState.addbuttonhide.display = "unset"
  uiState.edittoptext = "增加试剂批号"
  uiState.editbox_allowedit = false
  uiState.editbox_disable_selete = false
  checkinput()
}

function checkinput(){
  // 如果选择了试剂，更新formdata中的选择的试剂对应的id
  if (formData.seletevalue != null) {
    formData.reagentid = allreagentlist.value[formData.seletevalue].id
  }

  // 检查必填字段
  const hasEmptyField = validationRules.required.some(field => {
    const value = formData[field]
    return value == null || value === ''
  })
  uiState.editbox_disablebutton = hasEmptyField
}

function modify_lot(){
  formData.expiration_date=format_YYYYMMDDHHmm_iso(formData.expiration_date)
  api_lot_update(formData)
    .then(data => {
      closeeditbox()
      eventBus.emit(EVENT_TYPES.LOT_UPDATED)
    })
    .catch(err => {
      openmessagebox('error',err.response.data.msg,null)
    })
}

function add_lot(){
  formData.expiration_date=format_YYYYMMDDHHmm_iso(formData.expiration_date)
  api_lot_add(formData)
  .then(data=>{
    closeeditbox()
    eventBus.emit(EVENT_TYPES.LOT_UPDATED)
 } )
  .catch(err=>{
    openmessagebox('error',err.response.data.msg,null)
                })
}

function list_allreagent(){
  api_reagent_showall()
  .then(data=>{
            allreagentlist.value=[]
            let i=""
            for (i in data.data.data){
              allreagentlist.value.push({
                label:data.data.data[i].name,
                value:i,
                id:data.data.data[i].id,
              })
            }
        } )
  .catch(err=>{
    openmessagebox('error',err.response.data.msg,null)
                })
}



</script>
<style scoped>
#editbox{
  position: absolute;
  z-index: 2;
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
  background-color:  rgb(53, 73, 94);
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