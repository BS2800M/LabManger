<template>
  <div class="lm-page lm-page--split" v-loading="pageLoading" element-loading-text="正在加载库存数据...">
    <section class="lm-section inventory-section">
      <div class="lm-section-header">
        <h3>试剂库存</h3>
      </div>
      <div class="lm-toolbar">
        <el-input
          class="lm-toolbar-search"
          style="width: 250px"
          v-model="reagentState.name"
          placeholder="搜索试剂名称"
          @input="listReagentInventory"
        />
        <el-switch
          v-model="reagentState.lowStockOnly"
          size="large"
          active-text="只显示低库存"
          inactive-text="显示全部"
          @change="handleLowStockChange"
        />
        <el-pagination
          class="lm-toolbar-pagination"
          background
          layout="prev, pager, next"
          v-model:current-page="reagentState.page"
          :page-count="reagentState.totalPage"
          @change="listReagentInventory"
        />
        <div class="lm-toolbar-actions">
          <el-button id="handleExport" type="primary" @click="handleExport">导出盘库表</el-button>
        </div>
      </div>
      <div class="lm-table-wrap">
        <el-auto-resizer>
          <template #default="{ width, height }">
            <el-table-v2
              :columns="reagentColumns"
              :data="reagentState.tableData"
              :width="width"
              :height="height"
              :row-height="36"
              :header-height="34"
              :row-class="({ rowData }) => getStatusRowClass(rowData)"
            />
          </template>
        </el-auto-resizer>
      </div>
    </section>

    <section class="lm-section inventory-section">
      <div class="lm-section-header">
        <h3>批号库存</h3>
      </div>
      <div class="lm-toolbar">
        <el-input
          class="lm-toolbar-search"
          style="width: 250px"
          v-model="lotState.lot"
          placeholder="搜索批号名称"
          @input="listLotInventory"
          :disabled="!reagentState.selectedReagentId"
        />
        <el-switch
          v-model="lotState.expiredOnly"
          size="large"
          active-text="只显示临期"
          inactive-text="显示全部"
          @change="handleExpiredOnlyChange"
          :disabled="!reagentState.selectedReagentId"
        />
        <el-pagination
          class="lm-toolbar-pagination"
          background
          layout="prev, pager, next"
          v-model:current-page="lotState.page"
          :page-count="lotState.totalPage"
          @change="listLotInventory"
          :disabled="!reagentState.selectedReagentId"
        />
      </div>
      <div class="lot-selected-tip">
        <span v-if="reagentState.selectedReagentName">当前试剂：{{ reagentState.selectedReagentName }}</span>
        <span v-else>请在上表勾选一个试剂后查看批号库存</span>
      </div>
      <div class="lm-table-wrap">
        <el-auto-resizer>
          <template #default="{ width, height }">
            <el-table-v2
              :columns="lotColumns"
              :data="lotState.tableData"
              :width="width"
              :height="height"
              :row-height="36"
              :header-height="34"
              :row-class="({ rowData }) => getStatusRowClass(rowData)"
            />
          </template>
        </el-auto-resizer>
      </div>
    </section>
  </div>
</template>

<script setup>
import { h, onMounted, reactive } from 'vue'
import { ElCheckbox } from 'element-plus'
import { api_inventory_showReagent, api_inventory_showLot, api_inventory_showAll } from '@/api/inventory'
import { formatDateColumn } from '@/utils/format'
import { usePageLoading } from '@/utils/pageLoading'
import { inventory_exportExcel_list } from '@/utils/exportexcel.js'
const { pageLoading, withPageLoading } = usePageLoading()

const reagentState = reactive({
  tableData: [],
  page: 1,
  pageSize: 10,
  totalPage: 1,
  name: '',
  lowStockOnly: false,
  selectedReagentId: null,
  selectedReagentName: '',
})

const lotState = reactive({
  tableData: [],
  page: 1,
  pageSize: 10,
  totalPage: 1,
  lot: '',
  expiredOnly: false,
})

