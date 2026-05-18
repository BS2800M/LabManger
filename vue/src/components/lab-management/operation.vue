<template>
  <div
    class="lm-page lm-page--split"
    v-loading="pageLoading"
    element-loading-text="正在加载操作记录..."
  >
    <section class="lm-section">
      <div class="lm-section-header">
        <h3>操作查询</h3>
      </div>
      <div class="lm-toolbar">
        <el-input
          class="lm-toolbar-input"
          style="width: 250px"
          v-model="state.reagentName"
          placeholder="试剂名称"
          @input="operation_show"
        />
        <el-input
          class="lm-toolbar-input"
          style="width: 250px"
          v-model="state.barcodeNumber"
          placeholder="条码号"
          @input="operation_show"
        />
        <el-input
          class="lm-toolbar-input"
          style="width: 250px"
          v-model="state.udi"
          placeholder="UDI"
          @input="operation_show"
        />
        <el-config-provider :locale="zhCn">
          <el-date-picker
            v-model="state.starttime_show"
            class="lm-toolbar-date"
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
            class="lm-toolbar-date"
            type="date"
            placeholder="结束日期"
            size="default"
            @change="operation_show"
            value-format="YYYY-MM-DD 23:59:59"
          />
        </el-config-provider>
        <el-pagination
          class="lm-toolbar-pagination"
          background
          layout="prev, pager, next"
          v-model:current-page="state.page"
          :page-count="state.totalpage"
          @change="operation_show"
        />
        <div class="lm-toolbar-actions">
          <el-button id="export" type="primary" @click="handleExport">导出记录</el-button>
          <el-button id="view" type="primary" @click="view_record">查看记录</el-button>
          <el-button id="disable" type="primary" @click="showDisableRecordConfirm">禁用记录</el-button>
        </div>
      </div>
      <div class="lm-toolbar">
        
      </div>
      <div class="lm-table-wrap">
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
            />
          </template>
        </el-auto-resizer>
      </div>
    </section>
    <section class="operation-detail lm-section">
      <div class="lm-section-header">
        <h3>操作详情</h3>
      </div>
      <div class="lm-toolbar">
        <el-pagination
          class="lm-toolbar-pagination"
          background
          layout="prev, pager, next"
          v-model:current-page="state.detailpage"
          :page-count="state.detailtotalpage"
          @change="operation_showdetail"
          :disabled="!state.selectedRowId"
        />
        <div class="lm-toolbar-actions">
          <el-button id="barcodeprint" type="primary" @click="barcodeprint" :disabled="!state.selectedRowId">补打条码</el-button>
          <el-button id="copyudi" type="primary" @click="copyUdi" :disabled="!state.selectedRowId">复制UDI</el-button>
        </div>
      </div>
      <div class="lot-selected-tip">
        <span v-if="state.selectedRowId">
          当前记录：ID {{ formData.batchId }} / {{ formData.actualReagentName }} / {{ formData.actualLotName }} / {{ formData.action }}
        </span>
        <span v-else>请在上表勾选一条操作记录后查看详情</span>
      </div>

      <div class="lm-table-wrap">
        <el-auto-resizer>
          <template #default="{ width, height }">
            <el-table-v2
              :columns="tableDetailColumns"
              :data="state.detailTableData"
              :width="width"
              :height="height"
              :row-height="36"
              :header-height="34"
              :row-class="({ rowData, rowIndex }) => getDetailRowClass(rowData, rowIndex)"
            />
          </template>
        </el-auto-resizer>
      </div>
    </section>
  </div>

  <el-drawer v-model="state.drawer" direction="rtl" size="70%" @close="resetFormData">
    <template #header>
      <span class="operation-drawer-title lm-drawer-title">操作查询</span>
    </template>
    <template #default>
      <div class="operation-drawer-grid lm-drawer-grid">
        <div class="operation-drawer-main">
          <p>动作</p>
          <el-input v-model="formData.action" style="width: 300px" disabled />
          <p>操作时间</p>
          <el-config-provider :locale="zhCn">
            <el-date-picker
              v-model="formData.createdAt"
              type="datetime"
              size="default"
              value-format="YYYY-MM-DD HH:mm:ss"
              disabled
            />
          </el-config-provider>
          <p>操作人</p>
          <el-input v-model="formData.userName" style="width: 300px" disabled />
        </div>
        <div class="operation-drawer-secondary">
          <p>实际试剂名称</p>
          <el-input v-model="formData.actualReagentName" style="width: 300px" disabled />
          <p>实际试剂批号</p>
          <el-input v-model="formData.actualLotName" style="width: 300px" disabled />
          <p>实际操作人</p>
          <el-input v-model="formData.actualUserName" style="width: 300px" disabled />
          <p>注释</p>
          <el-input v-model="formData.note" style="width: 300px" disabled />
        </div>
      </div>

    </template>
  </el-drawer>
