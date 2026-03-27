<template>
  <div class="reagent-lot-page">
    <section class="panel-section">
      <div class="panel-header">
        <h3>试剂管理</h3>
      </div>
      <div class="toolbar">
        <el-input
          class="toolbar-search"
          v-model="reagentState.name"
          placeholder="搜索试剂名称"
          @input="reagentShow"
        />
        <el-pagination
          class="toolbar-pagination"
          background
          layout="prev, pager, next"
          v-model:current-page="reagentState.page"
          :page-count="reagentState.totalpage"
          @change="reagentShow"
        />
        <div class="button-container">
          <el-button type="success" @click="openReagentAddDrawer">增加试剂</el-button>
          <el-button type="primary" @click="openReagentEditDrawer">修改试剂</el-button>
          <el-button
            type="danger"
            v-if="get_permission('reagent_delete')"
            @click="showDeleteReagentConfirm"
          >
            删除试剂
          </el-button>
        </div>
      </div>
      <div class="table-wrap">
        <el-auto-resizer>
          <template #default="{ width, height }">
            <el-table-v2
              :columns="reagentTableColumns"
              :data="reagentState.tableData"
              :width="width"
              :height="height"
              :row-height="36"
              :header-height="34"
              :row-class="({ rowData, rowIndex }) => getReagentRowClass(rowData, rowIndex)"
              :row-event-handlers="{ onClick: handleReagentRowClick }"
            />
          </template>
        </el-auto-resizer>
      </div>
    </section>

    <section class="panel-section">
      <div class="panel-header">
        <h3>批号管理</h3>
      </div>
      <div class="toolbar">
        <el-input
          class="toolbar-search"
          v-model="lotState.name"
          placeholder="搜索批号"
          @input="lotShow"
        />
        <el-pagination
          class="toolbar-pagination"
          background
          layout="prev, pager, next"
          v-model:current-page="lotState.page"
          :page-count="lotState.totalpage"
          @change="lotShow"
        />
        <div class="button-container">
          <el-button type="success" @click="openLotAddDrawer">增加批号</el-button>
          <el-button type="primary" @click="openLotEditDrawer">修改批号</el-button>
          <el-button
            type="danger"
            v-if="get_permission('lot_delete')"
            @click="showDeleteLotConfirm"
          >
            删除批号
          </el-button>
        </div>
      </div>
      <div class="table-wrap">
        <el-auto-resizer>
          <template #default="{ width, height }">
            <el-table-v2
              :columns="lotTableColumns"
              :data="lotState.tableData"
              :width="width"
              :height="height"
              :row-height="36"
              :header-height="34"
              :row-class="({ rowData, rowIndex }) => getLotRowClass(rowData, rowIndex)"
              :row-event-handlers="{ onClick: handleLotRowClick }"
            />
          </template>
        </el-auto-resizer>
      </div>
    </section>

    <el-drawer v-model="reagentState.drawer" direction="rtl" size="60%">
      <template #header>
        <span class="drawer-title">试剂模板</span>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button size="large" type="warning" v-show="reagentState.drawerMode === 'edit'" @click="reagentUpdate" :disabled="reagentState.submitDisabled">修改</el-button>
          <el-button size="large" type="success" v-show="reagentState.drawerMode === 'add'" @click="reagentAdd" :disabled="reagentState.submitDisabled">增加</el-button>
          <el-button size="large" type="primary" @click="reagentState.drawer=false">关闭</el-button>
        </div>
      </template>
      <template #default>
        <div class="drawer-grid">
          <div>
            <p>试剂名称</p>
            <el-input v-model="reagentFormData.name" @input="reagentCheckInput" style="width: 300px" placeholder="输入试剂的名称" />
            <p>试剂规格</p>
            <el-input v-model="reagentFormData.specifications" style="width: 300px" placeholder="如：盒 箱 瓶" />
            <p>试剂的储存环境</p>
            <el-input v-model="reagentFormData.storageCondition" style="width: 300px" placeholder="如：常温 冷藏 冷冻" />
            <p>生产厂家</p>
            <el-input v-model="reagentFormData.manufacturer" style="width: 300px" placeholder="如：厂家名称" />
            <p>备注</p>
            <el-input v-model="reagentFormData.note" style="width: 300px" placeholder="如：备注" />
          </div>
          <div>
            <p>预警数量</p>
            <el-input-number v-model="reagentFormData.warnNumber" :min="-1" :max="9999" placeholder="0" @change="reagentCheckInput" />
            <p>预警天数</p>
            <el-input-number v-model="reagentFormData.warnDays" :min="0" :max="9999" placeholder="0" @change="reagentCheckInput" />
            <p>价格</p>
            <el-input-number v-model="reagentFormData.price" :min="0" :max="99999999" placeholder="0" @change="reagentCheckInput" />
            <p>创建时间</p>
            <el-input disabled v-model="reagentFormData.createTime" style="width: 300px" placeholder="系统自动生成" />
            <p>生成初始批号</p>
            <el-switch v-model="reagentFormData.generateLot" :disabled="reagentState.editbox_disablegeneratelot" size="large" @change="reagentCheckInput" />
            <p>是否启用</p>
            <el-switch v-model="reagentFormData.status" size="large" @change="reagentCheckInput" />
          </div>
        </div>
      </template>
    </el-drawer>

    <el-drawer v-model="lotState.drawer" direction="rtl" size="30%">
      <template #header>
        <span class="drawer-title">批号管理</span>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button size="large" type="warning" v-show="lotState.drawerMode === 'edit'" @click="lotUpdate" :disabled="lotState.submitDisabled">修改</el-button>
          <el-button size="large" type="success" v-show="lotState.drawerMode === 'add'" @click="lotAdd" :disabled="lotState.submitDisabled">增加</el-button>
          <el-button size="large" type="primary" @click="lotState.drawer=false">关闭</el-button>
        </div>
      </template>
      <template #default>
        <div>
          <p>批号数字</p>
          <el-input v-model="lotFormData.name" @input="lotCheckInput" style="width: 300px" placeholder="输入批号" />
          <p>批号有效期</p>
          <el-config-provider :locale="zhCn">
            <el-date-picker
              v-model="lotFormData.expirationdate"
              type="date"
              placeholder="选择日期"
              size="default"
              @change="lotCheckInput"
              value-format="YYYY-MM-DD 23:59:59"
            />
          </el-config-provider>
          <p>选择所属试剂</p>
          <el-select-v2 v-model="lotFormData.reagentId" filterable :options="allReagentList" placeholder="选择试剂" @change="lotCheckInput" :disabled="lotState.editbox_disable_selete" style="width: 240px" />
          <p>所属试剂名字</p>
          <el-input v-model="lotFormData.reagentName" style="width: 300px" disabled />
          <p>是否启用</p>
          <el-switch v-model="lotFormData.status" @change="lotCheckInput" />
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { onMounted, reactive, ref } from 'vue'
import { api_reagent_show, api_reagent_del, api_reagent_update, api_reagent_add, api_reagent_showall } from '@/api/reagent'
import { api_lot_show, api_lot_del, api_lot_update, api_lot_add } from '@/api/lot'
import { eventBus, EVENT_TYPES } from '@/utils/eventBus'
import { format_iso_YYYYMMDDHHmm, format_YYYYMMDDHHmm_iso, formatDateColumn } from '@/utils/format'
import get_permission from '@/utils/permission'

