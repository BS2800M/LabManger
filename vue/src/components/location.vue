<template>
    <div id="background" class="location-page">
      <div id="background2" class="toolbar">
        <el-input 
          class="toolbar-search"
          v-model="state.name" 
          placeholder="搜索位置名称" 

          @input="location_show" 
        />
        <el-pagination 
          class="toolbar-pagination"
          background  
          layout="prev, pager, next"  
          v-model:current-page="state.page" 
          :page-count="state.totalpage" 
          @change="location_show" 
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
            @click="showDeleteLocationConfirm"
          >删除位置</el-button>
          
      </div>
      </div>
      <div class="location-table">
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
      <span >位置模板</span>
    </template>
      <template #footer>
      <div style="flex: auto">
        <el-button  size="large" type="warning" v-show="state.drawerMode === 'edit'"   @click="location_update"  :disabled="state.submitDisabled" >修改</el-button>
        <el-button  size="large" type="success" v-show="state.drawerMode === 'add'"  @click="location_add"  :disabled="state.submitDisabled">增加</el-button>
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
        <el-input-number v-model="formData.maxTemperature" :min="-100" :max="100" :step="0.1" placeholder="0" @change="checkinput" />
        <p>最小温度</p>  
        <el-input-number v-model="formData.minTemperature" :min="-100" :max="100" :step="0.1" placeholder="0" @change="checkinput" />
        <p>最大湿度</p>  
        <el-input-number v-model="formData.maxHumidity" :min="0" :max="100" :step="0.1" placeholder="0" @change="checkinput" />
        <p>最小湿度</p>  
        <el-input-number v-model="formData.minHumidity" :min="0" :max="100" :step="0.1" placeholder="0" @change="checkinput" />
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
import { onMounted, reactive } from 'vue'
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
  drawer: false,
  drawerMode: 'add',
  submitDisabled: true,
  selectedRowId: null,
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
const REQUIRED_FIELDS = ['name', 'uploadIntervalMinutes', 'maxTemperature', 'minTemperature', 'maxHumidity', 'minHumidity']
const tableColumns = [
  { key: 'id', dataKey: 'id', title: 'ID', width: 80, flexGrow: 1 },
  {
    key: 'teamName',
    dataKey: 'teamName',
    title: '团队名称',
    width: 140,
    flexGrow: 1,
    cellRenderer: ({ rowData }) => rowData.team?.name ?? '',
  },
  { key: 'name', dataKey: 'name', title: '位置名称', width: 140, flexGrow: 1 },
  { key: 'note', dataKey: 'note', title: '备注', width: 140, flexGrow: 1 },
  {
    key: 'lastUploadTime',
    dataKey: 'lastUploadTime',
    title: '最后上传时间',
    width: 180,
    flexGrow: 1,
    cellRenderer: ({ rowData }) => formatDateColumn(rowData, null, rowData.lastUploadTime),
  },
  { key: 'lastUploadTemperature', dataKey: 'lastUploadTemperature', title: '最后上传温度', width: 150, flexGrow: 1 },
  { key: 'lastUploadHumidity', dataKey: 'lastUploadHumidity', title: '最后上传湿度', width: 150, flexGrow: 1 },
  { key: 'lastUploadBattery', dataKey: 'lastUploadBattery', title: '最后上传电池', width: 140, flexGrow: 1 },
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
    name: '',
    note: '',
    uploadIntervalMinutes: 0,
    maxTemperature: 7,
    minTemperature: 1,
    maxHumidity: 99,
    minHumidity: 1,
    status: true,
  })
}

function fillFormDataFromRow(rowData) {
  Object.assign(formData, {
    id: rowData.id,
    name: rowData.name,
    note: rowData.note,
    uploadIntervalMinutes: rowData.uploadIntervalMinutes,
    maxTemperature: rowData.maxTemperature,
    minTemperature: rowData.minTemperature,
    maxHumidity: rowData.maxHumidity,
    minHumidity: rowData.minHumidity,
    status: rowData.status === 0,
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
  state.selectedRowId = null
  resetFormData()
  openDrawer('add')
}

async function edit_drawer(){
  if(formData.id){
    openDrawer('edit')
  }
  else{
    eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX,{type:'error',message:'请选择要修改的记录'})
  }
}

function showDeleteLocationConfirm() {
  if (!formData.id) {
    eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX,{type:'info',title:'删除位置',message:'请选择要修改的记录'})
    return
  }
  eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX,{type:'confirm',title:'删除位置',message:'是否删除该位置',action:()=>location_del()})
}

function checkinput() {
  syncSubmitDisabled()
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
    eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX,{type:'info',title:'删除位置',message:'请选择要修改的记录'})
  }
}

async function location_update() {
  formData.status=formData.status?0:1
  await api_location_update(formData)
  state.drawer = false
  await location_show()
  state.selectedRowId = null
  formData.id=null
}
async function location_add() {
  formData.status=formData.status?0:1
  await api_location_add(formData)
  state.drawer = false
  await location_show()
  state.selectedRowId = null
  formData.id = null
}

// 生命周期钩子
onMounted(async () => {
    await location_show()
})


</script >
<style scoped>

.location-page {
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

.toolbar-pagination {
  margin-right: auto;
}

.button-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.location-table {
  margin-top: 8px;
  height: 620px;
}
</style>











