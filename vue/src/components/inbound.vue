<template>
    <div id="background" class="inbound-page">
      <section class="quick-section">
        <div class="panel-header">
          <h3>快速入库</h3>
        </div>
        <div class="quick-inbound-row">
            <span class="quick-inbound-label">医疗器械唯一标识</span>
            <el-input
                v-model="quickInboundDisplay"
                class="quick-inbound-input"
                placeholder="请输入或扫描UDI"
                clearable
                @keydown.enter.prevent="handleQuickInbound"
            />
            <button class="stock-action-btn stock-action-btn--inline" @click="handleQuickInbound">
              <span>入库</span>
            </button>
            <el-button
                class="serial-toggle-btn"
                :loading="serialState.connecting"
                :type="serialState.running ? 'danger' : 'primary'"
                @click="handleSerialToggle"
            >
              {{ serialState.running ? '断开串口' : '连接串口' }}
            </el-button>
            <el-switch
                v-model="serialState.autoSubmit"
                class="serial-mode-switch"
                inline-prompt
                active-text="自动入库"
                inactive-text="仅填充"
                :disabled="!serialState.running"
            />
            <span class="serial-status" :class="{ 'serial-status--online': serialState.running }">
              {{ serialStatusText }}
            </span>
        </div>
      </section>

      <section class="panel-section">
        <div class="panel-header">
          <h3>常规入库</h3>
        </div>
        <div class="toolbar-grid">
            <div class="field-row">
                <span class="field-label">试剂</span>
                <reagent-select
                    class="field-control"
                    v-model="formData.reagentid"
                    placeholder="选择试剂"
                    @options-loaded="handleReagentOptionsLoaded"
                    @change="handleReagentChange"
                />
            </div>
            <div class="field-row">
                <span class="field-label">批号</span>
                <lot-select
                    class="field-control"
                    v-model="formData.lotid"
                    :reagent-id="formData.reagentid"
                    placeholder="选择批号"
                    @options-loaded="handleLotOptionsLoaded"
                    @change="handleLotChange"
                />
            </div>
            <div class="field-row">
                <span class="field-label">数量</span>
                <el-input-number
                    class="field-control field-control-small"
                    v-model="formData.number"
                    :min="1"
                    :max="9999"
                    placeholder="0"
                    @change="syncSubmitDisabled"
                />
            </div>
            <div class="field-row">
                <span class="field-label">注释</span>
                <el-input
                    class="field-control"
                    v-model="formData.note"
                    placeholder="可填写注释"
                />
            </div>
        </div>
        <div class="toolbar-actions">
            <el-button
                class="prepare-stock-btn"
                type="primary"
                :disabled="formData.submitDisabled"
                @click="ready_inbound"
            >准备入库</el-button>
        </div>
        <div class="inbound-table">
          <el-auto-resizer>
            <template #default="{ width, height }">
              <el-table-v2
                :columns="tableColumns"
                :data="formData.tableData"
                :width="width"
                :height="height"
                :row-height="36"
                :header-height="34"
                :row-class="() => 'normal-row'"
              />
            </template>
          </el-auto-resizer>
        </div>
        <div class="page-actions">
          <button class="stock-action-btn" @click="inbound">
              <span>入库</span>
          </button>
        </div>
      </section>
      <svg id="barcode"></svg>
    </div>
</template>

