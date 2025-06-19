<template>
    <div id="background" :style="null">   
      <el-switch 
      class="switch"
      v-model="state.only_warn" 
      size="large" 
      active-text="显示警告" 
      inactive-text="显示所有" 
      inline-prompt  
      @change="list_reagentnumber"/>
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
        <el-table
          :data="state.tableData"
          :default-sort="{ prop: 'date', order: 'descending' }"
          :style="{width:'calc(100vw - 205px)'}"
          row-class-name="rowstyle"
          header-cell-class-name="rowstyle"
        >
          <el-table-column prop="reagentname" label="试剂名称" min-width="150" show-overflow-tooltip/>
          <el-table-column prop="lotname" label="批号" min-width="150" show-overflow-tooltip/>
          <el-table-column prop="specifications" label="规格" min-width="100" show-overflow-tooltip/>
          <el-table-column prop="inventory_number" label="库存" min-width="100" show-overflow-tooltip/>
          <el-table-column prop="warn_number" label="警告数量" min-width="100" show-overflow-tooltip/>
          <el-table-column prop="lastweek_outbound_number" label="上周出库数量" min-width="100" show-overflow-tooltip/>
          <el-table-column prop="last_outbound_time" label="最后一次出库" min-width="200" :formatter="formatDateColumn" show-overflow-tooltip/>
        </el-table>
    </div>
    <messagebox ref="messageboxRef"></messagebox>
</template>
<script setup>
import { ref, onMounted, reactive, onUnmounted } from 'vue'
import messagebox from '@/components/messagebox.vue'
import { formatDateColumn } from '@/api/dateformat.js'
import { eventBus, EVENT_TYPES } from '@/utils/eventBus'
import { api_inventory_show,api_inventory_audit } from '@/api/inventory'
import * as XLSX from 'xlsx'
// 创建ref引用
const messageboxRef = ref(null)

// 状态管理
const state = reactive({
  inputsearchname: '',    // 输入搜索名称
  tableData: [],         // 表格数据，初始化为空数组
  page: 1,       // 当前页
  totalpages: 1,        // 总页
  only_warn: false,  // 是否只显示警告
  pagesize:13
})

function openmessagebox(a,b,c){
  messageboxRef.value.openmessagebox(a,b,c)
}


async function list_reagentnumber() {
    api_inventory_show(state)
        .then(function(data) {
            state.tableData = data.data.data
            state.totalpages = data.data.totalpages

        })
        .catch(function(err){
          openmessagebox('error',err.response.data.msg,null)
        })
}

async  function exportToExcel() {
    state.pagesize=1000000
    let exportData=await api_inventory_show(state)
    exportData=exportData.data.data
    state.pagesize=10
    // 准备导出数据
    exportData = exportData.map(item => ({
        '试剂名称': item.reagentname,
        '批号': item.lotname,
        '规格': item.specifications,
        '应库存':item.inventory_number,
        '实际库存':null,
        '警告数量':item.warn_number,
        '警告天数':item.warn_days,
        '上周出库数量':item.lastweek_outbound_number,
        '最后一次出库':formatDateColumn(null,null,item.last_outbound_time)
    }))
    // 创建工作簿
    const ws = XLSX.utils.json_to_sheet(exportData)
    // 设置列宽
    ws['!cols'] = [
        { wch: 20 },  // 试剂名称列宽
        { wch: 20 },  // 批号名称列宽
        { wch: 8 },  // 规格列宽
        { wch: 8 },  // 应库存列宽
        { wch: 8 },   // 实际库存列宽
        { wch: 8 },   // 警告数量列宽
        { wch: 8 },   // 警告天数列宽
        { wch: 15 },   // 上个月出库数量列宽
        { wch: 20 },   // 最后一次出库列宽
    ]
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '盘库表')
    // 导出文件
    XLSX.writeFile(wb, `盘库表${new Date().toLocaleDateString()}.xlsx`)
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
  top: 100px;
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
  left: 250px;
  top: 10px;
  --el-switch-on-color: #76ca00;
  --el-switch-off-color: #cba006;

}
:deep( .el-input .el-input__wrapper),
:deep( .el-input .el-input__inner)
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