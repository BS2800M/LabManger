<template>
    <div id="background" :style="null">  
      <div id="background2">
        <el-pagination 
          background  
          layout="prev, pager, next"  
          v-model:current-page="state.page" 
          :page-count="state.totalpages" 
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
          row-class-name="rowstyle"
          header-cell-class-name="rowstyle"
        >
          <el-table-column prop="reagentname" label="试剂名称" min-width="150" show-overflow-tooltip/>
          <el-table-column prop="lotname" label="批号" min-width="150" show-overflow-tooltip/>
          <el-table-column prop="inventory_number" label="库存" min-width="100" show-overflow-tooltip/>
          <el-table-column prop="warn_number" label="警告数量" min-width="100" show-overflow-tooltip/>
          <el-table-column prop="lastweek_outbound_number" label="上周出库数量" min-width="100" show-overflow-tooltip/>
          <el-table-column prop="last_outbound_time" label="最后一次出库" min-width="200" :formatter="formatDateColumn" show-overflow-tooltip/>
        </el-table>
    </div>
</template>
<script setup>


import {  onMounted, reactive, onUnmounted } from 'vue'
import { formatDateColumn } from '@/api/dateformat.js'
import { eventBus, EVENT_TYPES } from '@/utils/eventBus'
import { api_inventory_show,api_inventory_audit } from '@/api/inventory'
import {Workbook} from 'exceljs'


// 状态管理
const state = reactive({
  inputsearchname: '',    // 输入搜索名称
  tableData: [],         // 表格数据，初始化为空数组
  page: 1,       // 当前页
  totalpages: 1,        // 总页
  pagesize:13
})




async function list_reagentnumber() {
    api_inventory_show(state)
        .then(function(data) {
          console.log(data)
            state.tableData = data.data
            state.totalpages = data.totalpages
        })
}

async function exportToExcel() {
  state.pagesize = 1000000
  let result = await api_inventory_show(state)
  state.pagesize = 10
  // 取出数据数组
  let exportData = result.data || []
  // 准备导出数据
  exportData = exportData.map(item => ({
    '试剂名称': item.reagentname,
    '批号': item.lotname,
    '规格': item.specifications,
    '应库存': item.inventory_number,
    '实际库存': null,
    '警告数量': item.warn_number,
    '警告天数': item.warn_days,
    '上周出库数量': item.lastweek_outbound_number,
    '最后一次出库': formatDateColumn(null, null, item.last_outbound_time)
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
    { header: '警告数量', key: '警告数量', width: 8 },
    { header: '警告天数', key: '警告天数', width: 8 },
    { header: '上周出库数量', key: '上周出库数量', width: 15 },
    { header: '最后一次出库', key: '最后一次出库', width: 20 }
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
    state.reagentid=-1
    state.lotid=-1
  api_inventory_audit(state).then(function(data){
    list_reagentnumber()
    state.reagentid=undefined
    state.lotid=undefined
  })
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