const reagentState = reactive({
  name: '',
  tableData: [],
  page: 1,
  totalpage: 1,
  drawer: false,
  drawerMode: 'add',
  submitDisabled: true,
  editbox_disablegeneratelot: false,
  selectedRowId: null,
})

const reagentFormData = reactive({
  id: null,
  name: '',
  specifications: '',
  storageCondition: '',
  manufacturer: '',
  warnNumber: 0,
  price: 0,
  warnDays: 0,
  generateLot: false,
  note: '',
  createTime: null,
  status: true,
})

const reagentRequiredFields = ['name']
const reagentTableColumns = [
  { key: 'name', dataKey: 'name', title: '试剂名称', width: 180, flexGrow: 1 },
  { key: 'specifications', dataKey: 'specifications', title: '规格', width: 140, flexGrow: 1 },
  { key: 'manufacturer', dataKey: 'manufacturer', title: '生产厂家', width: 160, flexGrow: 1 },
  { key: 'storageCondition', dataKey: 'storageCondition', title: '储存环境', width: 160, flexGrow: 1 },
  { key: 'note', dataKey: 'note', title: '备注', width: 180, flexGrow: 1 },
]

const lotState = reactive({
  name: '',
  tableData: [],
  page: 1,
  totalpage: 1,
  drawer: false,
  drawerMode: 'add',
  submitDisabled: true,
  editbox_disable_selete: true,
  selectedRowId: null,
})

const lotFormData = reactive({
  id: null,
  name: '',
  expirationdate: null,
  reagentId: null,
  status: true,
  reagentName: '',
})

