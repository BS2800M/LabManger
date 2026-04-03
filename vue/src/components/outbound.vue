<template>
<div
  id="background"
  class="outbound-page"
  v-loading="pageLoading"
  element-loading-text="正在处理出库请求..."
>
  <section class="quick-section">
    <div class="panel-header">
      <h3>快速出库</h3>
    </div>
    <div class="quick-outbound-row">
      <span class="quick-outbound-label">{{ quickOutbound.useUdi ? '医疗器械唯一标识' : '条码号' }}</span>
      <div class="quick-outbound-hint-slot">
        <UdiScanHint v-if="quickOutbound.useUdi" />
      </div>
      <el-switch
        class="quick-outbound-switch"
        v-model="quickOutbound.useUdi"
        size="large"
        :width="60"
        :height="40"
        inline-prompt
        active-text="UDI"
        inactive-text="条码"
        @change="handleQuickModeChange"
      />
      <el-input
        id="input_barcodenumber"
        class="quick-outbound-input"
        v-model="quickOutboundInputDisplay"
        :placeholder="quickOutbound.useUdi ? '请输入或扫描UDI' : '请输入或扫描条码号'"
        clearable
        @keydown.enter.prevent="operation_outbound"
      />
      <el-input
        class="quick-outbound-note"
        v-model="quickOutbound.note"
        placeholder="注释（可选）"
        clearable
        @keydown.enter.prevent="operation_outbound"
      />
      <button class="stock-action-btn stock-action-btn--inline" @click="operation_outbound">
        <span>出库</span>
      </button>
    </div>
  </section>

  <section class="panel-section">
    <div class="panel-header">
      <h3>普通出库</h3>
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
        @click="ready_operation_special_outbound"
      >准备特殊出库</el-button>
    </div>

    <div class="outbound-table">
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
      <button class="stock-action-btn" @click="operation_special_outbound">
        <span>出库</span>
      </button>
    </div>
  </section>
</div>


</template>


<script setup>
import { ElMessage } from 'element-plus'
import { h } from 'vue'
import { ElButton } from 'element-plus'
import 'element-plus/dist/index.css'
import { reactive, ref, computed } from 'vue'
import { api_operation_fast_outbound, api_operation_outbound } from '../api/operation';
import ReagentSelect from '@/components/reagent_select.vue'
import LotSelect from '@/components/lot_select.vue'
import UdiScanHint from '@/components/udi_scan_hint.vue'
import { syncSubmitDisabledByFields } from '@/utils/crud'
import { gs1RawToVisible, gs1VisibleToRaw } from '@/utils/gs1'
import { usePageLoading } from '@/utils/pageLoading'

const reagentOptions = ref([])
const lotOptions = ref([])
const quickOutbound = reactive({
    useUdi: false,
    rawInput: '',
    note: '',
})
const quickOutboundSubmitting = ref(false)
const { pageLoading, withPageLoading } = usePageLoading()

const quickOutboundInputDisplay = computed({
    get: () => (quickOutbound.useUdi ? gs1RawToVisible(quickOutbound.rawInput) : quickOutbound.rawInput),
    set: (value) => {
        quickOutbound.rawInput = quickOutbound.useUdi ? gs1VisibleToRaw(value) : String(value ?? '')
    },
})





const formData = reactive({
    number:1,//出库数量
    submitDisabled: true, // 是否禁用按钮 默认禁用
    reagentid: null, // 选择试剂下拉菜单对应的id
    lotid: null, // 选择批号下拉菜单对应的id
    note: '',
    tableData: [], // 表格数据  

})
const REQUIRED_FIELDS = ['reagentid', 'lotid', 'number']

const tableColumns = [
  { key: 'reagentname', dataKey: 'reagentname', title: '试剂名字', width: 300, flexGrow: 1 },
  { key: 'lot', dataKey: 'lot', title: '批号', width: 220, flexGrow: 1 },
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
          onClick: () => delete_outbound(rowData.rowsid),
        },
        () => '删除'
      ),
  },
]



async function operation_outbound(){
    if (quickOutboundSubmitting.value) return

    const normalizedValue = String(quickOutbound.rawInput ?? '').trim()
    if (!normalizedValue) {
        ElMessage.warning(quickOutbound.useUdi ? '请输入医疗器械唯一标识' : '请输入条码号')
        return
    }
    quickOutboundSubmitting.value = true
    try {
        await withPageLoading(async () => {
            const data = await api_operation_fast_outbound(
          {
            useUdi: quickOutbound.useUdi,
            udi: quickOutbound.useUdi ? normalizedValue : '',
            barcodeNumber: quickOutbound.useUdi ? '' : normalizedValue,
            note: String(quickOutbound.note ?? '').trim(),
          }
            )
            quickOutbound.rawInput = ""
            quickOutbound.note = ""
            const msg = data.data?.message ?? ''
            const warningKeyWord = ["库存不足", "该条码已经出库", "该条码未进行入库", "该UDI已经出库", "该UDI未进行入库"]
            ElMessage({
                type: warningKeyWord.some(item => msg.includes(item)) ? "warning" : "success",
                message: h('p', { style: 'line-height: 1; font-size: 25px' }, [
                    h('span', null, msg)
                ]),
            })
        })
    } catch (err) {
        ElMessage({
            type: "error",
            message: h('p', { style: 'line-height: 1; font-size: 25px' }, [
                h('span', null, err?.response?.data?.message ?? '快速出库请求失败')
            ]),
        })
    } finally {
        quickOutboundSubmitting.value = false
    }
}

function handleQuickModeChange() {
    quickOutbound.rawInput = ''
}





 

function ready_operation_special_outbound(){
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

async function operation_special_outbound(){
    return withPageLoading(async () => {
        const data = await api_operation_outbound(formData.tableData)
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

function delete_outbound(rowsid) {
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

</script>


<style scoped>

.outbound-page {
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

.quick-outbound-row {
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.quick-outbound-hint-slot {
  width: 96px;
  display: inline-flex;
  align-items: center;
}

.quick-outbound-switch {
  flex-shrink: 0;
}

.quick-outbound-label {
  min-width: 168px;
  color: var(--el-text-color-primary);
  font-size: 16px;
  font-weight: 700;
}

.quick-outbound-input {
  width: 420px;
  max-width: 56vw;
}

.quick-outbound-note {
  width: 260px;
}

.stock-action-btn--inline {
  flex-shrink: 0;
}

:deep(.quick-outbound-input .el-input__wrapper) {
  min-height: 48px;
  border-radius: 12px;
  box-shadow: 0 0 0 1px var(--el-border-color) inset;
}

:deep(.quick-outbound-input .el-input__inner) {
  font-size: 17px;
}

:deep(.el-input__wrapper),
:deep(.el-select__wrapper),
:deep(.el-input-number) {
  min-height: 32px;
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

.prepare-stock-btn {
  width: 160px;
  height: 40px;
}

.outbound-table {
  margin-top: 12px;
  flex: 1;
  min-height: 0;
}

.page-actions {
  margin-top: 12px;
}


</style>
