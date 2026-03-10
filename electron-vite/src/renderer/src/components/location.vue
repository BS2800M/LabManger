<template>
    <div id="background" >
      <div id="background2">
        <el-input 
          style="left:200px;top:10px;width:250px;" 
          v-model="state.name" 
          placeholder="搜索位置名称" 

          @input="location_show" 
        />
        <el-pagination 
          background  
          layout="prev, pager, next"  
          v-model:current-page="state.page" 
          :page-count="state.totalpage" 
          @change="location_show" 
          style="position: absolute;left: 200px;top: 50px;"
        />
        <div class="button-container">
          <el-button 
            id="add" 
            type="success" 
            @click="add_drawer"
          >增加位置</el-button>

          <el-button 
            id="update" 
            type="primary" 
            @click="edit_drawer"
          >修改位置</el-button>

          <el-button 
            id="delete" 
            type="danger" 
            v-if="get_permission('reagent_delete')"
            @click="eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX,{type:'delete',message:'是否删除',action:()=>location_del(formData.id)})"
          >删除位置</el-button>
          
      </div>
      </div>
        <el-table
          ref="tableRef"
          highlight-current-row
          @row-click="handleRowClick"
          :data="state.tableData"
          :default-sort="{ prop: 'date', order: 'descending' }"
          :style="{width:'calc(100vw - 205px)'}"
          header-cell-class-name="normal-row-header"
          :row-class-name="tableRowClassName"
         
        >
          <el-table-column prop="id" label="ID" min-width="80" show-overflow-tooltip/>
          <el-table-column prop="team.name" label="团队名称" min-width="100" show-overflow-tooltip/>
          <el-table-column prop="name" label="位置名称" min-width="100" show-overflow-tooltip/>
          <el-table-column prop="note" label="备注" min-width="50" show-overflow-tooltip/>
          <el-table-column prop="lastUploadTime" :formatter="formatDateColumn" label="最后上传时间" min-width="120" show-overflow-tooltip/>
          <el-table-column prop="lastUploadTemperature" label="最后上传温度" min-width="80" show-overflow-tooltip/>
          <el-table-column prop="lastUploadHumidity" label="最后上传湿度" min-width="80" show-overflow-tooltip/>
        </el-table>
    </div>


    <el-drawer v-model="state.drawer" direction="rtl" size="60%" >
      <template #header>
      <span >位置模板</span>
    </template>
      <template #footer>
      <div style="flex: auto">
        <el-button  size="large" type="warning" v-show="state.updatebutton_show"   @click="location_update"  :disabled="state.updatebutton_disable" >修改</el-button>
        <el-button  size="large" type="success" v-show="state.addbutton_show"  @click="location_add"  :disabled="state.addbutton_disable">增加</el-button>
        <el-button  size="large" type="primary"  @click="state.drawer=false">关闭</el-button>
      </div>
    </template>
    <template #default>
      <div id="content1">
        <p>位置名称</p>  
        <el-input v-model="formData.name" @input="checkinput" style="width: 300px" placeholder="输入位置的名称"  />
        <p>备注</p>  
        <el-input v-model="formData.note" style="width: 300px" placeholder="如：备注"  />
        <p>最大温度</p>  
        <el-input-number v-model="formData.maxTemperature" :min="-100" :max="100" step="0.1" placeholder="0" @change="checkinput" />
        <p>最小温度</p>  
        <el-input-number v-model="formData.minTemperature" :min="-100" :max="100" step="0.1" placeholder="0" @change="checkinput" />
        <p>最大湿度</p>  
        <el-input-number v-model="formData.maxHumidity" :min="0" :max="100" step="0.1" placeholder="0" @change="checkinput" />
        <p>最小湿度</p>  
        <el-input-number v-model="formData.minHumidity" :min="0" :max="100" step="0.1" placeholder="0" @change="checkinput" />
      </div>
      <div id="content2" style="position: absolute;left: 400px;top: 120px;">
        <p>是否启用</p>
        <el-switch v-model="formData.status" size="large" @change="checkinput" />
        <p>上传间隔(分钟)</p>  
        <el-input-number v-model="formData.uploadIntervalMinutes" :min="10" :max="1000" placeholder="0" @change="checkinput" />
      </div>
    </template>
    </el-drawer>
</template>
<script setup>
import {  onMounted, reactive,ref } from 'vue'
import { api_location_show, api_location_del, api_location_update, api_location_add } from '@/api/location'
import { eventBus, EVENT_TYPES } from '@/utils/eventBus'
import { formatDateColumn} from '@/utils/format'
import get_permission from '@/utils/permission'

