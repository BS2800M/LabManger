<template>
  <div id="background" class="operation-page">
    <section
      class="panel-section"
      v-loading="state.loading"
      element-loading-text="正在加载操作记录..."
    >
      <div class="panel-header">
        <h3>操作查询</h3>
      </div>
      <div id="background2" class="toolbar">
        <el-input
          class="toolbar-input"
          v-model="state.reagentName"
          placeholder="试剂名称"
          @input="operation_show"
        />
        <el-input
          class="toolbar-input"
          v-model="state.barcodeNumber"
          placeholder="条码号"
          @input="operation_show"
        />
        <el-config-provider :locale="zhCn">
          <el-date-picker
            v-model="state.starttime_show"
            class="toolbar-date"
            type="date"
            placeholder="开始日期"
            size="default"
            @change="operation_show"
            value-format="YYYY-MM-DD 00:00:01"
          />
        </el-config-provider>
        <el-config-provider :locale="zhCn">
          <el-date-picker
            v-model="state.endtime_show"
            class="toolbar-date"
            type="date"
            placeholder="结束日期"
            size="default"
            @change="operation_show"
            value-format="YYYY-MM-DD 23:59:59"
          />
        </el-config-provider>
        <el-pagination
          class="toolbar-pagination"
          background
          layout="prev, pager, next"
          v-model:current-page="state.page"
          :page-count="state.totalpage"
          @change="operation_show"
        />
        <div class="export-button-container">
          <el-button id="export" type="primary" @click="handleExport">导出记录</el-button>
          <el-button id="view" type="primary" @click="view_record">查看记录</el-button>
          <el-button id="disable" type="primary" @click="showDisableRecordConfirm">禁用记录</el-button>
        </div>
      </div>

      <div class="operation-table">
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
    </section>
  </div>

  <el-drawer v-model="state.drawer" direction="rtl" size="70%" @open="state.selectedRowId = null" @close="resetFormData">
    <template #header>
      <span class="drawer-title">操作查询</span>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button size="large" type="primary" @click="barcodeprint">补打条码</el-button>
        <el-button size="large" type="primary" @click="state.drawer = false">关闭</el-button>
      </div>
    </template>
    <template #default>
      <div id="content1">
        <p>试剂名称</p>
        <el-input v-model="formData.reagentName" style="width: 300px" disabled />
        <p>试剂批号</p>
        <el-input v-model="formData.lotName" style="width: 300px" disabled />
        <p>动作</p>
        <el-input v-model="formData.action" style="width: 300px" disabled />
        <p>操作时间</p>
        <el-config-provider :locale="zhCn">
          <el-date-picker
            v-model="formData.createTime"
            type="datetime"
            size="default"
            value-format="YYYY-MM-DD HH:mm:ss"
            disabled
          />
        </el-config-provider>
        <p>条码号</p>
        <el-select-v2  v-model="formData.barcodeNumberselected" filterable :options="formData.barcodes" placeholder="选择条码号"  style="width: 300px"  />
        <p>序列号</p>
        <el-select-v2 v-model="formData.serialNumberselected" filterable :options="formData.serialNumbers" placeholder="选择序列号" style="width: 300px" />
        <p>操作人</p>
        <el-input v-model="formData.userName" style="width: 300px" disabled />
      </div>
      <div id="content2" style="position: absolute;left: 400px;top: 120px;">
        <p>实际试剂名称</p>
        <el-input v-model="formData.actualReagentName" style="width: 300px" disabled />
        <p>实际试剂批号</p>
        <el-input v-model="formData.actualLotName" style="width: 300px" disabled />
        <p>实际操作人</p>
        <el-input v-model="formData.actualUserName" style="width: 300px" disabled />
        <p>注释</p>
        <el-input v-model="formData.note" style="width: 300px" disabled />
      </div>

    </template>
  </el-drawer>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { api_operation_show, api_operation_disable } from '@/api/operation'
import { formatDateColumn, getnowtime, getnowtime_previousmonth, format_operation_action } from '@/utils/format'
import { format_YYYYMMDDHHmm_iso } from '@/utils/format'
import { operation_exporttoexcel_list } from '@/utils/exportexcel.js'
import { api_reagent_showall } from '@/api/reagent'
import { api_lot_showall } from '@/api/lot'
import { eventBus, EVENT_TYPES } from '@/utils/eventBus'
import { resolveSelectableRowClass } from '@/utils/crud'

const allreagentlist = ref([])

const state = reactive({
  selectedRowId: null,
  loading: false,
  reagentName: '',
  barcodeNumber: '',
  starttime: '',
  endtime: '',
  page: 1,
  totalpage: 1,
  pagesize: 20,
  starttime_show: getnowtime_previousmonth(),
  endtime_show: getnowtime(),
  drawer: false,
  tableData: [],
})
let operationShowReqId = 0

