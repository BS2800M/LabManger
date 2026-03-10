<template>
    <div id="background" >
      <div id="background2">
        <el-input 
          style="left:200px;top:10px;width:250px;" 
          v-model="state.locationName" 
          placeholder="搜索位置名称" 

          @input="sensorRecord_show" 
        />
        <el-config-provider :locale="zhCn">
                <el-date-picker 
                    v-model="state.startTime" 
                    style="left:220px;top:10px;width:150px;" 
                    type="date"
                    placeholder="选择开始日期" 
                    size="default" 
                    @change="sensorRecord_show" 
                    value-format="YYYY-MM-DD 00:00:01"
                />
            </el-config-provider>
            <el-config-provider :locale="zhCn">
                <el-date-picker 
                    v-model="state.endTime" 
                    style="left:230px;top:10px;width:150px;" 
                    type="date"
                    placeholder="选择结束日期" 
                    size="default" 
                    @change="sensorRecord_show" 
                    value-format="YYYY-MM-DD 23:59:59"
                />
            </el-config-provider>
        <el-pagination 
          background  
          layout="prev, pager, next"  
          v-model:current-page="state.page" 
          :page-count="state.totalpage" 
          @change="sensorRecord_show" 
          style="position: absolute;left: 200px;top: 50px;"
        />
        <div class="button-container">
          <el-button 
            id="add" 
            type="success" 
            @click="add_drawer"
          >增加记录</el-button>

          <el-button 
            id="update" 
            type="primary" 
            @click="edit_drawer"
          >修改记录</el-button>
          <el-button 
            id="delete" 
            type="danger" 
            v-if="get_permission('reagent_delete')"
            @click="eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX,{type:'delete',message:'是否删除',action:()=>sensorRecord_del(formData.id)})"
          >删除记录</el-button>
        </div>
        <div class="export-button-container"> <el-button 
            id="export"
            type="primary" 
            @click="handleExport"
          >导出记录</el-button></div>

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
          <el-table-column prop="location.name" label="位置名称" min-width="150" show-overflow-tooltip/>
          <el-table-column prop="temperature" label="温度" min-width="100" show-overflow-tooltip/>
          <el-table-column prop="humidity" label="湿度" min-width="100" show-overflow-tooltip/>
          <el-table-column prop="team.name" label="团队名称" min-width="100" show-overflow-tooltip/>
          <el-table-column prop="createTime" label="创建时间" :formatter="formatDateColumn" min-width="100" show-overflow-tooltip/>

        </el-table>
    </div>


    <el-drawer v-model="state.drawer" direction="rtl" size="60%" >
      <template #header>
      <span >记录模板</span>
    </template>
      <template #footer>
      <div style="flex: auto">
        <el-button  size="large" type="warning" v-show="state.updatebutton_show"   @click="sensorRecord_update"  :disabled="state.updatebutton_disable" >修改</el-button>
        <el-button  size="large" type="success" v-show="state.addbutton_show"  @click="sensorRecord_add"  :disabled="state.addbutton_disable">增加</el-button>
        <el-button  size="large" type="primary"  @click="state.drawer=false">关闭</el-button>
      </div>
    </template>
    <template #default>
      <div id="content1">
        <p>位置名称</p>  
        <el-select-v2 v-model="formData.seletevalue" filterable :options="locationOptions" placeholder="选择位置" @change="checkinput" style="width: 300px"  />
        <p>温度</p>  
        <el-input-number v-model="formData.temperature" :min="-100" :max="100" :step="0.1" placeholder="0" @change="checkinput" />
        <p>湿度</p>  
        <el-input-number v-model="formData.humidity" :min="0" :max="100" :step="0.1" placeholder="0" @change="checkinput" />
        <p>创建时间</p>  
        <ElConfigProvider :locale=zhCn>
          <el-date-picker v-model="formData.createTime" type="datetime" placeholder="选择创建时间" @change="checkinput" value-format="YYYY-MM-DD HH:mm:ss" />
        </ElConfigProvider>
      </div>
    </template>
    </el-drawer>