</template>

<script setup>
import { h, onMounted, reactive } from 'vue'
import { ElCheckbox, ElConfigProvider, ElMessage } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { api_operation_show, api_operation_disable,api_operation_showdetail } from '@/api/operation'
import { api_barcode_printer_print } from '@/api/barcodePrinter'
import { formatDateColumn, getnowtime, getnowtime_previousmonth, format_operation_action } from '@/utils/format'
import { format_YYYYMMDDHHmm_iso } from '@/utils/format'
import { operation_exporttoexcel_list } from '@/utils/exportexcel.js'
import { createSingleToggleSelection, tryOpenEditDrawerBySelection } from '@/utils/crud'
import { closeMessageBox, openConfirmMessageBox, openInfoMessageBox } from '@/utils/messagebox'
import { usePageLoading } from '@/utils/pageLoading'




const state = reactive({
  selectedRowId: null,
  selectedDetailRowId: null,
  reagentName: '',
  barcodeNumber: '',
  udi: '',
  starttime: '',
  endtime: '',
  page: 1,
  totalpage: 1,
  pagesize: 10,
  detailpage: 1,
  detailtotalpage: 1,
  detailpagesize: 50,
  starttime_show: getnowtime_previousmonth(),
  endtime_show: getnowtime(),
  drawer: false,
  tableData: [],
  detailTableData: [],
})
const { pageLoading, withPageLoading } = usePageLoading()

let operationShowReqId = 0

const formData = reactive({
  batchId: null,
  action: '',
  createdAt: '',
  note: '',
  detailData: [],
  userName: '',
  actualReagentName: '',
  actualLotName: '',
  actualUserName: '',
})
const detailFormData = reactive({
  barcodeNumber: '',
  udi: '',
  id: null,
  reagentNameSnapshot:null,
  lotNameSnapshot:null,
})
const dataDetailColumns = [
  {
    key: 'id',
    dataKey: 'id',
    title: 'ID',
    width: 100,
    flexGrow: 1,
    cellRenderer: ({ rowData }) => rowData.id,
  },
  {
    key: 'barcodeNumber',
    dataKey: 'barcodeNumber',
    title: '条码号',
    width: 300,
    flexGrow: 1,

    cellRenderer: ({ rowData }) => rowData.barcodeNumber,
  },
  {
    key: 'udi',
    dataKey: 'udi',
    title: 'UDI',
    width: 700,
    flexGrow: 1,
    cellRenderer: ({ rowData }) => rowData.udi,
  },
  {
    key: 'batch.reagentNameSnapshot',
    dataKey: 'batch.reagentNameSnapshot',
    title: '试剂名称',
    width: 300,
    flexGrow: 1,
  },
  {
    key: 'batch.lotNameSnapshot',
    dataKey: 'batch.lotNameSnapshot',
    title: '批号',
    width: 300,
    flexGrow: 1,
  }
]

const tableColumns = [
  {
    key: 'operation-select-checkbox',
    dataKey: 'operation-select-checkbox',
    title: '',
    width: 56,
    cellRenderer: ({ rowData }) => h(ElCheckbox, {
      modelValue: state.selectedRowId === rowData.id,
      'aria-label': 'select-row',
      onChange: (checked) => {
        handleOperationCheckboxChange(checked, rowData)
      },
    }),
  },
  {
    key: 'createdAt',
    dataKey: 'createdAt',
    title: '时间',
    width: 180,
    flexGrow: 1,
    cellRenderer: ({ rowData }) => formatDateColumn(rowData, null, rowData.createdAt),
  },
  {
    key: 'reagentName',
    dataKey: 'reagentName',
    title: '试剂名称',
    width: 150,
    flexGrow: 1,
    cellRenderer: ({ rowData }) => rowData.reagentNameSnapshot ?? '',
  },
  {
    key: 'lotName',
    dataKey: 'lotName',
    title: '批号',
    width: 150,
    flexGrow: 1,
    cellRenderer: ({ rowData }) => rowData.lotNameSnapshot ?? '',
  },
  { key: 'actionNum', dataKey: 'actionNum', title: '数量', width: 100, flexGrow: 1 },
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
    cellRenderer: ({ rowData }) => rowData.userNameSnapshot ?? '',
  },
]

