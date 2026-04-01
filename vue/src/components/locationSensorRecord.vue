<template>
  <div class="location-sensor-page">
    <section class="panel-section">
      <div class="panel-header">
        <h3>位置管理</h3>
      </div>
      <div class="toolbar">
        <el-input
          class="toolbar-search"
          v-model="locationState.name"
          placeholder="搜索位置名称"
          @input="locationShow"
        />
        <el-pagination
          class="toolbar-pagination"
          background
          layout="prev, pager, next"
          v-model:current-page="locationState.page"
          :page-count="locationState.totalpage"
          @change="locationShow"
        />
        <div class="button-container">
          <el-button type="success" @click="openLocationAddDrawer">增加位置</el-button>
          <el-button type="primary" @click="openLocationEditDrawer">修改位置</el-button>
          <el-button
            type="danger"
            @click="showDeleteLocationConfirm"
          >
            删除位置
          </el-button>
        </div>
      </div>
      <div class="table-wrap">
        <el-auto-resizer>
          <template #default="{ width, height }">
            <el-table-v2
              :columns="locationTableColumns"
              :data="locationState.tableData"
              :width="width"
              :height="height"
              :row-height="36"
              :header-height="34"
              :row-class="({ rowData, rowIndex }) => getLocationRowClass(rowData, rowIndex)"
              :row-event-handlers="{ onClick: handleLocationRowClick }"
            />
          </template>
        </el-auto-resizer>
      </div>
    </section>

    <section class="panel-section">
      <div class="panel-header">
        <h3>监测记录</h3>
      </div>
      <div class="toolbar">
        <el-input
          class="toolbar-search"
          v-model="sensorState.locationName"
          placeholder="搜索位置名称"
          @input="sensorRecordShow"
        />
        <el-config-provider :locale="zhCn">
          <el-date-picker
            v-model="sensorState.startTime"
            class="toolbar-date"
            type="date"
            placeholder="选择开始日期"
            size="default"
            @change="sensorRecordShow"
            value-format="YYYY-MM-DD 00:00:01"
          />
        </el-config-provider>
        <el-config-provider :locale="zhCn">
          <el-date-picker
            v-model="sensorState.endTime"
            class="toolbar-date"
            type="date"
            placeholder="选择结束日期"
            size="default"
            @change="sensorRecordShow"
            value-format="YYYY-MM-DD 23:59:59"
          />
        </el-config-provider>
        <el-pagination
          class="toolbar-pagination"
          background
          layout="prev, pager, next"
          v-model:current-page="sensorState.page"
          :page-count="sensorState.totalpage"
          @change="sensorRecordShow"
        />
        <div class="button-container">
          <el-button type="success" @click="openSensorAddDrawer">增加记录</el-button>
          <el-button type="primary" @click="openSensorEditDrawer">修改记录</el-button>
          <el-button
            type="danger"
            @click="showDeleteSensorConfirm"
          >
            删除记录
          </el-button>
          <el-button type="primary" @click="handleSensorExport">导出记录</el-button>
        </div>
      </div>
      <div class="table-wrap">
        <el-auto-resizer>
          <template #default="{ width, height }">
            <el-table-v2
              :columns="sensorTableColumns"
              :data="sensorState.tableData"
              :width="width"
              :height="height"
              :row-height="36"
              :header-height="34"
              :row-class="({ rowData, rowIndex }) => getSensorRowClass(rowData, rowIndex)"
              :row-event-handlers="{ onClick: handleSensorRowClick }"
            />
          </template>
        </el-auto-resizer>
      </div>
    </section>

    <el-drawer v-model="locationState.drawer" direction="rtl" size="60%" @open="locationState.selectedRowId = null">
      <template #header>
        <span class="drawer-title">位置管理</span>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button size="large" type="warning" v-show="locationState.drawerMode === 'edit'" @click="locationUpdate" :disabled="locationState.submitDisabled">修改</el-button>
          <el-button size="large" type="success" v-show="locationState.drawerMode === 'add'" @click="locationAdd" :disabled="locationState.submitDisabled">增加</el-button>
          <el-button size="large" type="primary" @click="locationState.drawer=false">关闭</el-button>
        </div>
      </template>
      <template #default>
        <div class="drawer-grid">
          <div>
            <p>位置名称</p>
            <el-input v-model="locationFormData.name" @input="syncLocationSubmitDisabled" style="width: 300px" placeholder="输入位置的名称" />
            <p>备注</p>
            <el-input v-model="locationFormData.note" style="width: 300px" placeholder="如：备注" />
            <p>最大温度</p>
            <el-input-number v-model="locationFormData.maxTemperature" :min="-100" :max="100" :step="0.1" placeholder="0" @change="syncLocationSubmitDisabled" />
            <p>最小温度</p>
            <el-input-number v-model="locationFormData.minTemperature" :min="-100" :max="100" :step="0.1" placeholder="0" @change="syncLocationSubmitDisabled" />
            <p>最大湿度</p>
            <el-input-number v-model="locationFormData.maxHumidity" :min="0" :max="100" :step="0.1" placeholder="0" @change="syncLocationSubmitDisabled" />
            <p>最小湿度</p>
            <el-input-number v-model="locationFormData.minHumidity" :min="0" :max="100" :step="0.1" placeholder="0" @change="syncLocationSubmitDisabled" />
          </div>
          <div>
            <p>是否启用</p>
            <el-switch v-model="locationFormData.status" size="large" @change="syncLocationSubmitDisabled" />
            <p>上传间隔(分钟)</p>
            <el-input-number v-model="locationFormData.uploadIntervalMinutes" :min="10" :max="1000" placeholder="0" @change="syncLocationSubmitDisabled" />
          </div>
        </div>
      </template>
    </el-drawer>

    <el-drawer v-model="sensorState.drawer" direction="rtl" size="60%" @open="sensorState.selectedRowId = null">
      <template #header>
        <span class="drawer-title">监测管理</span>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button size="large" type="warning" v-show="sensorState.drawerMode === 'edit'" @click="sensorRecordUpdate" :disabled="sensorState.submitDisabled">修改</el-button>
          <el-button size="large" type="success" v-show="sensorState.drawerMode === 'add'" @click="sensorRecordAdd" :disabled="sensorState.submitDisabled">增加</el-button>
          <el-button size="large" type="primary" @click="sensorState.drawer=false">关闭</el-button>
        </div>
      </template>
      <template #default>
        <div>
          <p>位置名称</p>
          <el-select-v2 v-model="sensorFormData.seletevalue" filterable :options="locationOptions" placeholder="选择位置" @change="sensorCheckInput" style="width: 300px" />
          <p>温度</p>
          <el-input-number v-model="sensorFormData.temperature" :min="-100" :max="100" :step="0.1" placeholder="0" @change="sensorCheckInput" />
          <p>湿度</p>
          <el-input-number v-model="sensorFormData.humidity" :min="0" :max="100" :step="0.1" placeholder="0" @change="sensorCheckInput" />
          <p>电池</p>
          <el-input-number v-model="sensorFormData.battery" :min="0" :max="100" :step="1" placeholder="0" @change="sensorCheckInput" />
          <p>创建时间</p>
          <el-config-provider :locale="zhCn">
            <el-date-picker v-model="sensorFormData.createTime" type="datetime" placeholder="选择创建时间" @change="sensorCheckInput" value-format="YYYY-MM-DD HH:mm:ss" />
          </el-config-provider>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { onMounted, reactive, ref } from 'vue'