const lotRequiredFields = ['name', 'expirationdate', 'status', 'reagentId']
const allReagentList = ref([])
const lotTableColumns = [
  { key: 'name', dataKey: 'name', title: '批号', width: 180, flexGrow: 1 },
  {
    key: 'expirationDate',
    dataKey: 'expirationDate',
    title: '有效期',
    width: 180,
    flexGrow: 1,
    cellRenderer: ({ rowData }) => formatDateColumn(rowData, null, rowData.expirationDate),
  },
  {
    key: 'reagentName',
    dataKey: 'reagentName',
    title: '所属试剂名称',
    width: 220,
    flexGrow: 1,
    cellRenderer: ({ rowData }) => rowData.reagent?.name ?? '',
  },
]

function resetReagentFormData(options = {}) {
  const { generateLot = false } = options
  Object.assign(reagentFormData, {
    id: null,
    name: '',
    specifications: '',
    storageCondition: '',
    manufacturer: '',
    warnNumber: 0,
    price: 0,
    warnDays: 0,
    generateLot,
    note: '',
    createTime: null,
    status: true,
  })
}

function fillReagentFormDataFromRow(rowData) {
  Object.assign(reagentFormData, {
    id: rowData.id,
    name: rowData.name,
    specifications: rowData.specifications,
    storageCondition: rowData.storageCondition,
    manufacturer: rowData.manufacturer,
    warnNumber: rowData.warnNumber,
    price: rowData.price,
    warnDays: rowData.warnDays,
    generateLot: rowData.generateLot,
    note: rowData.note,
    createTime: format_iso_YYYYMMDDHHmm(rowData.createTime),
    status: rowData.status === 0,
  })
}

function syncReagentSubmitDisabled() {
  const hasAllRequiredFields = reagentRequiredFields.every((field) => {
    const value = reagentFormData[field]
    if (typeof value === 'string') return value.trim() !== ''
    return value != null
  })
  reagentState.submitDisabled = !hasAllRequiredFields
}

function openReagentDrawer(mode) {
  reagentState.drawerMode = mode
  reagentState.editbox_disablegeneratelot = mode === 'edit'
  reagentState.drawer = true
  syncReagentSubmitDisabled()
}

function handleReagentRowClick({ rowData }) {
  if (reagentFormData.id === rowData.id) {
    reagentState.selectedRowId = null
    resetReagentFormData()
  } else {
    reagentState.selectedRowId = rowData.id
    fillReagentFormDataFromRow(rowData)
  }
  syncReagentSubmitDisabled()
}

function getReagentRowClass(rowData, rowIndex) {
  const statusClass = getReagentStatusClass({ row: rowData, rowindex: rowIndex }) || ''
  if (reagentState.selectedRowId === rowData.id) return `${statusClass} current-row`.trim()
  return statusClass
}

function getReagentStatusClass({ row }) {
  if (row.status === 0) return 'normal-row'
  if (row.status === 1) return 'unactive-row'
  return ''
}

function openReagentAddDrawer() {
  reagentState.selectedRowId = null
  resetReagentFormData({ generateLot: true })
  openReagentDrawer('add')
}

function openReagentEditDrawer() {
  if (reagentFormData.id) {
    openReagentDrawer('edit')
  } else {
    eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX, { type: 'info', title: '修改试剂', message: '请选择要修改的记录' })
  }
}

function showDeleteReagentConfirm() {
  if (!reagentFormData.id) {
    eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX, { type: 'info', title: '删除试剂', message: '请选择要修改的记录' })
    return
  }
  eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX, { type: 'confirm', title: '删除试剂', message: '是否删除该试剂,删除后将同时删除该试剂的全部批号', action: () => reagentDel() })
}

function reagentCheckInput() {
  syncReagentSubmitDisabled()
}

async function reagentShow() {
  const data = await api_reagent_show(reagentState)
  reagentState.tableData = data.data
  reagentState.totalpage = data.meta.totalPage
}

async function reagentDel() {
  if (reagentFormData.id) {
    await api_reagent_del(reagentFormData.id)
    await reagentShow()
    await lotShow()
    eventBus.emit(EVENT_TYPES.CLOSE_MESSAGEBOX)
  } else {
    eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX, { type: 'info', title: '删除试剂', message: '请选择要修改的记录' })
  }
}

async function reagentUpdate() {
  reagentFormData.status = reagentFormData.status === true ? 0 : 1
  await api_reagent_update(reagentFormData)
  reagentState.drawer = false
  await reagentShow()
  reagentState.selectedRowId = null
  reagentFormData.id = null
  await lotShow()
}