const reagentColumns = [
  {
    key: 'inventory-reagent-select',
    dataKey: 'inventory-reagent-select',
    title: '',
    width: 56,
    cellRenderer: ({ rowData }) => h(ElCheckbox, {
      modelValue: reagentState.selectedReagentId === rowData.id,
      'aria-label': 'select-reagent-row',
      onChange: (checked) => handleReagentSelectChange(checked, rowData),
    }),
  },
  { key: 'name', dataKey: 'name', title: '试剂名称', width: 220, flexGrow: 1 },
  { key: 'specifications', dataKey: 'specifications', title: '规格', width: 180, flexGrow: 1 },
  { key: 'number', dataKey: 'number', title: '库存', width: 120, flexGrow: 1 },
  {
    key: 'updatedAt',
    dataKey: 'updatedAt',
    title: '最后出库时间',
    width: 200,
    flexGrow: 1,
    cellRenderer: ({ rowData }) => (rowData.updatedAt ? formatDateColumn(rowData, null, rowData.updatedAt) : '-'),
  },
]

const lotColumns = [
  { key: 'name', dataKey: 'name', title: '批号', width: 220, flexGrow: 1 },
  { key: 'reagent.name', dataKey: 'reagent.name', title: '试剂名称', width: 180, flexGrow: 1 },
  {
    key: 'expirationDate',
    dataKey: 'expirationDate',
    title: '有效期',
    width: 180,
    flexGrow: 1,
    cellRenderer: ({ rowData }) => formatDateColumn(rowData, null, rowData.expirationDate),
  },
  { key: 'number', dataKey: 'number', title: '库存', width: 120, flexGrow: 1 },
  {
    key: 'updatedAt',
    dataKey: 'updatedAt',
    title: '最后出库时间',
    width: 200,
    flexGrow: 1,
    cellRenderer: ({ rowData }) => (rowData.updatedAt ? formatDateColumn(rowData, null, rowData.updatedAt) : '-'),
  },
{ key: 'warningDate', dataKey: 'warningDate', title: '预警日期', width: 180, flexGrow: 1, cellRenderer: ({ rowData }) => formatDateColumn(rowData, null, rowData.warningDate) },
]

function getStatusRowClass(rowData) {
  return rowData.status === 'Disable' ? 'unactive-row' : 'normal-row'
}

function resetLotArea() {
  lotState.tableData = []
  lotState.page = 1
  lotState.totalPage = 1
}

function handleReagentSelectChange(checked, rowData) {
  if (!checked) {
    reagentState.selectedReagentId = null
    reagentState.selectedReagentName = ''
    resetLotArea()
    return
  }
  reagentState.selectedReagentId = rowData.id
  reagentState.selectedReagentName = rowData.name
  lotState.page = 1
  listLotInventory()
}

function handleLowStockChange() {
  reagentState.page = 1
  listReagentInventory()
}

function handleExpiredOnlyChange() {
  lotState.page = 1
  listLotInventory()
}

async function listReagentInventory() {
  return withPageLoading(async () => {
    const data = await api_inventory_showReagent({
      name: reagentState.name,
      lowStockOnly: reagentState.lowStockOnly,
      page: reagentState.page,
      pageSize: reagentState.pageSize,
    })
    reagentState.tableData = data.data ?? []
    reagentState.totalPage = data.meta?.totalPage ?? 1
    if (reagentState.selectedReagentId !== null) {
      const exists = reagentState.tableData.some((item) => item.id === reagentState.selectedReagentId)
      if (!exists) {
        reagentState.selectedReagentId = null
        reagentState.selectedReagentName = ''
        resetLotArea()
      }
    }
  })
}

async function listLotInventory() {
  if (!reagentState.selectedReagentId) {
    resetLotArea()
    return
  }
  return withPageLoading(async () => {
    const data = await api_inventory_showLot({
      reagentId: reagentState.selectedReagentId,
      lot: lotState.lot,
      expiredOnly: lotState.expiredOnly,
      page: lotState.page,
      pageSize: lotState.pageSize,
    })
    lotState.tableData = data.data ?? []
    lotState.totalPage = data.meta?.totalPage ?? 1
  })
}

async function handleExport() {
  inventory_exportExcel_list({
    name: reagentState.name,
  })
}
onMounted(async () => {
  await listReagentInventory()
})
</script>

<style scoped>
.inventory-section {
  min-height: 0;
  overflow: hidden;
}

.inventory-section .lm-table-wrap {
  min-height: 180px;
}

.lot-selected-tip {
  margin-top: 8px;
  color: var(--el-text-color-regular);
  font-size: 13px;
}
</style>
