<template>
    <div
      class="inbound-page"
      v-loading="pageLoading"
      element-loading-text="正在处理入库请求..."
    >
      <section class="inbound-section">
        <div class="inbound-section-header">
          <h3>快速入库</h3>
        </div>
        <div class="inbound-quick-row">
            <span class="inbound-quick-label">医疗器械唯一标识</span>
            <UdiScanHint />
            <el-input
                v-model="quickInboundDisplay"
                class="inbound-quick-input"
                placeholder="请输入或扫描UDI"
                clearable
                @keydown.enter.prevent="handleQuickInbound"
            />
            <el-input
                v-model="quickInboundFormdata.note"
                class="inbound-quick-note"
                placeholder="注释（可选）"
                clearable
                @keydown.enter.prevent="handleQuickInbound"
            />
            <el-switch
                v-model="quickInboundFormdata.allowExpiringInbound"
                size="large"
                active-text="允许入库临期试剂"
                inactive-text="禁止入库临期试剂"
                @change="saveAllowExpiring"
            />
            <button class="stock-action-btn" @click="handleQuickInbound">
              <span>入库</span>
            </button>
        </div>
      </section>

      <section class="inbound-section inbound-standard">
        <div class="inbound-section-header">
          <h3>常规入库</h3>
        </div>
        <div class="inbound-form-grid">
            <div class="inbound-field-row">
                <span class="inbound-field-label">试剂</span>
                <reagent-select
                    class="inbound-field-control"
                    v-model="inboundFormdata.reagentid"
                    placeholder="选择试剂"
                    @options-loaded="handleReagentOptionsLoaded"
                    @change="handleReagentChange"
                />
            </div>
            <div class="inbound-field-row">
                <span class="inbound-field-label">批号</span>
                <lot-select
                    class="inbound-field-control"
                    v-model="inboundFormdata.lotid"
                    :reagent-id="inboundFormdata.reagentid"
                    placeholder="选择批号"
                    @options-loaded="handleLotOptionsLoaded"
                    @change="handleLotChange"
                />
            </div>
            <div class="inbound-field-row">
                <span class="inbound-field-label">数量</span>
                <el-input-number
                    class="inbound-field-control inbound-field-control--small"
                    v-model="inboundFormdata.number"
                    :min="1"
                    :max="9999"
                    placeholder="0"
                    @change="syncSubmitDisabled"
                />
            </div>
            <div class="inbound-field-row">
                <span class="inbound-field-label">注释</span>
                <el-input
                    class="inbound-field-control"
                    v-model="inboundFormdata.note"
                    placeholder="可填写注释"
                />
            </div>
            <div class="inbound-field-row">
                <span class="inbound-field-label">临期</span>
                <el-switch
                    v-model="inboundFormdata.allowExpiringInbound"
                    size="large"
                    active-text="允许入库临期试剂"
                    inactive-text="禁止入库临期试剂"
                    @change="saveAllowExpiring"
                />
            </div>
            <div class="inbound-field-row">
                <span class="inbound-field-label">条码</span>
                <el-switch
                    v-model="inboundFormdata.autoPrintBarcode"
                    size="large"
                    active-text="自动打印条码"
                    inactive-text="不打印条码"
                    @change="saveAllowExpiring"
                />
            </div>
        </div>
        <div class="inbound-form-actions">
            <el-button
                class="inbound-prepare-btn"
                type="primary"
                :disabled="inboundFormdata.submitDisabled"
                @click="ready_inbound"
            >准备入库</el-button>
        </div>
        <div class="inbound-table-wrap">
          <el-auto-resizer>
            <template #default="{ width, height }">
              <el-table-v2
                :columns="tableColumns"
                :data="inboundFormdata.tableData"
                :width="width"
                :height="height"
                :row-height="36"
                :header-height="34"
                :row-class="() => 'normal-row'"
              />
            </template>
          </el-auto-resizer>
        </div>
        <div class="inbound-footer-actions">
          <button class="stock-action-btn" @click="inbound">
              <span>入库</span>
          </button>
        </div>
      </section>
      <svg class="inbound-barcode"></svg>
    </div>
</template>