const formData = reactive({
  groupId: null,
  action: '',
  createTime: '',
  reagentName: '',
  lotName: '',
  note: '',
  barcodes: [],
  barcodeNumberselected: '',
  serialNumbers: [],
  serialNumberselected: '',
  userName: '',
  actualReagentName: '',
  actualLotName: '',
  actualUserName: '',

})
const tableColumns = [
  {
    key: 'createTime',
    dataKey: 'createTime',
    title: '时间',
    width: 180,
    flexGrow: 1,
    cellRenderer: ({ rowData }) => formatDateColumn(rowData, null, rowData.createTime),
  },
  {
    key: 'reagentName',
    dataKey: 'reagentName',
    title: '试剂名称',
    width: 150,
    flexGrow: 1,
    cellRenderer: ({ rowData }) => rowData.snapshots?.reagentName ?? '',
  },
  {
    key: 'lotName',
    dataKey: 'lotName',
    title: '批号',
    width: 150,
    flexGrow: 1,
    cellRenderer: ({ rowData }) => rowData.snapshots?.lotName ?? '',
  },
  { key: 'number', dataKey: 'number', title: '数量', width: 100, flexGrow: 1 },
  {
    key: 'action',
    dataKey: 'action',
    title: '动作',
    width: 120,
    flexGrow: 1,
    cellRenderer: ({ rowData }) => format_operation_action(rowData, null, rowData.action),
  },
  { key: 'note', dataKey: 'note', title: '注释', width: 180, flexGrow: 1 },
  {
    key: 'userName',
    dataKey: 'userName',
    title: '用户',
    width: 120,
    flexGrow: 1,
    cellRenderer: ({ rowData }) => rowData.snapshots?.userName ?? '',
  },
]

function resetFormData() {
  state.selectedRowId = null
  Object.assign(formData, {
    groupId: null,
    action: '',
    createTime: '',
    reagentName: '',
    lotName: '',
    note: '',
    barcodes: [],
    barcodeNumberselected: null,
    serialNumbers: [],
    serialNumberselected: null,
    userName: '',
    actualReagentName: '',
    actualLotName: '',
    actualUserName: '',

  })
}

function fillFormDataFromRow(rowData) {
  Object.assign(formData, {
    groupId: rowData.groupId,
    action: rowData.action === 1 ? '入库' : '出库',
    createTime: rowData.createTime,
    reagentName: rowData.snapshots.reagentName,
    lotName: rowData.snapshots.lotName,
    note: rowData.note,
    barcodes: rowData.barcodes.map(item => ({
      value: item,
      label: item,
    })),
    serialNumbers: rowData.serialNumbers.map(item => ({
      value: item,
      label: item,
    })),
    userName: rowData.snapshots.userName,
    actualReagentName: rowData.reagent.name,
    actualLotName: rowData.lot.name,
    actualUserName: rowData.user.userName,
  })
}

function getRowClass(rowData, rowIndex) {
  return resolveSelectableRowClass({
    rowData,
    rowIndex,
    selectedRowId: state.selectedRowId,
    getRowId: (row) => row.groupId,
    getStatusClass: ({ row }) => (row.status === 1 ? 'unactive-row' : 'normal-row'),
  })
}


async function handleRowClick({ rowData }) {
  if (state.selectedRowId === rowData.groupId) {
    resetFormData()
  }
  else{
    state.selectedRowId = rowData.groupId
    fillFormDataFromRow(rowData)
  }

}

async function operation_show() {
  const reqId = ++operationShowReqId
  state.loading = true
  state.starttime = format_YYYYMMDDHHmm_iso(state.starttime_show)
  state.endtime = format_YYYYMMDDHHmm_iso(state.endtime_show)
  try {
    const data = await api_operation_show({
      reagentName: state.reagentName,
      startTime: state.starttime,
      endTime: state.endtime,
      barcodeNumber: state.barcodeNumber,
      page: state.page,
      pageSize: state.pagesize,
    })
    if (reqId !== operationShowReqId) return
    state.tableData = data.data
    state.totalpage = data.meta?.totalPage ?? 1
  } finally {
    if (reqId === operationShowReqId) {
      state.loading = false
    }
  }
}

function barcodeprint() {
  if(!formData.barcodeNumberselected) {
    ElMessage.error('请选择条码号')
    return
  }
  ElMessage.warning('Web版本不支持自动补打，请使用浏览器打印')
}

function view_record() {
  state.selectedRowId = null
  state.drawer = true
}


function showDisableRecordConfirm() {
  if (!state.selectedRowId) {
    eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX, { type: 'info', title: '禁用记录', message: '请选择要禁用的记录' })
    return
  }
  eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX, { type: 'confirm', title: '禁用记录', message: '是否禁用该记录', action: () => disable_record() })
}

async function disable_record() {
  if (!state.selectedRowId) {
    eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX, { type: 'info', title: '禁用记录', message: '请选择要禁用的记录' })
    return
  }
  await api_operation_disable({ groupId: state.selectedRowId })
  resetFormData()
  state.drawer = false
  await operation_show()
  eventBus.emit(EVENT_TYPES.CLOSE_MESSAGEBOX)
}
function handleExport() {
  operation_exporttoexcel_list({
    reagentName: state.reagentName,
    startTime: format_YYYYMMDDHHmm_iso(state.starttime_show),
    endTime: format_YYYYMMDDHHmm_iso(state.endtime_show),
    barcodeNumber: state.barcodeNumber,
  })
}

onMounted(async () => {
  await operation_show()
  let data = await api_reagent_showall()
  allreagentlist.value = data.data.map((item) => ({
    value: item.id,
    label: item.name,
    name: item.name,
  }))
  data = await api_lot_showall()
})
</script>

<style scoped>
.operation-page {
  height: calc(100dvh - 82px);
  margin: 72px auto 0;
  padding: 8px 12px;
  max-width: 1900px;
  box-sizing: border-box;
}

.panel-section {
  height: 100%;
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

.toolbar {
  min-height: 90px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.toolbar-input {
  width: 220px;
}

.toolbar-date {
  width: 150px;
}

.toolbar-pagination {
  margin-right: auto;
}

.export-button-container {
  display: flex;
  gap: 10px;
}

.operation-table {
  margin-top: 8px;
  flex: 1;
  min-height: 0;
}
.drawer-title {
  font-size: 24px;
  font-weight: 800;
  color: var(--el-text-color-primary);
}
</style>