// 状态管理
const state = reactive({
  name: '',    // 输入搜索名称
  tableData: [],         // 表格数据，初始化为空数组
  page: 1,       // 当前页
  totalpage: 1,        // 总页
  drawer:false, 
  editbox_allowedit:false,
  updatebutton_disable:true,
  addbutton_disable:true,
  addbutton_show:false,
  updatebutton_show:false,
  editbox_disablegeneratelot:false,
})

const formData = reactive({
  name: '',
  note: '',
  uploadIntervalMinutes: 0,
  maxTemperature: 0,
  minTemperature: 0,
  maxHumidity: 0,
  minHumidity: 0,
  status: true,
})
const tableRef = ref(null)
function handleRowClick(row, column, event) {
  if(formData.id===row.id){
    formData.id=null
    formData.name=''
    formData.note=''
    formData.uploadIntervalMinutes=0
    formData.maxTemperature=7
    formData.minTemperature=1
    formData.maxHumidity=99
    formData.minHumidity=1
    formData.status=true
    tableRef.value.setCurrentRow(null)
  }
  else{
    formData.id=row.id
    formData.name=row.name
    formData.note=row.note
    formData.uploadIntervalMinutes=row.uploadIntervalMinutes
    formData.maxTemperature=row.maxTemperature
    formData.minTemperature=row.minTemperature
    formData.maxHumidity=row.maxHumidity
    formData.minHumidity=row.minHumidity
    formData.status=row.status===0?true:false
  }

}

function tableRowClassName({ row,rowindex }) { // 表格行样式
  if (row.status===0 ) {
    if (row.warningTemperature===false && row.warningHumidity===false && row.warningUploadTime===false ){
      return 'normal-row'
    }
    else{
      return 'warning-row'
    }
  }
  else if (row.status===1 ) {
    return 'unactive-row'
  }
}

async function add_drawer(){
  tableRef.value.setCurrentRow(null)
  state.addbutton_disable=true
  state.addbutton_show=true
  state.updatebutton_show=false
  state.editbox_disablegeneratelot=false
  formData.name=""
  formData.note=""
  formData.uploadIntervalMinutes=0
  formData.maxTemperature=7
  formData.minTemperature=1
  formData.maxHumidity=99
  formData.minHumidity=1
  formData.status=true
  state.drawer=true

}

async function edit_drawer(){
  if(formData.id){
  state.updatebutton_disable=false
  state.addbutton_disable=true
  state.addbutton_show=false
  state.updatebutton_show=true
  state.editbox_disablegeneratelot=true
  state.drawer=true
  }
  else{
    eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX,{type:'error',message:'请选择要修改的记录'})
  }
}

function checkinput() {
  const validationRules = {
  // 定义必填字段数组，包含需要验证的字段名
  required: ['name', 'uploadIntervalMinutes', 'maxTemperature', 'minTemperature', 'maxHumidity', 'minHumidity']
}
// 使用some方法检查必填字段数组中是否存在无效字段
const hasEmptyField = validationRules.required.some(field => {
  const value = formData[field]
  return value == null || value === ''
})
// 更新按钮禁用状态   
state.updatebutton_disable = hasEmptyField
state.addbutton_disable = hasEmptyField
}


async function location_show() {
    const data = await api_location_show(state)
    state.tableData = data.data
    state.totalpage = data.meta.totalPage
}
async function location_del(id){
  if(formData.id){
    await api_location_del(formData.id)
    await location_show()
    eventBus.emit(EVENT_TYPES.CLOSE_MESSAGEBOX)
  }
  else{
    eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX,{type:'error',message:'请选择要删除的记录'})
  }
}

async function location_update() {
  formData.status=formData.status?0:1
  await api_location_update(formData)
  state.drawer = false
  await location_show()
  formData.id=null
}
async function location_add() {
  formData.status=formData.status?0:1
  await api_location_add(formData)
  state.drawer = false
  await location_show()
}

// 生命周期钩子
onMounted(async () => {
    await location_show()
})


</script >
<style scoped>

#background2{
  height: 90px;
}
.el-table{
  position: absolute;
  left: 200px;
  top: 100px;
}
.button-container {
  position: absolute;
  left: 800px;
  top: 50px;
  display: flex;
  gap: 10px;  /* 统一间距 */
}
</style>










