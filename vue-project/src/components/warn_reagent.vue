<template>
    <div id="background" :style="null">   
      <el-switch 
      v-model="state.only_showwarn" 
      class="switch" size="large" 
      active-text="只显示警告" 
      inactive-text="显示所有" 
      inline-prompt 
      @change="list_reagentnumber"/>
        <el-pagination 
          class="searchinput" 
          background  
          layout="prev, pager, next"  
          v-model:current-page="state.current_page" 
          :page-count="state.total_pages" 
          @change="list_reagentnumber" 
        />
        <el-button 
          id="export"
          type="primary" 
          @click="exportToExcel"
          >
          导出盘库表</el-button>
          <el-button 
          id="cal"
          type="primary" 
          @click="refresh_reagent"
          >
          更新信息</el-button>
        <el-table
          :data="state.tableData"
          :default-sort="{ prop: 'date', order: 'descending' }"
          :style="{width:'calc(100vw - 205px)'}"
          row-class-name="rowstyle"
          header-cell-class-name="rowstyle"
        >
          <el-table-column prop="reagent__name" label="试剂名称" min-width="150" />
          <el-table-column prop="reagent__specifications" label="规格" min-width="100" />
          <el-table-column prop="reagent_number" label="库存" min-width="100" />
          <el-table-column prop="reagent__warn_number" label="警告数量" min-width="100" />
          <el-table-column prop="reagent__warn_days" label="警告天数" min-width="100" />
          <el-table-column prop="lastmonth_outnumber" label="上个月出库数量" min-width="130" />
          <el-table-column prop="lasttime" label="最后一次出库" min-width="200" :formatter="formatDateColumn" />
        </el-table>
    </div>
    <messagebox ref="messageboxRef"></messagebox>
</template>
<script setup>
import { ref, onMounted, reactive, onUnmounted } from 'vue'
import messagebox from '@/components/messagebox.vue'
import { formatDateColumn } from '@/api/dateformat.js'
import { eventBus, EVENT_TYPES } from '@/utils/eventBus'
import { api_list_reagentnumber,api_refresh_reagent } from '@/api/reagent_manger'
import * as XLSX from 'xlsx'
// 创建ref引用
const messageboxRef = ref(null)

// 状态管理
const state = reactive({
  inputsearchname: '',    // 输入搜索名称
  tableData: [],         // 表格数据，初始化为空数组
  current_page: 1,       // 当前页
  total_pages: 1,        // 总页
  only_showwarn: false,  // 是否只显示警告
})


function list_reagentnumber() {
    api_list_reagentnumber(state.only_showwarn,state.current_page)
        .then(function(data) {
            state.tableData = data.data.list
            state.total_pages = data.data.total_pages

        })
}

async  function exportToExcel() {
    let exportData=await api_list_reagentnumber(false,"all")
    exportData=exportData.data.list
    messageboxRef.value.messagebox_waitng("正在导出数据")
    // 准备导出数据
    exportData = exportData.map(item => ({
        '试剂名称': item.reagent__name,
        '规格': item.reagent__specifications,
        '应库存':item.reagent_number,
        '实际库存':null,
        '警告数量':item.reagent__warn_number,
        '警告天数':item.reagent__warn_days,
        '上个月出库数量':item.lastmonth_outnumber,
        '最后一次出库':formatDateColumn(null,null,item.lasttime)
    }))
    // 创建工作簿
    const ws = XLSX.utils.json_to_sheet(exportData)
    // 设置列宽
    ws['!cols'] = [
        { wch: 30 },  // 试剂名称列宽
        { wch: 10 },  // 规格列宽
        { wch: 10 },  // 应库存列宽
        { wch: 10 },   // 实际库存列宽
        { wch: 10 },   // 警告数量列宽
        { wch: 10 },   // 警告天数列宽
        { wch: 20 },   // 上个月出库数量列宽
        { wch: 30 },   // 最后一次出库列宽
    ]
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '盘库表')
    // 导出文件
    XLSX.writeFile(wb, `盘库表${new Date().toLocaleDateString()}.xlsx`)
    messageboxRef.value.closemessagebox()
  }

function refresh_reagent(){
  api_refresh_reagent()
  .then(function(data){
    messageboxRef.value.messagebox_waitng("正在更正库存")
    list_reagentnumber()
    messageboxRef.value.closemessagebox()
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
#background{
position: absolute;
top: 0px;
left:0px;
background-color:rgb(44, 62, 80);
height: 100vh;
width:100vw;
z-index: 0;
}
.el-table{
  position: absolute;
  left: 200px;
  top: 50px;
  background-color: rgb(44, 62, 80);
}
:deep(.el-table .rowstyle)
{
  color: rgb(255, 255, 255);
  background-color:rgb(44, 62, 80);
}
:deep(.el-table .rowstyle:hover)
{
  color: rgb(44, 62, 80);
  background-color: rgb(255, 255, 255);
}


.el-pagination{
  position: absolute;
  left: 400px;
  top: 10px;

}
#export{
  position: absolute;
  left: 900px;
  top: 10px;
}
#cal{
  position: absolute;
  left: 1000px;
  top: 10px;
}
.switch{
  position: absolute; 
  left: 250px;
  top: 10px;
  --el-switch-on-color: #76ca00;
  --el-switch-off-color: #cba006;

}
:deep( .searchinput .el-input__wrapper),
:deep( .searchinput .el-input__inner)
{
  background:transparent;
  --el-input-focus-border-color:white;
  color: white;
}

:deep(.el-pagination .btn-prev),
:deep(.el-pagination .btn-next) 
{
  background-color:transparent !important;
  color: white;
}

:deep(.el-pagination .el-pager li:not(.active):not(.disabled)) {
  background-color:transparent !important;
  color: white;
}
:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
  font-size: 25px;
}
</style>