<script setup>
import { reactive, ref, h, computed } from 'vue'
import { ElButton, ElMessage } from 'element-plus'
import { api_operation_fast_inbound, api_operation_inbound } from '@/api/operation'
import ReagentSelect from '@/components/lab-management/reagent_select.vue'
import LotSelect from '@/components/lab-management/lot_select.vue'
import UdiScanHint from '@/components/lab-management/udi_scan_hint.vue'
import { syncSubmitDisabledByFields } from '@/utils/crud'
import { gs1RawToVisible, gs1VisibleToRaw } from '@/utils/gs1'
import { openErrorMessageBox } from '@/utils/messagebox'
import { usePageLoading } from '@/utils/pageLoading'
import { api_barcode_printer_print } from '@/api/barcodePrinter'
// 组件引用
// 使用reactive统一管理状态
const inboundFormdata = reactive({
    number:1,//数量
    submitDisabled: true, // 是否禁用按钮 默认禁用
    reagentid:null,
    lotid:null,
    note: '',
    allowExpiringInbound: localStorage.getItem('Inbound_allowExpiringInbound') === 'true' ? true : false,
    tableData: [], // 表格数据  
    reagentOptions: [], // 试剂选项
    lotOptions: [], // 批号选项
    autoPrintBarcode: localStorage.getItem('Inbound_autoPrintBarcode') === 'true' ? true : false,
    responseBarcodeData: [], // 入库后返回的条码数据
})
const REQUIRED_FIELDS = ['reagentid', 'lotid', 'number']

const quickInboundFormdata = reactive({
  rawUdi: '',
  note: '',
  allowExpiringInbound: localStorage.getItem('QuickInbound_allowExpiringInbound') === 'true' ? true : false,
})

const { pageLoading, withPageLoading } = usePageLoading()

const quickInboundDisplay = computed({
  get: () => gs1RawToVisible(quickInboundFormdata.rawUdi),
  set: (value) => {
    quickInboundFormdata.rawUdi = gs1VisibleToRaw(value)
  },
})
const tableColumns = [
  { key: 'reagentname', dataKey: 'reagentname', title: '试剂名字', width: 180, flexGrow: 1 },
  { key: 'lot', dataKey: 'lot', title: '批号', width: 180, flexGrow: 1 },
  { key: 'number', dataKey: 'number', title: '数量', width: 120, flexGrow: 1 },
  { key: 'note', dataKey: 'note', title: '注释', width: 180, flexGrow: 1 },
  {
    key: 'action',
    title: '操作',
    width: 120,
    cellRenderer: ({ rowData }) =>
      h(
        ElButton,
        {
          size: 'small',
          type: 'danger',
          onClick: () => delete_inbound(rowData.rowsid),
        },
        () => '删除'
      ),
  },
]

function showOperationResults(results) {
  const failedMessages = []
  for (const result of results) {
    if (result.isSuccess === true) {
      ElMessage({
        type: 'success',
        duration: 5000,
        message: h('p', { style: 'line-height: 1; font-size: 25px' }, [
          h('span', null, result.message),
        ]),
      })
    } else {
      failedMessages.push(result.message)
    }
  }

  if (failedMessages.length > 0) {
    openErrorMessageBox({
      title: '入库失败',
      message: failedMessages.join('\n'),
    })
  }
}



async function ready_inbound() {
        inboundFormdata.tableData.push({
        rowsid: inboundFormdata.tableData.length + 1,
        reagentId: inboundFormdata.reagentid,
        reagentid: inboundFormdata.reagentid,
        reagentname: inboundFormdata.reagentOptions.find(item => item.value === inboundFormdata.reagentid)?.name,
        lotId: inboundFormdata.lotid,
        lotid: inboundFormdata.lotid,
        lot: inboundFormdata.lotOptions.find(item => item.value === inboundFormdata.lotid)?.name,
        number: inboundFormdata.number,
        note: inboundFormdata.note,
    })
}
async function inbound() {
    await withPageLoading(async () => {
      const data = await api_operation_inbound(inboundFormdata.tableData, {
        allowExpiringInbound: inboundFormdata.allowExpiringInbound,
      })
      inboundFormdata.tableData = []
      inboundFormdata.responseBarcodeData = data.barcodeData
      showOperationResults(data.data ?? [])
    })
    if (inboundFormdata.autoPrintBarcode && inboundFormdata.responseBarcodeData && inboundFormdata.responseBarcodeData.length > 0) {
      try {
        await api_barcode_printer_print({data: inboundFormdata.responseBarcodeData})
        inboundFormdata.responseBarcodeData = []
      } catch (error) {
        ElMessage.error('条码打印失败：' + (error.message || '未知错误'))
      }
    }
}
function delete_inbound(rowsid) {
    inboundFormdata.tableData = inboundFormdata.tableData.filter(item => item.rowsid !== rowsid)
}