<script setup>
import { reactive, ref, h, computed, onBeforeUnmount, onMounted } from 'vue'
import { ElButton, ElMessage } from 'element-plus'
import { api_operation_fast_inbound, api_operation_inbound } from '@/api/operation'
import ReagentSelect from '@/components/reagent_select.vue'
import LotSelect from '@/components/lot_select.vue'
import { syncSubmitDisabledByFields } from '@/utils/crud'
import { gs1RawToVisible, gs1VisibleToRaw } from '@/utils/gs1'
import {
  isSerialSupported,
  requestSerialPort,
  startSerialScanner,
  saveSerialPortPreference,
  clearSerialPortPreference,
  getPreferredSerialPort,
} from '@/utils/serialScanner'
import 'element-plus/dist/index.css'
// 组件引用
// 使用reactive统一管理状态
const formData = reactive({
    number:1,//数量
    submitDisabled: true, // 是否禁用按钮 默认禁用
    reagentid:null,
    lotid:null,
    note: '',
    tableData: [], // 表格数据  

})
const REQUIRED_FIELDS = ['reagentid', 'lotid', 'number']
const reagentOptions = ref([])
const lotOptions = ref([])
const quickInbound = reactive({
  rawUdi: '',
})
const quickInboundSubmitting = ref(false)
const serialScannerController = ref(null)
const serialState = reactive({
  supported: isSerialSupported(),
  connecting: false,
  running: false,
  autoSubmit: true,
})
const quickInboundDisplay = computed({
  get: () => gs1RawToVisible(quickInbound.rawUdi),
  set: (value) => {
    quickInbound.rawUdi = gs1VisibleToRaw(value)
  },
})
const serialStatusText = computed(() => {
  if (!serialState.supported) return '当前浏览器不支持串口模式'
  if (serialState.connecting) return '正在连接串口设备...'
  if (serialState.running) {
    return serialState.autoSubmit ? '串口已连接，扫码后自动入库' : '串口已连接，扫码后仅填充输入框'
  }
  return '可连接串口扫码枪'
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

async function ready_inbound() {
        formData.tableData.push({
        rowsid: formData.tableData.length + 1,
        reagentId: formData.reagentid,
        reagentid: formData.reagentid,
        reagentname: reagentOptions.value.find(item => item.value === formData.reagentid)?.name,
        lotId: formData.lotid,
        lotid: formData.lotid,
        lot: lotOptions.value.find(item => item.value === formData.lotid)?.name,
        number: formData.number,
        note: formData.note,
    })
}
async function inbound() {
    const data = await api_operation_inbound(formData.tableData)
    formData.tableData = []
    const messages = data.data?.messages ?? []
    let message_type = "error"
    for (let i in messages) {
        if (messages[i].includes("库存不足")) {
            message_type = "error"
        } else if (messages[i].includes("库存达到警告线")) {
            message_type = "warning"
        } else if (messages[i].includes("库存更新成功")) {
            message_type = "success"
        }
        ElMessage({
            type: message_type,
            message: h('p', { style: 'line-height: 1; font-size: 25px' }, [
                h('span', null, messages[i])
            ]),
        })
    }
}
function delete_inbound(rowsid) {
    formData.tableData = formData.tableData.filter(item => item.rowsid !== rowsid)
}

function syncSubmitDisabled() {
  syncSubmitDisabledByFields({
    formData,
    requiredFields: REQUIRED_FIELDS,
    target: formData,
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
  reagentOptions.value = options
}

function handleLotOptionsLoaded(options) {
  lotOptions.value = options
}

async function handleQuickInbound() {
  if (quickInboundSubmitting.value) return

  const normalizedUdi = String(quickInbound.rawUdi ?? '')
    .trim()

  if (!normalizedUdi) {
    ElMessage.warning('请输入医疗器械唯一标识')
    return
  }

  quickInbound.rawUdi = normalizedUdi
  quickInboundSubmitting.value = true

  try {
    const data = await api_operation_fast_inbound({ udi: normalizedUdi })
    const status = data.data?.status
    const message = data.data?.message ?? '快速入库处理完成'

    let messageType = 'info'
    if (status === 0) {
      messageType = 'success'
      quickInbound.rawUdi = ''
    } else if (status === 1) {
      messageType = 'warning'
    }

    ElMessage({
      type: messageType,
      message: h('p', { style: 'line-height: 1; font-size: 25px' }, [
        h('span', null, message),
      ]),
    })
  } catch (err) {
    ElMessage({
      type: 'error',
      message: h('p', { style: 'line-height: 1; font-size: 25px' }, [
        h('span', null, err?.response?.data?.message ?? '快速入库请求失败'),
      ]),
    })
  } finally {
    quickInboundSubmitting.value = false
  }
}

function getErrorMessage(error, fallback) {
  return error?.message || error?.toString?.() || fallback
}

async function stopSerialMode(silent = false, clearSavedPreference = false) {
  const controller = serialScannerController.value
  serialScannerController.value = null
  const wasRunning = serialState.running

  if (controller) {
    await controller.stop()
  }

  serialState.running = false
  serialState.connecting = false

  if (clearSavedPreference) {
    clearSerialPortPreference()
  }

  if (!silent && wasRunning) {
    ElMessage.info('串口已断开')
  }
}

async function startSerialMode(initialPort = null, silentOnSuccess = false) {
  if (!serialState.supported) {
    ElMessage.warning('当前浏览器不支持串口模式，请使用 Chromium 内核浏览器')
    return
  }
  serialState.connecting = true
  try {
    const port = initialPort ?? await requestSerialPort()
    const controller = await startSerialScanner({
      port,
      baudRate: 9600,
      closePortOnStop: true,
      onScan: (scanText) => {
        quickInbound.rawUdi = scanText
        if (serialState.autoSubmit) {
          void handleQuickInbound()
        }
      },
      onError: (error) => {
        ElMessage.error(getErrorMessage(error, '串口读取失败'))
        void stopSerialMode(true)
      },
    })

    serialScannerController.value = controller
    serialState.running = true
    saveSerialPortPreference(port)
    if (!silentOnSuccess) {
      ElMessage.success('串口已连接，等待扫码')
    }
  } catch (error) {
    if (error?.name === 'NotFoundError') {
      ElMessage.info('已取消选择串口设备')
    } else {
      ElMessage.error(getErrorMessage(error, '串口连接失败'))
    }
  } finally {
    serialState.connecting = false
  }
}

async function handleSerialToggle() {
  if (serialState.connecting) return
  if (serialState.running) {
    await stopSerialMode(false, true)
    return
  }
  await startSerialMode()
}

onBeforeUnmount(() => {
  void stopSerialMode(true, false)
})

onMounted(async () => {
  try {
    const preferredPort = await getPreferredSerialPort()
    if (!preferredPort) return
    await startSerialMode(preferredPort, true)
  } catch {
    // 自动恢复失败时静默，避免影响页面主流程。
  }
})
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

.quick-section,
.panel-section {
  border: 1px solid var(--el-border-color-light);
  border-radius: 10px;
  background: var(--el-bg-color-overlay);
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
}

.quick-section {
  flex-shrink: 0;
}

.panel-section {
  flex: 1;
  min-height: 0;
}

.panel-header h3 {
  margin: 0 0 6px 0;
  color: var(--el-text-color-primary);
  font-size: 22px;
  font-weight: 800;
}

.panel-header {
  display: flex;
  align-items: center;
  min-height: 34px;
}

.toolbar-grid {
  margin-top: 8px;
  display: grid;
  grid-template-columns: repeat(2, minmax(340px, 1fr));
  gap: 12px 24px;
}

.field-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.field-label {
  width: 56px;
  color: var(--el-text-color-primary);
}

.field-control {
  width: 300px;
}

.field-control-small {
  width: 160px;
}

.toolbar-actions {
  margin-top: 12px;
  display: flex;
  align-items: center;
}

.quick-inbound-row {
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.quick-inbound-label {
  min-width: 168px;
  color: var(--el-text-color-primary);
  font-size: 16px;
  font-weight: 700;
}

.quick-inbound-input {
  width: 420px;
  max-width: 56vw;
}

.serial-toggle-btn {
  height: 40px;
}

.serial-mode-switch {
  min-height: 40px;
}

.serial-status {
  color: var(--el-text-color-secondary);
  font-size: 13px;
  white-space: nowrap;
}

.serial-status--online {
  color: var(--el-color-success);
  font-weight: 600;
}

:deep(.quick-inbound-input .el-input__wrapper) {
  min-height: 48px;
  border-radius: 12px;
  box-shadow: 0 0 0 1px var(--el-border-color) inset;
}

:deep(.quick-inbound-input .el-input__inner) {
  font-size: 17px;
}

:deep(.el-input__wrapper),
:deep(.el-select__wrapper),
:deep(.el-input-number) {
  min-height: 32px;
}

.prepare-stock-btn {
  width: 160px;
  height: 40px;
}

.inbound-table {
  margin-top: 12px;
  flex: 1;
  min-height: 0;
}

.page-actions {
  margin-top: 12px;
}

#barcode {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
  pointer-events: none;
}

</style>
