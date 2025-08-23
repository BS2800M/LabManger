<template>
    <div id="background" :style="null">  
      <div id="background2">
        <el-input 
          style="left:200px;top:10px;width:250px;" 
          v-model="state.reagentname" 
          placeholder="搜索试剂名称" 
          @input="list_reagentnumber" 
        />
        <el-pagination 
          background  
          layout="prev, pager, next"  
          v-model:current-page="state.page" 
          :page-count="state.totalpage" 
          @change="list_reagentnumber" 
          style="position: absolute;left: 200px;top: 50px;"
        />
        <el-button 
          id="export"
          type="primary" 
          @click="exportToExcel"
          style="position: absolute;left: 900px;top: 50px;"
          >
          导出盘库表</el-button>
          <el-button 
          id="cal"
          type="primary" 
          @click="inventory_audit"
          style="position: absolute;left: 1000px;top: 50px;"
          >
          更新信息</el-button>
        </div> 
        <el-table
          :data="state.tableData"
          :default-sort="{ prop: 'date', order: 'descending' }"
          :style="{width:'calc(100vw - 205px)'}"
          header-cell-class-name="rowstyle"
          :row-class-name="tableRowClassName"
        >
          <el-table-column prop="reagentName" label="试剂名称" min-width="130" show-overflow-tooltip/>
          <el-table-column prop="lotName" label="批号" min-width="130" show-overflow-tooltip/>
          <el-table-column prop="number" label="库存" min-width="80" show-overflow-tooltip/>
          <el-table-column prop="specifications" label="规格" min-width="80" show-overflow-tooltip/>
          <el-table-column prop="lotExpirationDate" label="有效期" min-width="150" :formatter="formatDateColumn" show-overflow-tooltip/>
          <el-table-column prop="warnNumber" :sortable="true" label="警告数量" min-width="100" show-overflow-tooltip/>
          <el-table-column label="操作" min-width="120">
          <template #default="scope">
            <el-button size="small" type="primary" @click="state.drawer=true">统计</el-button>
          </template>
        </el-table-column>
        </el-table>
    </div>

    <el-drawer v-model="state.drawer" direction="rtl" size="80%" >
      <template #header>
      <span >统计</span>
    </template>
      <template #footer>
      <div style="flex: auto">
        <el-button type="primary" @click="state.drawer=false">关闭</el-button>
      </div>
    </template>
    <template #default>
      <div style="width:800px; position: absolute; left: 50px;">
        <statistics_chart  style="width: 800px; position:absolute; top: 0px; left: -10px;"> </statistics_chart>
    </div>
    </template>
    </el-drawer>
</template>
<script setup>





import {  ref, onMounted, reactive, onUnmounted } from 'vue'
import { eventBus, EVENT_TYPES } from '@/utils/eventBus'
import { api_inventory_show,api_inventory_auditall } from '@/api/inventory'
import {Workbook} from 'exceljs'
import { formatDateColumn } from '@/api/dateformat.js'
import statistics_chart from './statistics_chart.vue'





// 状态管理
const state = reactive({
  inputsearchname: '',    // 输入搜索名称
  tableData: [],         // 表格数据，初始化为空数组
  page: 1,       // 当前页
  totalpage: 1,        // 总页
  pagesize:13,
  reagentname:'',
  drawer:false
  })


function tableRowClassName({ row,rowindex }) {
  if (row.warning==="" || row.warning===null ) {
    return 'success-row'
  }
  return 'warning-row'
}


async function list_reagentnumber() {
    const data = await api_inventory_show(state)
    state.tableData = data.data
    state.totalpage = data.totalPage
}

async function exportToExcel() {
  state.pagesize = 1000
  let result = await api_inventory_show(state)
  state.pagesize = 10
  // 取出数据数组
  let exportData = result.data || []
  // 准备导出数据
  exportData = exportData.map(item => ({
    '试剂名称': item.reagentName,
    '批号': item.lotName,
    '规格': item.specifications,
    '应库存': item.number,
    '实际库存': null,
    '有效期':item.lotExpirationDate,
    '警告数量': item.warnNumber,

  }))

  // 使用 exceljs 创建工作簿和工作表
  const workbook = new Workbook()
  const worksheet = workbook.addWorksheet('盘库表')

  // 添加表头
  worksheet.columns = [
    { header: '试剂名称', key: '试剂名称', width: 20 },
    { header: '批号', key: '批号', width: 20 },
    { header: '规格', key: '规格', width: 8 },
    { header: '应库存', key: '应库存', width: 8 },
    { header: '实际库存', key: '实际库存', width: 8 },
    { header: '有效期', key: '实际库存', width: 8 },
    { header: '警告数量', key: '实际库存', width: 8 },

  ]

  // 添加数据行
  exportData.forEach(row => {
    worksheet.addRow(row)
  })

  // 生成并下载 Excel 文件
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `盘库表${new Date().toLocaleDateString()}.xlsx`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
}

  async function inventory_audit(){
    await api_inventory_auditall(state)
    await list_reagentnumber()
} 


// 生命周期钩子
onMounted(() => {
    list_reagentnumber()
    eventBus.on(EVENT_TYPES.TEMPLATE_UPDATED, list_reagentnumber)
})

onUnmounted(() => {
  eventBus.off(EVENT_TYPES.TEMPLATE_UPDATED)
})
</script >
<style scoped>
#background2{
  height: 90px;
}
.el-table{
  position: absolute;
  left: 200px;
  top: 100px;
}
#export{
  position: absolute;
  left: 900px;
  top: 10px;
}
</style>