async function reagentAdd() {
  reagentFormData.status = reagentFormData.status === true ? 0 : 1
  await api_reagent_add(reagentFormData)
  reagentState.drawer = false
  await reagentShow()
  reagentState.selectedRowId = null
  reagentFormData.id = null
  await lotShow()
}

function resetLotFormData() {
  Object.assign(lotFormData, {
    id: null,
    name: '',
    expirationdate: null,
    reagentId: null,
    reagentName: '请选择试剂',
    status: true,
  })
}

function fillLotFormDataFromRow(rowData) {
  Object.assign(lotFormData, {
    id: rowData.id,
    name: rowData.name,
    expirationdate: rowData.expirationDate,
    reagentId: rowData.reagent?.id ?? null,
    reagentName: rowData.reagent?.name ?? '',
    status: rowData.status === 0,
  })
}

function syncLotSubmitDisabled() {
  const hasAllRequiredFields = lotRequiredFields.every((field) => {
    const value = lotFormData[field]
    if (typeof value === 'string') return value.trim() !== ''
    return value != null
  })
  lotState.submitDisabled = !hasAllRequiredFields
}

function openLotDrawer(mode) {
  lotState.drawerMode = mode
  lotState.editbox_disable_selete = mode === 'edit'
  lotState.drawer = true
  syncLotSubmitDisabled()
}

function handleLotRowClick({ rowData }) {
  if (lotFormData.id === rowData.id) {
    lotState.selectedRowId = null
    resetLotFormData()
  } else {
    lotState.selectedRowId = rowData.id
    fillLotFormDataFromRow(rowData)
  }
  syncLotSubmitDisabled()
}

function getLotRowClass(rowData, rowIndex) {
  const statusClass = getLotStatusClass({ row: rowData, rowindex: rowIndex }) || ''
  if (lotState.selectedRowId === rowData.id) return `${statusClass} current-row`.trim()
  return statusClass
}

function getLotStatusClass({ row }) {
  if (row.status === 0) return 'normal-row'
  if (row.status === 1) return 'unactive-row'
  return 'unactive-row'
}

function openLotAddDrawer() {
  lotState.selectedRowId = null
  resetLotFormData()
  openLotDrawer('add')
}

function openLotEditDrawer() {
  if (lotFormData.id) {
    openLotDrawer('edit')
  } else {
    eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX, { type: 'info', title: '修改批号', message: '请选择要修改的记录' })
  }
}

function showDeleteLotConfirm() {
  if (!lotFormData.id) {
    eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX, { type: 'info', title: '删除批号', message: '请选择要修改的记录' })
    return
  }
  eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX, { type: 'confirm', title: '删除批号', message: '是否删除该批号', action: () => lotDel() })
}

function lotCheckInput() {
  const selectedReagent = allReagentList.value.find((item) => item.value === lotFormData.reagentId)
  if (selectedReagent) lotFormData.reagentName = selectedReagent.label
  syncLotSubmitDisabled()
}

async function lotShow() {
  const data = await api_lot_show(lotState)
  lotState.tableData = data.data
  lotState.totalpage = data.meta.totalPage
}

async function lotDel() {
  if (lotFormData.id) {
    await api_lot_del(lotFormData.id)
    eventBus.emit(EVENT_TYPES.CLOSE_MESSAGEBOX)
    await lotShow()
  } else {
    eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX, { type: 'info', title: '删除批号', message: '请选择要修改的记录' })
  }
}

async function lotUpdate() {
  lotFormData.expirationdate = format_YYYYMMDDHHmm_iso(lotFormData.expirationdate)
  lotFormData.status = lotFormData.status === true ? 0 : 1
  await api_lot_update(lotFormData)
  lotState.drawer = false
  await lotShow()
  lotState.selectedRowId = null
  lotFormData.id = null
}

async function lotAdd() {
  lotFormData.expirationdate = format_YYYYMMDDHHmm_iso(lotFormData.expirationdate)
  lotFormData.status = lotFormData.status === true ? 0 : 1
  await api_lot_add(lotFormData)
  lotState.drawer = false
  await lotShow()
  lotState.selectedRowId = null
  lotFormData.id = null
}

async function listAllReagent() {
  const data = await api_reagent_showall()
  allReagentList.value = data.data.map((item) => ({
    label: item.name,
    value: item.id,
  }))
}

onMounted(async () => {
  await Promise.all([reagentShow(), lotShow(), listAllReagent()])
})
</script>

<style scoped>
.reagent-lot-page {
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
  gap: 12px;
  flex-wrap: nowrap;
}

.toolbar-search {
  width: 220px;
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
