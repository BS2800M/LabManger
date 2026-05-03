<template>
<div
  class="lm-page lm-page--stack"
  v-loading="pageLoading"
  element-loading-text="正在处理出库请求..."
>
  <section class="lm-section">
    <div class="lm-section-header">
      <h3>快速出库</h3>
    </div>
    <div class="outbound-quick-row">
      <span class="outbound-quick-label">{{ quickOutbound.useUdi ? '医疗器械唯一标识' : '条码号' }}</span>
      <div class="outbound-quick-hint-slot">
        <UdiScanHint v-if="quickOutbound.useUdi" />
      </div>
      <el-switch
        class="outbound-quick-switch"
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
        class="outbound-quick-input"
        v-model="quickOutboundInputDisplay"
        :placeholder="quickOutbound.useUdi ? '请输入或扫描UDI' : '请输入或扫描条码号'"
        clearable
        @keydown.enter.prevent="operation_outbound"
      />
      <el-input
        class="outbound-quick-note"
        v-model="quickOutbound.note"
        placeholder="注释（可选）"
        clearable
        @keydown.enter.prevent="operation_outbound"
      />
      <button class="stock-action-btn" @click="operation_outbound">
        <span>出库</span>
      </button>
    </div>
  </section>

  <section class="outbound-standard lm-section">
    <div class="lm-section-header">
      <h3>普通出库</h3>
    </div>
    <div class="outbound-form-grid">
      <div class="outbound-field-row">
        <span class="outbound-field-label">试剂</span>
        <reagent-select
          class="outbound-field-control"
          v-model="formData.reagentid"
          placeholder="选择试剂"
          @options-loaded="handleReagentOptionsLoaded"
          @change="handleReagentChange"
        />
      </div>
      <div class="outbound-field-row">
        <span class="outbound-field-label">数量</span>
        <el-input-number
          class="outbound-field-control outbound-field-control--small"
          v-model="formData.number"
          :min="1"
          :max="9999"
          placeholder="0"
          @change="syncSubmitDisabled"
        />
      </div>
      <div class="outbound-field-row">
        <span class="outbound-field-label">批号</span>
        <lot-select
          class="outbound-field-control"
          v-model="formData.lotid"
          :reagent-id="formData.reagentid"
          placeholder="选择批号"
          @options-loaded="handleLotOptionsLoaded"
          @change="handleLotChange"
        />
      </div>
      <div class="outbound-field-row">
        <span class="outbound-field-label">注释</span>
        <el-input
          class="outbound-field-control"
          v-model="formData.note"
          placeholder="可填写注释"
        />
      </div>
    </div>
    <div class="outbound-form-actions">
      <el-button
        class="outbound-prepare-btn"
        type="primary"
        :disabled="formData.submitDisabled"
        @click="ready_operation_special_outbound"
      >准备特殊出库</el-button>
    </div>

    <div class="lm-table-wrap">
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

    <div class="outbound-footer-actions">
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
import { reactive, ref, computed } from 'vue'
import { api_operation_fast_outbound, api_operation_outbound } from '@/api/operation';
import ReagentSelect from '@/components/lab-management/reagent_select.vue'
import LotSelect from '@/components/lab-management/lot_select.vue'
import UdiScanHint from '@/components/lab-management/udi_scan_hint.vue'
import { syncSubmitDisabledByFields } from '@/utils/crud'
import { gs1RawToVisible, gs1VisibleToRaw } from '@/utils/gs1'
import { openErrorMessageBox } from '@/utils/messagebox'
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

function showOperationResults(results) {
    const failedMessages = []
    for (const result of results) {
        if (result.isSuccess === true) {
            ElMessage({
                type: 'success',
                duration: 5000,
                message: h('p', { style: 'line-height: 1; font-size: 25px' }, [
                    h('span', null, result.message)
                ]),
            })
        } else {
            failedMessages.push(result.message)
        }
    }

    if (failedMessages.length > 0) {
        openErrorMessageBox({
            title: '出库失败',
            message: failedMessages.join('\n'),
        })
    }
}

function normalizeOperationResult(data, fallbackMessage) {
    return {
        isSuccess: data?.isSuccess ?? data?.status === true,
        message: data?.message ?? fallbackMessage,
    }
}



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
            const result = normalizeOperationResult(data.data, '快速出库处理完成')
            if (result.isSuccess === true) {
                quickOutbound.rawInput = ""
                quickOutbound.note = ""
                ElMessage({
                    type: 'success',
                    duration: 5000,
                    message: h('p', { style: 'line-height: 1; font-size: 25px' }, [
                        h('span', null, result.message)
                    ]),
                })
            } else {
                openErrorMessageBox({
                    title: '出库失败',
                    message: result.message,
                })
            }
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
        showOperationResults(data.data ?? [])
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

.outbound-standard {
  flex: 1;
  min-height: 0;
}

.outbound-quick-row {
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.outbound-quick-hint-slot {
  width: 96px;
  display: inline-flex;
  align-items: center;
}

.outbound-quick-switch {
  flex-shrink: 0;
}

.outbound-quick-label {
  min-width: 168px;
  color: var(--el-text-color-primary);
  font-size: 16px;
  font-weight: 700;
}

.outbound-quick-input {
  width: 420px;
  max-width: 56vw;
}

.outbound-quick-note {
  width: 260px;
  max-width: 40vw;
}

.stock-action-btn--inline {
  flex-shrink: 0;
}

:deep(.outbound-quick-input .el-input__wrapper) {
  min-height: 48px;
  border-radius: 12px;
  box-shadow: 0 0 0 1px var(--el-border-color) inset;
}

:deep(.outbound-quick-input .el-input__inner) {
  font-size: 17px;
}

:deep(.el-input__wrapper),
:deep(.el-select__wrapper),
:deep(.el-input-number) {
  min-height: 32px;
}

.outbound-form-grid {
  margin-top: 8px;
  display: grid;
  grid-template-columns: repeat(2, minmax(340px, 1fr));
  gap: 12px 24px;
}

.outbound-field-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.outbound-field-label {
  width: 56px;
  color: var(--el-text-color-primary);
}

.outbound-field-control {
  width: 300px;
  max-width: 100%;
}

.outbound-field-control--small {
  width: 160px;
}

.outbound-form-actions {
  margin-top: 12px;
  display: flex;
  align-items: center;
}

.outbound-prepare-btn {
  width: 160px;
  height: 40px;
}

.outbound-footer-actions {
  margin-top: 12px;
}

@media (max-width: 1200px) {
  .outbound-form-grid {
    grid-template-columns: 1fr;
  }

  .outbound-quick-input {
    width: min(420px, 100%);
    max-width: 100%;
  }

  .outbound-quick-note {
    width: min(260px, 100%);
    max-width: 100%;
  }
}


</style>



