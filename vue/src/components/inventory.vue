<template>
    <div id="background" class="inventory-page">  
      <section class="panel-section">
        <div class="panel-header">
          <h3>库存查询</h3>
        </div>
        <div id="background2" class="toolbar">
          <el-input 
            class="toolbar-search"
            v-model="state.reagentname" 
            placeholder="搜索试剂名称" 
            @input="list_reagentnumber" 
          />
          <el-pagination 
            class="toolbar-pagination"
            background  
            layout="prev, pager, next"  
            v-model:current-page="state.page" 
            :page-count="state.totalpage" 
            @change="list_reagentnumber" 
          />
          <div class="button-container">
            <el-button 
              id="export"
              type="primary" 
              @click="inventory_exporttoexcel_list"
            >
              导出盘库表
            </el-button>
            <el-button 
              id="cal"
              type="primary" 
              @click="inventory_audit"
            >
              更新信息
            </el-button>
            <el-button 
              id="statistics"
              type="primary" 
              @click="statistics"
            >
              库存统计
            </el-button>
          </div>
          </div> 
        <div class="inventory-table">
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

    <el-drawer v-model="state.drawer" direction="rtl" size="80%" @open="state.selectedRowId = null">
      <template #header>
      <span class="drawer-title">库存查询</span>
    </template>
      <template #footer>
      <div style="flex: auto">
        <el-button type="primary" @click="state.drawer=false">关闭</el-button>
      </div>
    </template>
      <template #default>
        <div class="drawer-content">
          <div class="chart-container">
            <statistics_chart v-model="state.statisticsData" />
          </div>
          <div class="drawer-form">
            <p>开始时间</p>
            <el-config-provider :locale="zhCn">
              <el-date-picker
                v-model="formData.starttime"
                class="drawer-field"
                type="datetime"
                placeholder="选择开始时间"
                size="default"
                @change="syncSubmitDisabled"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </el-config-provider>

            <p>结束时间</p>
            <el-config-provider :locale="zhCn">
              <el-date-picker
                v-model="formData.endtime"
                class="drawer-field"
                type="datetime"
                placeholder="选择结束时间"
                size="default"
                @change="syncSubmitDisabled"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </el-config-provider>

            <p>间隔时间(天)</p>
            <el-input-number
              v-model="formData.intervalday"
              class="drawer-field"
              :min="1"
              :max="365"
              placeholder="1"
              @change="syncSubmitDisabled"
            />

            <p>只统计本批号</p>
            <el-switch v-model="formData.onlylot" size="large" active-text="是" inactive-text="否" />

            <div class="drawer-form-actions">
              <el-button type="primary" @click="statistics_data" :disabled="state.statisticsbuttondisabled">查询</el-button>
            </div>
          </div>
        </div>

      </template>
    </el-drawer>
</template>
<script setup>





import { onMounted, reactive } from 'vue'
import { eventBus, EVENT_TYPES } from '@/utils/eventBus'
import { api_inventory_show,api_inventory_auditall,api_inventory_statistics } from '@/api/inventory'
import {inventory_exporttoexcel_list} from '@/utils/exportexcel'
import { formatDateColumn } from '@/utils/format'
import statistics_chart from './statistics_chart.vue'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { getnowtime_previousmonth,getnowtime,format_xAxisLabels } from '@/utils/format'
import { syncSubmitDisabledByFields, toggleRowSelection, resolveSelectableRowClass } from '@/utils/crud'


const formData = reactive({
  id:null,
  reagentname: '',
  reagentId: null,
  lotId: null,
  lotname: '',
  starttime: null,
  endtime: null,
  intervalday: 1,
  onlylot: false,

})

// 状态管
const state = reactive({
  inputsearchname: '',    // 输入搜索名称
  tableData: [],         // 表格数据，初始化为空数组
  page: 1,       // 当前页
  totalpage: 1,        // 总页
  pagesize:13,
  selectedRowId: null,
  drawer:false, // 统计抽屉
  statisticsbuttondisabled:true, // 统计按钮是否禁用
  statisticsData: { }     // 统计数据
})
const tableColumns = [
  { key: 'reagentName', dataKey: 'reagentName', title: '试剂名称', width: 180, flexGrow: 1 },
  { key: 'lotName', dataKey: 'lotName', title: '批号', width: 180, flexGrow: 1 },
  { key: 'number', dataKey: 'number', title: '库存', width: 120, flexGrow: 1 },
  { key: 'specifications', dataKey: 'specifications', title: '规格', width: 120, flexGrow: 1 },
  {
    key: 'lotExpirationDate',
    dataKey: 'lotExpirationDate',
    title: '有效期',
    width: 180,
    flexGrow: 1,
    cellRenderer: ({ rowData }) => formatDateColumn(rowData, null, rowData.lotExpirationDate),
  },
  { key: 'warnNumber', dataKey: 'warnNumber', title: '警告数量', width: 140, flexGrow: 1 },
]
const REQUIRED_FIELDS = ['starttime', 'endtime', 'intervalday', 'reagentId']

function getRowClass(rowData, rowIndex) {
  return resolveSelectableRowClass({
    rowData,
    rowIndex,
    selectedRowId: state.selectedRowId,
    getStatusClass: ({ row }) => {
      if (row.status !== 0) return 'unactive-row'
      const isWarning = Boolean(row.warningNum || row.warningExpirationDate)
      return isWarning ? 'warning-row' : 'normal-row'
    },
  })
}