const tableDetailColumns = [
  {
    key: 'operation-detail-select-checkbox',
    dataKey: 'operation-detail-select-checkbox',
    title: '',
    width: 56,
    cellRenderer: ({ rowData }) => h(ElCheckbox, {
      modelValue: state.selectedDetailRowId === rowData.id,
      'aria-label': 'select-detail-row',
      onChange: (checked) => {
        handleDetailCheckboxChange(checked, rowData)
      },
    }),
  },
  ...dataDetailColumns,
]

const operationCheckboxSelection = createSingleToggleSelection({
  getSelectedRowId: () => state.selectedRowId,
  setSelectedRowId: (value) => { state.selectedRowId = value },
  getRowId: (row) => row.id,
  onSelect: (rowdata) => {
    fillFormDataFromRow(rowdata)
    resetDetailArea()
    state.detailpage = 1
    operation_showdetail()
  },
  onDeselect: resetFormData,
})

const detailCheckboxSelection = createSingleToggleSelection({
  getSelectedRowId: () => state.selectedDetailRowId,
  setSelectedRowId: (value) => { state.selectedDetailRowId = value },
  getRowId: (row) => row.id,
  onSelect: fillDetailFormDataFromRow,
  onDeselect: resetDetailFormData,
})
function resetFormData() {
  state.selectedRowId = null
  resetDetailArea()
  Object.assign(formData, {
    batchId: null,
    action: '',
    createdAt: '',
    note: '',
    detailData: [],
    userName: '',
    actualReagentName: '',
    actualLotName: '',
    actualUserName: '',
  })
}

function fillFormDataFromRow(rowData) {
  Object.assign(formData, {
    batchId: rowData.id,
    action: rowData.action === 'inbound' ? '入库' : '出库',
    createdAt: rowData.createdAt,
    note: rowData.note,
    userName: rowData.userNameSnapshot,
    actualReagentName: rowData.reagentNameSnapshot,
    actualLotName: rowData.lotNameSnapshot,
    actualUserName: rowData.userNameSnapshot,
  })
  state.selectedRowId = rowData.id

}
function fillDetailFormDataFromRow(rowData) {
  Object.assign(detailFormData, {
    barcodeNumber: rowData.barcodeNumber,
    udi: rowData.udi,
    id: rowData.id,
    reagentNameSnapshot: rowData.batch?.reagentNameSnapshot ?? '',
    lotNameSnapshot: rowData.batch?.lotNameSnapshot ?? '',
  })
}

function resetDetailFormData() {
  state.selectedDetailRowId = null
  Object.assign(detailFormData, {
    barcodeNumber: '',
    udi: '',
    id: null,
    reagentNameSnapshot: '',
    lotNameSnapshot: '',
  })
}

function resetDetailArea() {
  resetDetailFormData()
  state.detailTableData = []
  state.detailpage = 1
  state.detailtotalpage = 1
}

function getRowClass(rowData, rowIndex) {
  return rowData.status === 'Disable' ? 'unactive-row' : 'normal-row'
}

function getDetailRowClass(rowData, rowIndex) {
  return rowData.status === 'Disable' ? 'unactive-row' : 'normal-row'
}

function handleOperationCheckboxChange(checked, rowData) {
  operationCheckboxSelection.onToggleByChecked({ checked, rowData })
}

