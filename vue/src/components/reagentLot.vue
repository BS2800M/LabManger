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

    <el-drawer v-model="reagentState.drawer" direction="rtl" size="60%" @open="reagentState.selectedRowId = null">
      <template #header>
        <span class="drawer-title">试剂管理</span>
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
            <el-input v-model="reagentFormData.name" @input="syncReagentSubmitDisabled" style="width: 300px" placeholder="输入试剂的名称" />
            <p>DI（产品标识）</p>
            <div class="di-input-row">
              <el-input v-model="reagentFormData.di" class="di-input" placeholder="输入产品标识 DI" />
              <el-button type="primary" plain @click="formatDi">格式化</el-button>
            </div>
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
            <el-input-number v-model="reagentFormData.warnNumber" :min="-1" :max="9999" placeholder="0" @change="syncReagentSubmitDisabled" />
            <p>预警天数</p>
            <el-input-number v-model="reagentFormData.warnDays" :min="0" :max="9999" placeholder="0" @change="syncReagentSubmitDisabled" />
            <p>价格</p>
            <el-input-number v-model="reagentFormData.price" :min="0" :max="99999999" placeholder="0" @change="syncReagentSubmitDisabled" />
            <p>创建时间</p>
            <el-input disabled v-model="reagentFormData.createTime" style="width: 300px" placeholder="系统自动生成" />
            <p>生成初始批号</p>
            <el-switch v-model="reagentFormData.generateLot" :disabled="reagentState.editbox_disablegeneratelot" size="large" @change="syncReagentSubmitDisabled" />
            <p>是否启用</p>
            <el-switch
              v-model="reagentFormData.status"
              size="large"
              active-text="是"
              inactive-text="否"
              @change="syncReagentSubmitDisabled"
            />
          </div>
        </div>
      </template>
    </el-drawer>

    <el-drawer v-model="lotState.drawer" direction="rtl" size="30%" @open="lotState.selectedRowId = null">
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
          <p>所属试剂名</p>
          <reagent-select
            class="lot-reagent-select"
            v-model="lotFormData.reagentId"
            :refresh-trigger="lotReagentRefreshTrigger"
            placeholder="选择试剂"
            @change="lotCheckInput"
            @selected-change="handleLotReagentSelected"
          />
          <p>是否启用</p>
          <el-switch
            v-model="lotFormData.status"
            active-text="是"
            inactive-text="否"
            @change="lotCheckInput"
          />
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { onMounted, reactive, ref } from 'vue'
import { GS1Field, GS1Parser } from '@valentynb/gs1-parser'
import ReagentSelect from '@/components/reagent_select.vue'
import { api_reagent_show, api_reagent_del, api_reagent_update, api_reagent_add } from '@/api/reagent'
import { api_lot_show, api_lot_del, api_lot_update, api_lot_add } from '@/api/lot'
import { format_iso_YYYYMMDDHHmm, format_YYYYMMDDHHmm_iso, formatDateColumn } from '@/utils/format'
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
  di: '',
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
  { key: 'di', dataKey: 'di', title: 'DI（产品标识）', width: 180, flexGrow: 1 },
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
const lotReagentRefreshTrigger = ref(0)
const gs1Parser = new GS1Parser()

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
    di: '',
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
    di: rowData.di ?? '',
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
  syncSubmitDisabledByFields({
    formData: reagentFormData,
    requiredFields: reagentRequiredFields,
    target: reagentState,
    disabledKey: 'submitDisabled',
  })
}

function formatDi() {
  const udi = String(reagentFormData.di ?? '').trim()
  if (!udi) {
    reagentFormData.di = ''
    return
  }

  try {
    const decoded = gs1Parser.decode(udi)
    const di = decoded.data[GS1Field.GTIN]?.data
    reagentFormData.di = typeof di === 'string' ? di : ''
  } catch {
    reagentFormData.di = ''
  }
}

function openReagentDrawer(mode) {
  openDrawerByMode({
    state: reagentState,
    mode,
    beforeOpen: () => { reagentState.editbox_disablegeneratelot = mode === 'edit' },
    afterOpen: syncReagentSubmitDisabled,
  })
}

function handleReagentRowClick({ rowData }) {
  toggleRowSelection({
    rowData,
    isSameSelection: reagentState.selectedRowId === rowData.id,
    setSelectedRowId: (value) => { reagentState.selectedRowId = value },
    onSelect: fillReagentFormDataFromRow,
    onDeselect: resetReagentFormData,
  })
  syncReagentSubmitDisabled()
}

function getReagentRowClass(rowData, rowIndex) {
  return resolveSelectableRowClass({
    rowData,
    rowIndex,
    selectedRowId: reagentState.selectedRowId,
    getStatusClass: ({ row }) => (row.status === 1 ? 'unactive-row' : 'normal-row'),
  })
}



function openReagentAddDrawer() {
  openAddDrawerFlow({
    setSelectedRowId: (value) => { reagentState.selectedRowId = value },
    resetFormData: () => resetReagentFormData({ generateLot: true }),
    onOpen: () => openReagentDrawer('add'),
  })
}

function openReagentEditDrawer() {
  tryOpenEditDrawerBySelection({
    selectedRowId: reagentState.selectedRowId,
    title: '修改试剂',
    emptyMessage: '请选择要修改的记录',
    onOpen: () => openReagentDrawer('edit'),
  })
}