</template>
<script setup>
import { sensorRecord_exporttoexcel_list } from '@/utils/exportexcel.js'
import {  onMounted, reactive,ref } from 'vue'
import { api_sensorRecord_show, api_sensorRecord_add, api_sensorRecord_update, api_sensorRecord_del,api_sensorRecord_showAll } from '@/api/sensorRecord'
import { api_location_showAll } from '@/api/location'
import { format_YYYYMMDDHHmm_iso } from '@/utils/format'
import { eventBus, EVENT_TYPES } from '@/utils/eventBus'
import { formatDateColumn, getnowtime_previousmonth, getnowtime } from '@/utils/format'
import get_permission from '@/utils/permission'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
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
  startTime: getnowtime_previousmonth(),
  endTime: getnowtime(),
})
const locationOptions = ref([])
const formData = reactive({
  locationId: '',
  temperature: 0,
  humidity: 0,
  createTime: '',
  seletevalue:null,
})
const tableRef = ref(null)
function handleRowClick(row, column, event) {
  if(formData.id===row.id){
    formData.id=null
    formData.locationId=''
    formData.temperature=0
    formData.humidity=0
    formData.createTime=''
    formData.seletevalue=null
    tableRef.value.setCurrentRow(null)
  }
  else{
    formData.id=row.id
    formData.locationId=row.locationId
    formData.temperature=row.temperature
    formData.humidity=row.humidity
    formData.createTime=row.createTime
  }

}

function tableRowClassName({ row,rowindex }) { // 表格行样式
  return 'normal-row'
}

async function add_drawer(){
  tableRef.value.setCurrentRow(null)
  formData.seletevalue=null
  state.addbutton_disable=true
  state.addbutton_show=true
  state.updatebutton_show=false
  state.editbox_disablegeneratelot=false
  formData.locationId=""
  formData.note=""
  formData.temperature=0
  formData.humidity=0
  formData.createTime=''
  state.drawer=true

}

async function edit_drawer(){
  if(formData.id){
  state.updatebutton_disable=false
  state.addbutton_disable=true
  state.addbutton_show=false
  state.updatebutton_show=true
  state.editbox_disablegeneratelot=true
  const seletelocation = locationOptions.value.find(item => item.id === formData.locationId)
  formData.seletevalue=seletelocation.value
  state.drawer=true
  }
  else{
    eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX,{type:'error',message:'请选择要修改的记录'})
  }
}

function checkinput() {
  if (formData.seletevalue != null) {
    const seletelocation = locationOptions.value.find(item => item.value === formData.seletevalue)
    formData.locationId = seletelocation.id
    formData.locationName = seletelocation.label
  }
  const validationRules = {
  // 定义必填字段数组，包含需要验证的字段名
  required: ['locationId', 'temperature', 'humidity', 'createTime']
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


async function sensorRecord_show() {
    const data = await api_sensorRecord_show(state)

    state.tableData = data.data
    state.totalpage = data.meta.totalPage
}
async function sensorRecord_del(id){
  if(formData.id){
    await api_sensorRecord_del(formData.id)
    await sensorRecord_show()
    eventBus.emit(EVENT_TYPES.CLOSE_MESSAGEBOX)
  }
  else{
    eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX,{type:'error',message:'请选择要删除的记录'})
  }
}

async function sensorRecord_update() {
  await api_sensorRecord_update(formData)
  state.drawer = false
  await sensorRecord_show()
  formData.id=null
}
async function sensorRecord_add() {
  await api_sensorRecord_add(formData)
  state.drawer = false
  await sensorRecord_show()
}

async function handleExport() {
  sensorRecord_exporttoexcel_list({
    locationName: state.locationName,
    startTime: format_YYYYMMDDHHmm_iso(state.startTime),
    endTime: format_YYYYMMDDHHmm_iso(state.endTime),
  })
}

// 生命周期钩子
onMounted(async () => {
    await sensorRecord_show()
    const data = (await api_location_showAll()).data
    locationOptions.value = []
    for (let i in data){
      locationOptions.value.push({
        label: data[i].name,
        value: i,
        id: data[i].id,
      })
    }

})


</script >
<style scoped>

#background2{
  height: 140px;
}
.el-table{
  position: absolute;
  left: 200px;
  top: 150px;
}
.button-container {
  position: absolute;
  left: 800px;
  top: 50px;
  display: flex;
  gap: 10px;  /* 统一间距 */
}
.export-button-container {
  position: absolute;
  left: 200px;
  top: 90px;
  display: flex;
  gap: 10px;
}
</style>