function handleDetailCheckboxChange(checked, rowData) {
  detailCheckboxSelection.onToggleByChecked({ checked, rowData })
}
async function operation_show() {
  const reqId = ++operationShowReqId
  resetFormData()
  return withPageLoading(async () => {
    state.starttime = format_YYYYMMDDHHmm_iso(state.starttime_show)
    state.endtime = format_YYYYMMDDHHmm_iso(state.endtime_show)
    const data = await api_operation_show({
      reagentName: state.reagentName,
      startTime: state.starttime,
      endTime: state.endtime,
      barcodeNumber: state.barcodeNumber,
      udi: state.udi,
      page: state.page,
      pageSize: state.pagesize,
    })
    if (reqId !== operationShowReqId) return
    state.tableData = data.data
    state.totalpage = data.meta?.totalPage ?? 1
  })
}

async function operation_showdetail() {
  if (!state.selectedRowId) {
    resetDetailArea()
    return
  }
  return withPageLoading(async () => {
    const data = await api_operation_showdetail({
      batchId: state.selectedRowId,
      barcodeNumber: state.barcodeNumber,
      udi: state.udi,
      page: state.detailpage,
      pageSize: state.detailpagesize,
    })
    state.detailTableData = data.data
    state.detailtotalpage = data.meta?.totalPage ?? 1
  })
}

async function barcodeprint() {
  if(!state.selectedRowId) {
    ElMessage.warning('请先选择操作记录')
    return
  }
  if(!detailFormData.barcodeNumber) {
    ElMessage.error('请选择条码号')
    return
  }
  const reagentName = String(detailFormData.reagentNameSnapshot).trim()
  const lotName = String(detailFormData.lotNameSnapshot).trim()
  if (!reagentName || !lotName) {
    ElMessage.error('缺少试剂或批号信息，无法补打')
    return
  }

  try {
    await withPageLoading(async () => {
      const result = await api_barcode_printer_print({
        data: [
          {
            barcodeNumber: detailFormData.barcodeNumber,
            reagentName:detailFormData.reagentNameSnapshot,
            lotName:detailFormData.lotNameSnapshot,
          },
        ],
      })

      if (result?.success) {
        ElMessage.success(result?.data?.message || '补打条码请求成功')
        return
      }
      ElMessage.error(result?.error?.message || '补打条码失败')
    })
  } catch {
    ElMessage.error('补打条码失败，请确认本机打印服务已启动')
  }
}



async function copyUdi() {
  if(!state.selectedRowId) {
    ElMessage.warning('请先选择操作记录')
    return
  }

  const udi = String(detailFormData.udi ?? '').trim()

  if(!udi) {
    ElMessage.warning('请选择UDI')
    return
  }
  if (!navigator.clipboard?.writeText) {
    ElMessage.error('当前环境不支持剪贴板 API')
    return
  }
  try {
    await navigator.clipboard.writeText(udi)
    ElMessage.success("UDI已复制")
  } catch {
    ElMessage.error('复制失败，请在 localhost/127.0.0.1 或 https 环境下使用')
  }
}


function view_record() {
  tryOpenEditDrawerBySelection({
    selectedRowId: state.selectedRowId,
    title: '查看记录',
    emptyMessage: '请选择要查看的记录',
    onOpen: () => { state.drawer = true },
  })
}


function showDisableRecordConfirm() {
  if (!state.selectedRowId) {
    openInfoMessageBox({ title: '禁用记录', message: '请选择要禁用的记录' })
    return
  }
  openConfirmMessageBox({ title: '禁用记录', message: '是否禁用该记录', action: () => disable_record() })
}

async function disable_record() {
  if (!state.selectedRowId) {
    openInfoMessageBox({ title: '禁用记录', message: '请选择要禁用的记录' })
    return
  }
  await withPageLoading(async () => {
    await api_operation_disable({ batchId: state.selectedRowId })
    resetFormData()
    state.drawer = false
    await operation_show()
    closeMessageBox()
  })
}
function handleExport() {
  operation_exporttoexcel_list({
    reagentName: state.reagentName,
    startTime: format_YYYYMMDDHHmm_iso(state.starttime_show),
    endTime: format_YYYYMMDDHHmm_iso(state.endtime_show),
    barcodeNumber: state.barcodeNumber,
    udi: state.udi,
  })
}
onMounted(() => {
  operation_show()
})

</script>

<style scoped>


.lot-selected-tip {
  margin-top: 8px;
  color: var(--el-text-color-regular);
  font-size: 13px;
}



@media (max-width: 900px) {
  .operation-drawer-grid {
    grid-template-columns: 1fr;
  }
}

</style>