function showDeleteReagentConfirm() {
  showDeleteConfirmBySelection({
    selectedRowId: reagentState.selectedRowId,
    title: '删除试剂',
    emptyMessage: '请选择要删除的试剂',
    confirmMessage: '是否删除该试剂,删除后将同时删除该试剂的全部批号',
    onConfirm: () => reagentDel(),
  })
}

async function reagentShow() {
  const data = await api_reagent_show(reagentState)
  reagentState.tableData = data.data
  reagentState.totalpage = data.meta.totalPage
}

async function reagentDel() {
  await deleteWithSelection({
    selectedRowId: reagentState.selectedRowId,
    title: '删除试剂',
    emptyMessage: '请选择要删除的试剂',
    deleteAction: (id) => api_reagent_del(id),
    onAfterDelete: async () => {
      await reagentShow()
      await lotShow()
      reagentState.selectedRowId = null
      resetReagentFormData()
      lotReagentRefreshTrigger.value += 1
    },
  })
}

async function reagentUpdate() {
  reagentFormData.status = reagentFormData.status === true ? 0 : 1
  await api_reagent_update(reagentFormData)
  reagentState.drawer = false
  await reagentShow()
  reagentState.selectedRowId = null
  reagentFormData.id = null
  await lotShow()
  lotReagentRefreshTrigger.value += 1
}

async function reagentAdd() {
  reagentFormData.status = reagentFormData.status === true ? 0 : 1
  await api_reagent_add(reagentFormData)
  reagentState.drawer = false
  await reagentShow()
  reagentState.selectedRowId = null
  reagentFormData.id = null
  await lotShow()
  lotReagentRefreshTrigger.value += 1
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
  syncSubmitDisabledByFields({
    formData: lotFormData,
    requiredFields: lotRequiredFields,
    target: lotState,
    disabledKey: 'submitDisabled',
  })
}

function openLotDrawer(mode) {
  openDrawerByMode({
    state: lotState,
    mode,
    beforeOpen: () => { },
    afterOpen: syncLotSubmitDisabled,
  })
}

function handleLotRowClick({ rowData }) {
  toggleRowSelection({
    rowData,
    isSameSelection: lotState.selectedRowId === rowData.id,
    setSelectedRowId: (value) => { lotState.selectedRowId = value },
    onSelect: fillLotFormDataFromRow,
    onDeselect: resetLotFormData,
  })
  syncLotSubmitDisabled()
}

function getLotRowClass(rowData, rowIndex) {
  return resolveSelectableRowClass({
    rowData,
    rowIndex,
    selectedRowId: lotState.selectedRowId,
    getStatusClass: ({ row }) => (row.status === 1 ? 'unactive-row' : 'normal-row'),
  })
}

function openLotAddDrawer() {
  openAddDrawerFlow({
    setSelectedRowId: (value) => { lotState.selectedRowId = value },
    resetFormData: resetLotFormData,
    onOpen: () => openLotDrawer('add'),
  })
}

function openLotEditDrawer() {
  tryOpenEditDrawerBySelection({
    selectedRowId: lotState.selectedRowId,
    title: '修改批号',
    emptyMessage: '请选择要修改的批号',
    onOpen: () => openLotDrawer('edit'),
  })
}

function showDeleteLotConfirm() {
  showDeleteConfirmBySelection({
    selectedRowId: lotState.selectedRowId,
    title: '删除批号',
    emptyMessage: '请选择要删除的批号',
    confirmMessage: '是否删除该批号',
    onConfirm: () => lotDel(),
  })
}

function lotCheckInput() {
  syncLotSubmitDisabled()
}

function handleLotReagentSelected(selectedReagent) {
  lotFormData.reagentName = selectedReagent?.name ?? '请选择试剂'
  syncLotSubmitDisabled()
}

async function lotShow() {
  const data = await api_lot_show(lotState)
  lotState.tableData = data.data
  lotState.totalpage = data.meta.totalPage
}

async function lotDel() {
  await deleteWithSelection({
    selectedRowId: lotState.selectedRowId,
    title: '删除批号',
    emptyMessage: '请选择要删除的批号',
    deleteAction: (id) => api_lot_del(id),
    onAfterDelete: async () => {
      await lotShow()
      lotState.selectedRowId = null
      resetLotFormData()
    },
  })
}

async function lotUpdate() {
  const expirationDate = format_YYYYMMDDHHmm_iso(lotFormData.expirationdate)
  lotFormData.status = lotFormData.status === true ? 0 : 1
  await api_lot_update({
    id: lotFormData.id,
    reagentId: lotFormData.reagentId,
    name: lotFormData.name,
    expirationDate,
    status: lotFormData.status,
  })
  lotState.drawer = false
  await lotShow()
  lotState.selectedRowId = null
  lotFormData.id = null
}

async function lotAdd() {
  const expirationDate = format_YYYYMMDDHHmm_iso(lotFormData.expirationdate)
  lotFormData.status = lotFormData.status === true ? 0 : 1
  await api_lot_add({
    name: lotFormData.name,
    reagentId: lotFormData.reagentId,
    expirationDate,
  })
  lotState.drawer = false
  await lotShow()
  lotState.selectedRowId = null
  lotFormData.id = null
}

onMounted(async () => {
  await Promise.all([reagentShow(), lotShow()])
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

.di-input-row {
  width: 300px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.di-input {
  flex: 1;
}

.lot-reagent-select {
  width: 300px;
}
</style>
