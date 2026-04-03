<template>
  <div
    id="background"
    class="operation-page"
    v-loading="pageLoading"
    element-loading-text="正在加载操作记录..."
  >
    <section class="panel-section">
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
        <el-input
          class="toolbar-input"
          v-model="state.udi"
          placeholder="UDI"
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
        <el-button size="large" type="primary" @click="copyUdi">复制UDI</el-button>
        <el-button size="large" type="primary" @click="state.drawer = false">关闭</el-button>
      </div>
    </template>
    <template #default>
      <div class="drawer-form-grid">
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
          <p>操作人</p>
          <el-input v-model="formData.userName" style="width: 300px" disabled />
        </div>
        <div id="content2">
          <p>实际试剂名称</p>
          <el-input v-model="formData.actualReagentName" style="width: 300px" disabled />
          <p>实际试剂批号</p>
          <el-input v-model="formData.actualLotName" style="width: 300px" disabled />
          <p>实际操作人</p>
          <el-input v-model="formData.actualUserName" style="width: 300px" disabled />
          <p>注释</p>
          <el-input v-model="formData.note" style="width: 300px" disabled />
        </div>
        <div id="content3">
          <p>操作详情</p>
            <div class="operationdetail-table">
              <el-auto-resizer>
                <template #default="{ width, height }">
                  <el-table-v2
                    :columns="tableDetailColumns"
                    :data="formData.detailData"
                    :width="width"
                    :height="height"
                    :row-height="36"
                    :header-height="34"
                    :row-event-handlers="{ onClick: handleDetailRowClick }"
                    :row-class="({ rowData, rowIndex }) => getDetailRowClass(rowData, rowIndex)"
                  />
                </template>
              </el-auto-resizer>
            </div>
        </div>
      </div>

    </template>
  </el-drawer>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { api_operation_show, api_operation_disable } from '@/api/operation'
import { api_barcode_printer_print } from '@/api/barcodePrinter'
import { formatDateColumn, getnowtime, getnowtime_previousmonth, format_operation_action } from '@/utils/format'
import { format_YYYYMMDDHHmm_iso } from '@/utils/format'
import { operation_exporttoexcel_list } from '@/utils/exportexcel.js'
import { api_reagent_showall } from '@/api/reagent'
import { api_lot_showall } from '@/api/lot'
import { resolveSelectableRowClass } from '@/utils/crud'
import { closeMessageBox, openConfirmMessageBox, openInfoMessageBox } from '@/utils/messagebox'
import { usePageLoading } from '@/utils/pageLoading'

const allreagentlist = ref([])

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
  pagesize: 20,
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
  createTime: '',
  reagentName: '',
  lotName: '',
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
    cellRenderer: ({ rowData }) => rowData.userNameSnapshot ?? '',
  },
]
const tableDetailColumns = [
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
]
function resetFormData() {
  state.selectedRowId = null
  Object.assign(formData, {
    batchId: null,
    action: '',
    createTime: '',
    reagentName: '',
    lotName: '',
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
    batchId: rowData.batchId,
    action: rowData.action === 1 ? '入库' : '出库',
    createTime: rowData.createTime,
    reagentName: rowData.reagentNameSnapshot,
    lotName: rowData.lotNameSnapshot,
    note: rowData.note,
    detailData: rowData.detailData.map((item, index) => ({
      barcodeNumber: item.barcodeNumber,
      udi: item.udi,
      id: item.id ?? `${rowData.batchId}-${index}`,
    })),
    userName: rowData.userNameSnapshot,
    actualReagentName: rowData.reagent.name,
    actualLotName: rowData.lot.name,
    actualUserName: rowData.user.userName,
  })

}
function fillDetailFormDataFromRow(rowData) {
  Object.assign(detailFormData, {
    barcodeNumber: rowData.barcodeNumber,
    udi: rowData.udi,
    id: rowData.id,
  })
}

function resetDetailFormData() {
  state.selectedDetailRowId = null
  Object.assign(detailFormData, {
    barcodeNumber: '',
    udi: '',
    id: null,
  })
}

function getRowClass(rowData, rowIndex) {
  return resolveSelectableRowClass({
    rowData,
    rowIndex,
    selectedRowId: state.selectedRowId,
    getRowId: (row) => row.batchId,
    getStatusClass: ({ row }) => (row.status === 1 ? 'unactive-row' : 'normal-row'),
  })
}

function getDetailRowClass(rowData, rowIndex) {
  return resolveSelectableRowClass({
    rowData,
    rowIndex,
    selectedRowId: state.selectedDetailRowId,
    getRowId: (row) => row.id,
    defaultClass: 'normal-row',
  })
}

async function handleRowClick({ rowData }) {
  if (state.selectedRowId === rowData.batchId) {
    resetFormData()
  }
  else{
    state.selectedRowId = rowData.batchId
    fillFormDataFromRow(rowData)
  }
}

async function handleDetailRowClick({ rowData }) {

  if (state.selectedDetailRowId === rowData.id) {
    resetDetailFormData()
  }
  else{
    state.selectedDetailRowId = rowData.id
    fillDetailFormDataFromRow(rowData)
  }
}
async function operation_show() {
  const reqId = ++operationShowReqId
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

async function barcodeprint() {
  if(!detailFormData.barcodeNumber) {
    ElMessage.error('请选择条码号')
    return
  }
  const reagentName = String(
    formData.reagentName || formData.actualReagentName || '',
  ).trim()
  const lotName = String(formData.lotName || formData.actualLotName || '').trim()
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
            reagentName,
            lotName,
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
  state.selectedRowId = null
  state.drawer = true
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

onMounted(async () => {
  await withPageLoading(async () => {
    await operation_show()
    let data = await api_reagent_showall()
    allreagentlist.value = data.data.map((item) => ({
      value: item.id,
      label: item.name,
      name: item.name,
    }))
    data = await api_lot_showall()
  })
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

.drawer-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 36px;
  align-items: start;
}



#content3 {
  grid-column: 1 / -1;
  min-width: 0;
}

.operationdetail-table {
  margin-top: 8px;
  height: 260px;
  min-height: 220px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  overflow: hidden;
  max-width: 70%;
}



@media (max-width: 900px) {
  .drawer-form-grid {
    grid-template-columns: 1fr;
  }
}

.drawer-title {
  font-size: 24px;
  font-weight: 800;
  color: var(--el-text-color-primary);
}



</style>
