<template>
    <div
      id="background"
      class="inbound-page"
      v-loading="pageLoading"
      element-loading-text="正在处理入库请求..."
    >
      <section class="quick-section">
        <div class="panel-header">
          <h3>快速入库</h3>
        </div>
        <div class="quick-inbound-row">
            <span class="quick-inbound-label">医疗器械唯一标识</span>
            <UdiScanHint />
            <el-input
                v-model="quickInboundDisplay"
                class="quick-inbound-input"
                placeholder="请输入或扫描UDI"
                clearable
                @keydown.enter.prevent="handleQuickInbound"
            />
            <el-input
                v-model="quickInbound.note"
                class="quick-inbound-note"
                placeholder="注释（可选）"
                clearable
                @keydown.enter.prevent="handleQuickInbound"
            />
            <button class="stock-action-btn stock-action-btn--inline" @click="handleQuickInbound">
              <span>入库</span>
            </button>
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
import { reactive, ref, h, computed } from 'vue'
import { ElButton, ElMessage } from 'element-plus'
import { api_operation_fast_inbound, api_operation_inbound } from '@/api/operation'
import ReagentSelect from '@/components/reagent_select.vue'
import LotSelect from '@/components/lot_select.vue'
import UdiScanHint from '@/components/udi_scan_hint.vue'
import { syncSubmitDisabledByFields } from '@/utils/crud'
import { gs1RawToVisible, gs1VisibleToRaw } from '@/utils/gs1'
import { usePageLoading } from '@/utils/pageLoading'
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
  note: '',
})
const quickInboundSubmitting = ref(false)
const { pageLoading, withPageLoading } = usePageLoading()

const quickInboundDisplay = computed({
  get: () => gs1RawToVisible(quickInbound.rawUdi),
  set: (value) => {
    quickInbound.rawUdi = gs1VisibleToRaw(value)
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
    return withPageLoading(async () => {
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
    })
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
    await withPageLoading(async () => {
      const data = await api_operation_fast_inbound({
        udi: normalizedUdi,
        note: String(quickInbound.note ?? '').trim(),
      })
      quickInbound.note = ''
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

.quick-inbound-note {
  width: 260px;
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