import { api_location_show, api_location_del, api_location_update, api_location_add, api_location_showAll } from '@/api/location'
import { api_sensorRecord_show, api_sensorRecord_add, api_sensorRecord_update, api_sensorRecord_del } from '@/api/sensorRecord'
import { sensorRecord_exporttoexcel_list } from '@/utils/exportexcel.js'
import { formatDateColumn, getnowtime_previousmonth, getnowtime, format_YYYYMMDDHHmm_iso } from '@/utils/format'
import {
  syncSubmitDisabledByFields,
  toggleRowSelection,
  showDeleteConfirmBySelection,
  deleteWithSelection,
  openDrawerByMode,
  openAddDrawerFlow,
  tryOpenEditDrawerBySelection,
  resolveSelectableRowClass,
} from '@/utils/crud'

const locationState = reactive({
  name: '',
  tableData: [],
  page: 1,
  totalpage: 1,
  drawer: false,
  drawerMode: 'add',
  submitDisabled: true,
  selectedRowId: null,
})

const locationFormData = reactive({
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

const locationRequiredFields = ['name', 'uploadIntervalMinutes', 'maxTemperature', 'minTemperature', 'maxHumidity', 'minHumidity']
const locationTableColumns = [
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

const sensorState = reactive({
  locationName: '',
  tableData: [],
  page: 1,
  totalpage: 1,
  drawer: false,
  drawerMode: 'add',
  submitDisabled: true,
  selectedRowId: null,
  startTime: getnowtime_previousmonth(),
  endTime: getnowtime(),
})

const sensorFormData = reactive({
  id: null,
  locationId: null,
  locationName: '',
  temperature: 0,
  humidity: 0,
  createTime: '',
  seletevalue: null,
  battery: 0,
  note: '',
})

const locationOptions = ref([])
const sensorRequiredFields = ['locationId', 'temperature', 'humidity', 'createTime']
const sensorTableColumns = [
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

function resetLocationFormData() {
  Object.assign(locationFormData, {
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

function fillLocationFormDataFromRow(rowData) {
  Object.assign(locationFormData, {
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

function syncLocationSubmitDisabled() {
  syncSubmitDisabledByFields({
    formData: locationFormData,
    requiredFields: locationRequiredFields,
    target: locationState,
    disabledKey: 'submitDisabled',
  })
}

function openLocationDrawer(mode) {
  openDrawerByMode({
    state: locationState,
    mode,
    afterOpen: syncLocationSubmitDisabled,
  })
}

function handleLocationRowClick({ rowData }) {
  toggleRowSelection({
    rowData,
    isSameSelection: locationState.selectedRowId === rowData.id,
    setSelectedRowId: (value) => { locationState.selectedRowId = value },
    onSelect: fillLocationFormDataFromRow,
    onDeselect: resetLocationFormData,
  })
  syncLocationSubmitDisabled()
}

function getLocationRowClass(rowData, rowIndex) {
  return resolveSelectableRowClass({
    rowData,
    rowIndex,
    selectedRowId: locationState.selectedRowId,
    getStatusClass: getLocationStatusClass,
    defaultClass: 'normal-row',
  })
}

function getLocationStatusClass({ row }) {
  if (row.status === 0) {
    if (row.warningTemperature === false && row.warningHumidity === false && row.warningUploadTime === false) return 'normal-row'
    return 'warning-row'
  }
  if (row.status === 1) return 'unactive-row'
  return ''
}

function openLocationAddDrawer() {
  openAddDrawerFlow({
    setSelectedRowId: (value) => { locationState.selectedRowId = value },
    resetFormData: resetLocationFormData,
    onOpen: () => openLocationDrawer('add'),
  })
}

function openLocationEditDrawer() {
  tryOpenEditDrawerBySelection({
    selectedRowId: locationState.selectedRowId,
    title: '修改位置',
    emptyMessage: '请选择要修改的位置',
    onOpen: () => openLocationDrawer('edit'),
  })
}

function showDeleteLocationConfirm() {
  showDeleteConfirmBySelection({
    selectedRowId: locationState.selectedRowId,
    title: '删除位置',
    emptyMessage: '请选择要删除的位置',
    confirmMessage: '是否删除该位置',
    onConfirm: () => locationDel(),
  })
}

async function locationShow() {
  const data = await api_location_show(locationState)
  locationState.tableData = data.data
  locationState.totalpage = data.meta.totalPage
}

async function locationDel() {
  await deleteWithSelection({
    selectedRowId: locationState.selectedRowId,
    title: '删除位置',
    emptyMessage: '请选择要删除的位置',
    deleteAction: (id) => api_location_del(id),
    onAfterDelete: async () => {
      await Promise.all([locationShow(), listAllLocationsForSensor()])
      locationState.selectedRowId = null
      resetLocationFormData()
    },
  })
}

async function locationUpdate() {
  locationFormData.status = locationFormData.status ? 0 : 1
  await api_location_update(locationFormData)
  locationState.drawer = false
  await Promise.all([locationShow(), listAllLocationsForSensor()])
  locationState.selectedRowId = null
  locationFormData.id = null
}

async function locationAdd() {
  locationFormData.status = locationFormData.status ? 0 : 1
  await api_location_add(locationFormData)
  locationState.drawer = false
  await Promise.all([locationShow(), listAllLocationsForSensor()])
  locationState.selectedRowId = null
  locationFormData.id = null
}

function resetSensorFormData() {
  Object.assign(sensorFormData, {
    id: null,
    locationId: null,
    locationName: '',
    temperature: 0,
    humidity: 0,
    createTime: '',
    seletevalue: null,
    battery: 0,
    note: '',
  })
}

function fillSensorFormDataFromRow(rowData) {
  Object.assign(sensorFormData, {
    id: rowData.id,
    locationId: rowData.locationId,
    locationName: rowData.location?.name ?? '',
    temperature: rowData.temperature,
    humidity: rowData.humidity,
    createTime: rowData.createTime,
    seletevalue: rowData.locationId,
    battery: rowData.battery,
    note: rowData.note,
  })
}

function syncSensorSubmitDisabled() {
  syncSubmitDisabledByFields({
    formData: sensorFormData,
    requiredFields: sensorRequiredFields,
    target: sensorState,
    disabledKey: 'submitDisabled',
  })
}

function openSensorDrawer(mode) {
  openDrawerByMode({
    state: sensorState,
    mode,
    afterOpen: syncSensorSubmitDisabled,
  })
}

function handleSensorRowClick({ rowData }) {
  toggleRowSelection({
    rowData,
    isSameSelection: sensorState.selectedRowId === rowData.id,
    setSelectedRowId: (value) => { sensorState.selectedRowId = value },
    onSelect: fillSensorFormDataFromRow,
    onDeselect: resetSensorFormData,
  })
  syncSensorSubmitDisabled()
}

function getSensorRowClass(rowData, rowIndex) {
  return resolveSelectableRowClass({
    rowData,
    rowIndex,
    selectedRowId: sensorState.selectedRowId,
    getStatusClass: ({ row }) => (
      row.warningTemperature === true || row.warningHumidity === true
    )
      ? 'warning-row'
      : 'normal-row',
  })
}

function openSensorAddDrawer() {
  openAddDrawerFlow({
    setSelectedRowId: (value) => { sensorState.selectedRowId = value },
    resetFormData: resetSensorFormData,
    onOpen: () => openSensorDrawer('add'),
  })
}

function openSensorEditDrawer() {
  tryOpenEditDrawerBySelection({
    selectedRowId: sensorState.selectedRowId,
    title: '修改记录',
    emptyMessage: '请选择要修改的记录',
    onOpen: () => openSensorDrawer('edit'),
  })
}

function showDeleteSensorConfirm() {
  showDeleteConfirmBySelection({
    selectedRowId: sensorState.selectedRowId,
    title: '删除记录',
    emptyMessage: '请选择要删除的记录',
    confirmMessage: '是否删除该记录',
    onConfirm: () => sensorRecordDel(),
  })
}

function sensorCheckInput() {
  if (sensorFormData.seletevalue != null) {
    const selectedLocation = locationOptions.value.find((item) => item.value === sensorFormData.seletevalue)
    if (selectedLocation) {
      sensorFormData.locationId = selectedLocation.value
      sensorFormData.locationName = selectedLocation.label
    }
  }
  syncSensorSubmitDisabled()
}

async function sensorRecordShow() {
  const data = await api_sensorRecord_show(sensorState)
  sensorState.tableData = data.data
  sensorState.totalpage = data.meta.totalPage
}

async function sensorRecordDel() {
  await deleteWithSelection({
    selectedRowId: sensorState.selectedRowId,
    title: '删除记录',
    emptyMessage: '请选择要删除的记录',
    deleteAction: (id) => api_sensorRecord_del(id),
    onAfterDelete: async () => {
      await sensorRecordShow()
      sensorState.selectedRowId = null
      resetSensorFormData()
    },
  })
}

async function sensorRecordUpdate() {
  await api_sensorRecord_update(sensorFormData)
  sensorState.drawer = false
  await sensorRecordShow()
  sensorState.selectedRowId = null
  sensorFormData.id = null
}

async function sensorRecordAdd() {
  await api_sensorRecord_add(sensorFormData)
  sensorState.drawer = false
  await sensorRecordShow()
  sensorState.selectedRowId = null
  sensorFormData.id = null
}

function handleSensorExport() {
  sensorRecord_exporttoexcel_list({
    locationName: sensorState.locationName,
    startTime: format_YYYYMMDDHHmm_iso(sensorState.startTime),
    endTime: format_YYYYMMDDHHmm_iso(sensorState.endTime),
  })
}

async function listAllLocationsForSensor() {
  const data = (await api_location_showAll()).data
  locationOptions.value = data.map((item) => ({
    label: item.name,
    value: item.id,
  }))
}

onMounted(async () => {
  await Promise.all([locationShow(), sensorRecordShow(), listAllLocationsForSensor()])
})
</script>

<style scoped>
.location-sensor-page {
  height: calc(100dvh - 80px);
  margin: 72px auto 0;
  padding: 8px 12px;
  max-width: 1900px;
  box-sizing: border-box;
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: 8px;
  overflow: hidden;
}

.panel-section {
  border: 1px solid var(--el-border-color-light);
  border-radius: 10px;
  background: var(--el-bg-color-overlay);
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.panel-header h3 {
  margin: 0 0 6px 0;
  color: var(--el-text-color-primary);
  font-size: 22px;
  font-weight: 800;
}

.drawer-title {
  font-size: 24px;
  font-weight: 800;
  color: var(--el-text-color-primary);
}

.toolbar {
  min-height: 44px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: nowrap;
}

.toolbar-search {
  width: 220px;
  flex-shrink: 0;
}

.toolbar-date {
  width: 150px;
  flex-shrink: 0;
}

.toolbar-pagination {
  margin-right: auto;
  flex-shrink: 0;
}

.button-container {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.table-wrap {
  margin-top: 2px;
  flex: 1;
  min-height: 0;
}

.drawer-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(320px, 1fr));
  gap: 24px;
}
</style>
