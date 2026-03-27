<template>
    <div id="background" class="sensor-page">
      <div id="background2" class="toolbar">
        <el-input 
          class="toolbar-search"
          v-model="state.locationName" 
          placeholder="搜索位置名称" 

          @input="sensorRecord_show" 
        />
        <el-config-provider :locale="zhCn">
                <el-date-picker 
                    v-model="state.startTime" 
                    class="toolbar-date"
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
                    class="toolbar-date"
                    type="date"
                    placeholder="选择结束日期" 
                    size="default" 
                    @change="sensorRecord_show" 
                    value-format="YYYY-MM-DD 23:59:59"
                />
            </el-config-provider>
        <el-pagination 
          class="toolbar-pagination"
          background  
          layout="prev, pager, next"  
          v-model:current-page="state.page" 
          :page-count="state.totalpage" 
          @change="sensorRecord_show" 
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
            @click="showDeleteSensorRecordConfirm"
          >删除记录</el-button>
        </div>
        <div class="export-button-container"> <el-button 
            id="export"
            type="primary" 
            @click="handleExport"
          >导出记录</el-button></div>

      </div>
      <div class="sensor-table">
        <el-auto-resizer>
          <template #default="{ width, height }">
            <el-table-v2
              :columns="tableColumns"
              :data="state.tableData"
              :width="width"
              :height="height"
              :row-height="36"
              :header-height="34"
              :row-class="({ rowData, rowIndex }) => getRowClass(rowData, rowIndex)"
              :row-event-handlers="{ onClick: handleRowClick }"
            />
          </template>
        </el-auto-resizer>
      </div>
    </div>


    <el-drawer v-model="state.drawer" direction="rtl" size="60%" >
      <template #header>
      <span >记录模板</span>
    </template>
      <template #footer>
      <div style="flex: auto">
        <el-button  size="large" type="warning" v-show="state.drawerMode === 'edit'"   @click="sensorRecord_update"  :disabled="state.submitDisabled" >修改</el-button>
        <el-button  size="large" type="success" v-show="state.drawerMode === 'add'"  @click="sensorRecord_add"  :disabled="state.submitDisabled">增加</el-button>
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
        <p>电池</p>  
        <el-input-number v-model="formData.battery" :min="0" :max="100" :step="1" placeholder="0" @change="checkinput" />
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
import { onMounted, reactive,ref } from 'vue'
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
  drawer: false,
  drawerMode: 'add',
  submitDisabled: true,
  selectedRowId: null,
  startTime: getnowtime_previousmonth(),
  endTime: getnowtime(),
})
const locationOptions = ref([])
const formData = reactive({
  id: null,
  locationId: '',
  locationName: '',
  temperature: 0,
  humidity: 0,
  createTime: '',
  seletevalue:null,
  battery: 0,
  note: '',
})
const REQUIRED_FIELDS = ['locationId', 'temperature', 'humidity', 'createTime']
const tableColumns = [
  {
    key: 'locationName',
    dataKey: 'locationName',
    title: '位置名称',
    width: 180,
    flexGrow: 1,
    cellRenderer: ({ rowData }) => rowData.location?.name ?? '',
  },
  { key: 'temperature', dataKey: 'temperature', title: '温度', width: 120, flexGrow: 1 },
  { key: 'humidity', dataKey: 'humidity', title: '湿度', width: 120, flexGrow: 1 },
  {
    key: 'teamName',
    dataKey: 'teamName',
    title: '团队名称',
    width: 150,
    flexGrow: 1,
    cellRenderer: ({ rowData }) => rowData.team?.name ?? '',
  },
  {
    key: 'createTime',
    dataKey: 'createTime',
    title: '创建时间',
    width: 180,
    flexGrow: 1,
    cellRenderer: ({ rowData }) => formatDateColumn(rowData, null, rowData.createTime),
  },
  { key: 'battery', dataKey: 'battery', title: '电池', width: 100, flexGrow: 1 },
]
function getRowClass(rowData, rowIndex) {
  const statusClass = tableRowClassName({ row: rowData, rowindex: rowIndex }) || ''
  if (state.selectedRowId === rowData.id) {
    return `${statusClass} current-row`.trim()
  }
  return statusClass
}