function resetSelectedFormData() {
  Object.assign(formData, {
    id:null,
    reagentname: '',
    reagentId: null,
    lotId: null,
    lotname: '',
  })
}

function fillFormDataFromRow(rowData) {
  Object.assign(formData, {
    id: rowData.id,
    reagentname: rowData.reagentName,
    reagentId: rowData.reagentId,
    lotId: rowData.lotId,
    lotname: rowData.lotName,
  })
}

function handleRowClick({ rowData }) { // 表格行点击事件
  toggleRowSelection({
    rowData,
    selectedRowId: state.selectedRowId,
    isSameSelection: state.selectedRowId === rowData.id,
    getRowId: (row) => row.id,
    setSelectedRowId: (value) => { state.selectedRowId = value },
    onSelect: fillFormDataFromRow,
    onDeselect: resetSelectedFormData,
  })
}

function statistics(){ // 库存统计
  state.selectedRowId = null
  if (formData.reagentId === null || formData.lotId === null){
    eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX,{type:'info',title:'库存统计',message:'请选择要统计的记录'})
  }else{
    state.statisticsData={
      dataset: [
      {
        name: "示例",
        series: [0,1,2,3,4,5,6,7,8,9,10],
        color: '#ffffff',
        type: 'line',
        useProgression: false,
        dataLabels: true,
        smooth: false,
        dashed: false,
        useTag: 'none',
        shape: 'circle',
        useArea: true,
      }
    ],
    xAxisLabels: ['2025-01-01', '2027-01-02', '2029-01-03', '2030-01-04', '2035-01-05'],
    title: '试剂统计示例'
    }
    formData.starttime = getnowtime_previousmonth()
    formData.endtime = getnowtime()
    formData.intervalday = 1
    syncSubmitDisabled()
    state.drawer=true
  }
}

function syncSubmitDisabled() { // 检查输入
  syncSubmitDisabledByFields({
    formData,
    requiredFields: REQUIRED_FIELDS,
    target: state,
    disabledKey: 'statisticsbuttondisabled',
  })
}

async function list_reagentnumber() { // 获取试剂列表
    const data = await api_inventory_show({
      name: state.reagentname,
      page: state.page,
      pageSize: state.pagesize,
    })
    state.tableData = data.data.map(inv => ({
        ...inv,
        reagentId: inv.reagent.id,
        reagentName: inv.reagent.name,
        specifications: inv.reagent.specifications,
        warnNumber: inv.reagent.warnNumber,
        lotId: inv.lot.id,
        lotName: inv.lot.name,
        lotExpirationDate: inv.lot.expirationDate,
    }))
    state.totalpage = data.meta.totalPage
}

async function statistics_data() { // 获取统计数据
    const data = await api_inventory_statistics({
      onlyLot: formData.onlylot,
      reagentId: formData.reagentId,
      lotId: formData.lotId,
      startTime: formData.starttime,
      endTime: formData.endtime,
      intervalDay: formData.intervalday,
    })
    if (formData.onlylot){
      state.statisticsData.title = `${formData.reagentname}  ${formData.lotname}`
    }
    else{
      state.statisticsData.title = formData.reagentname
    }
    state.statisticsData.xAxisLabels = format_xAxisLabels(data.data.xAxisLabels)
    state.statisticsData.dataset = []
    for (let i in data.data.dataSet) {
      state.statisticsData.dataset.push({
        name: data.data.dataSet[i].name,
        series: data.data.dataSet[i].number,
        useProgression: false,
        dataLabels: true,
        smooth: false,
        dashed: false,
        useTag: 'none',
        color: lineStyles[i % lineStyles.length].color,
        shape: 'circle',
        type: lineStyles[i % lineStyles.length].type,
        useArea: true,
        
      })
    }     

  
}

  async function inventory_audit(){ // 更新信息
    await api_inventory_auditall(state)
    await list_reagentnumber()
} 


const lineStyles=[
  {  color: '#42d392',type: 'line' },
  { color: '#ffae00',type: 'line' },
  {  color: '#b267c1',type: 'line' },
]
// 生命周期钩子
onMounted(() => {
    list_reagentnumber()
})

</script >
<style scoped>
.inventory-page {
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

.drawer-title {
  font-size: 24px;
  font-weight: 800;
  color: var(--el-text-color-primary);
}

.toolbar {
  min-height: 90px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.toolbar-search {
  width: 250px;
}

.toolbar-pagination {
  margin-right: auto;
}

.button-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.inventory-table {
  margin-top: 8px;
  flex: 1;
  min-height: 0;
}

.drawer-content {
  display: grid;
  grid-template-columns: minmax(560px, 1fr) 320px;
  gap: 20px;
  align-items: start;
}

.chart-container {
  min-width: 0;
  overflow: auto;
}

.drawer-form p {
  margin: 0 0 6px 0;
}

.drawer-form :deep(.drawer-field) {
  width: 300px;
  margin-bottom: 12px;
}

.drawer-form-actions {
  margin-top: 10px;
}

@media (max-width: 1200px) {
  .drawer-content {
    grid-template-columns: 1fr;
  }
}
</style>