function syncSubmitDisabled() {
  syncSubmitDisabledByFields({
    formData: inboundFormdata,
    requiredFields: REQUIRED_FIELDS,
    target: inboundFormdata,
    disabledKey: 'submitDisabled',
  })
}

function handleReagentChange() {
  syncSubmitDisabled()
}

function handleLotChange() {
  syncSubmitDisabled()
}

function handleReagentOptionsLoaded(options) {
  inboundFormdata.reagentOptions = options
}

function  handleLotOptionsLoaded(options) {
  inboundFormdata.lotOptions = options
}

async function handleQuickInbound() {
  const normalizedUdi = String(quickInboundFormdata.rawUdi ?? '').trim()
  if (!normalizedUdi) {
    ElMessage.warning('请输入医疗器械唯一标识')
    return
  }
  quickInboundFormdata.rawUdi = normalizedUdi
    await withPageLoading(async () => {
      const result = await api_operation_fast_inbound({
        udi: normalizedUdi,
        note: String(quickInboundFormdata.note ?? '').trim(),
        allowExpiringInbound: quickInboundFormdata  .allowExpiringInbound,
      })
      if (result.isSuccess === true) {
        quickInboundFormdata.rawUdi = ''
        quickInboundFormdata.note = ''
        ElMessage({
          type: 'success',
          duration: 5000,
          message: h('p', { style: 'line-height: 1; font-size: 25px' }, [
            h('span', null, result.data.message),
          ]),
        })
      } else {
        openErrorMessageBox({
          title: '入库失败',
          message: result.data.message,
        })
      }
    })
}
function saveAllowExpiring() {
  localStorage.setItem('Inbound_allowExpiringInbound', inboundFormdata.allowExpiringInbound ? 'true' : 'false')
  localStorage.setItem('QuickInbound_allowExpiringInbound', quickInboundFormdata.allowExpiringInbound ? 'true' : 'false')
  localStorage.setItem('Inbound_autoPrintBarcode', inboundFormdata.autoPrintBarcode ? 'true' : 'false')
}
</script>

<style scoped>
.inbound-page {
  height: calc(100dvh - 80px);
  margin: 72px auto 0;
  padding: 8px 12px;
  max-width: 1900px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: hidden;
}
.inbound-section {
  border: 1px solid var(--el-border-color-light);
  border-radius: 10px;
  background: var(--el-bg-color-overlay);
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
}

.inbound-standard {
  flex: 1;
  min-height: 0;
}

.inbound-section-header h3 {
  margin: 0 0 6px 0;
  color: var(--el-text-color-primary);
  font-size: 22px;
  font-weight: 800;
}

.inbound-form-grid {
  margin-top: 8px;
  display: grid;
  grid-template-columns: repeat(2, minmax(340px, 1fr));
  gap: 12px 24px;
}

.inbound-field-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.inbound-field-label {
  width: 56px;
  color: var(--el-text-color-primary);
}

.inbound-field-control {
  width: 300px;
  max-width: 100%;
}

.inbound-field-control--small {
  width: 160px;
}

.inbound-form-actions {
  margin-top: 12px;
  display: flex;
  align-items: center;
}

.inbound-quick-row {
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.inbound-quick-label {
  min-width: 168px;
  color: var(--el-text-color-primary);
  font-size: 16px;
  font-weight: 700;
}

.inbound-quick-input {
  width: 420px;
  max-width: 56vw;
}

.inbound-quick-note {
  width: 260px;
  max-width: 40vw;
}

:deep(.inbound-quick-input .el-input__wrapper) {
  min-height: 48px;
  border-radius: 12px;
  box-shadow: 0 0 0 1px var(--el-border-color) inset;
}

:deep(.inbound-quick-input .el-input__inner) {
  font-size: 17px;
}

:deep(.el-input__wrapper),
:deep(.el-select__wrapper),
:deep(.el-input-number) {
  min-height: 32px;
}

.inbound-prepare-btn {
  width: 160px;
  height: 40px;
}

.inbound-table-wrap {
  margin-top: 12px;
  flex: 1;
  min-height: 0;
}

.inbound-footer-actions {
  margin-top: 12px;
}

.inbound-barcode {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
  pointer-events: none;
}

@media (max-width: 1200px) {
  .inbound-form-grid {
    grid-template-columns: 1fr;
  }

  .inbound-quick-input {
    width: min(420px, 100%);
    max-width: 100%;
  }

  .inbound-quick-note {
    width: min(260px, 100%);
    max-width: 100%;
  }
}

</style>