function resetFormData() {
  Object.assign(formData, {
    id: null,
    locationId: '',
    locationName: '',
    temperature: 0,
    humidity: 0,
    createTime: '',
    seletevalue: null,
    battery: 0,
    note: '',
  })
}

function fillFormDataFromRow(rowData) {
  Object.assign(formData, {
    id: rowData.id,
    locationId: rowData.locationId,
    locationName: rowData.location?.name ?? '',
    temperature: rowData.temperature,
    humidity: rowData.humidity,
    createTime: rowData.createTime,
    seletevalue: null,
    battery: rowData.battery,
    note: rowData.note,
  })
}

function syncSubmitDisabled() {
  const hasAllRequiredFields = REQUIRED_FIELDS.every((field) => {
    const value = formData[field]
    if (typeof value === 'string') {
      return value.trim() !== ''
    }
    return value != null
  })
  state.submitDisabled = !hasAllRequiredFields
}

function openDrawer(mode) {
  state.drawerMode = mode
  state.drawer = true
  syncSubmitDisabled()
}

function handleRowClick({ rowData }) {
  if(formData.id===rowData.id){
    state.selectedRowId = null
    resetFormData()
  }
  else{
    state.selectedRowId = rowData.id
    fillFormDataFromRow(rowData)
  }
  syncSubmitDisabled()
}

function tableRowClassName({ row,rowindex }) { // 表格行样式
  if(row.warningTemperature===true || row.warningHumidity===true){
    return 'warning-row'
  }
  return 'normal-row'
}

async function add_drawer(){
  state.selectedRowId = null
  resetFormData()
  openDrawer('add')
}

async function edit_drawer(){
  if(formData.id){
  const seletelocation = locationOptions.value.find(item => item.id === formData.locationId)
  if(seletelocation){
  formData.seletevalue=seletelocation.value
  formData.locationName=seletelocation.label
  }
  openDrawer('edit')
  }
  else{
    eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX,{type:'error',message:'请选择要修改的记录'})
  }
}

function showDeleteSensorRecordConfirm() {
  if (!formData.id) {
    eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX,{type:'info',title:'删除记录',message:'请选择要修改的记录'})
    return
  }
  eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX,{type:'confirm',title:'删除记录',message:'是否删除该记录',action:()=>sensorRecord_del()})
}

function checkinput() {
  if (formData.seletevalue != null) {
    const seletelocation = locationOptions.value.find(item => item.value === formData.seletevalue)
    if (seletelocation) {
      formData.locationId = seletelocation.id
      formData.locationName = seletelocation.label
    }
  }
  syncSubmitDisabled()
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
    eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX,{type:'info',title:'删除记录',message:'请选择要修改的记录'})
  }
}

async function sensorRecord_update() {
  await api_sensorRecord_update(formData)
  state.drawer = false
  await sensorRecord_show()
  state.selectedRowId = null
  formData.id=null
}
async function sensorRecord_add() {
  await api_sensorRecord_add(formData)
  state.drawer = false
  await sensorRecord_show()
  state.selectedRowId = null
  formData.id = null
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

.sensor-page {
  padding-top: 100px;
  padding-left: 24px;
  padding-right: 24px;
  max-width: 1900px;
  margin: 0 auto;
}

.toolbar {
  min-height: 90px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.toolbar-search {
  width: 250px;
}

.toolbar-date {
  width: 150px;
}

.toolbar-pagination {
  margin-right: auto;
}

.button-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.export-button-container {
  display: flex;
  gap: 10px;
}

.sensor-table {
  margin-top: 8px;
  height: 620px;
}
</style>





