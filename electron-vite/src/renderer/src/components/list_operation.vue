<template>
    <div id="background" :style="null">
        <div id="background2">
            <el-input 
                style="left:200px;top:10px;width:250px;" 
                v-model="state.reagentname" 
                placeholder="试剂名称" 
                @input="operation_show" 
                
            />
            <el-input 
                style="left:210px;top:10px;width:250px;" 
                v-model="state.barcodenumber" 
                placeholder="条码号" 
                @input="operation_show" 
            />
            <el-config-provider :locale="zhCn">
                <el-date-picker 
                    v-model="state.searchlater_show" 
                    style="left:220px;top:10px;width:150px;" 
                    type="date"
                    placeholder="选择开始日期" 
                    size="default" 
                    @change="operation_show" 
                    value-format="YYYY-MM-DD 00:00:01"
                />
            </el-config-provider>
            <el-config-provider :locale="zhCn">
                <el-date-picker 
                    v-model="state.searchearlier_show" 
                    style="left:230px;top:10px;width:150px;" 
                    type="date"
                    placeholder="选择结束日期" 
                    size="default" 
                    @change="operation_show" 
                    value-format="YYYY-MM-DD 23:59:59"
                />
            </el-config-provider>
            <el-pagination 
                background 
                layout="prev, pager, next"  
                v-model:current-page="state.page" 
                :page-count="state.totalpages" 
                @change="operation_show" 
                style= " position:absolute;left:200px;top:50px;"
            />
            <el-button 
                id="export"
                type="primary" 
                @click="exportToExcel"
                style="position:absolute;left:1000px;top:50px;"
            >
                导出记录(列表版)
            </el-button>
            <el-button 
                id="export"
                type="primary" 
                @click="exportToExcel_info"
                style="position:absolute;left:800px;top:50px;"
            >
                导出记录(信息版)
            </el-button>
        </div>
        <el-table
            :data="tableData"
            :default-sort="{ prop: 'date', order: 'descending' }"
            :style="{width:'calc(100vw - 210px)'}"
            row-class-name="rowstyle"
            header-cell-class-name="rowstyle"
        >
            <el-table-column prop="creation_time" label="时间" sortable min-width="120" :formatter="formatDateColumn" show-overflow-tooltip/>
            <el-table-column prop="reagentname" label="试剂名称" min-width="100" show-overflow-tooltip/>
            <el-table-column prop="lotname" label="批号" min-width="100" show-overflow-tooltip/>
            <el-table-column prop="operation_action" label="动作" min-width="80" show-overflow-tooltip/>
            <el-table-column prop="barcodenumber" label="条码号" min-width="100" show-overflow-tooltip/>
            <el-table-column prop="username" label="用户" min-width="100" show-overflow-tooltip/>
            <el-table-column label="操作" min-width="150">
                <template #default="scope">
                    <el-button size="small" type="primary" @click="barcodeprint(scope.row)">补打条码</el-button>
                    <el-button size="small" type="danger" @click="eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX,{type:'delete',message:'是否删除',action:()=>operation_del(scope.row.id)})">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>


<script setup>
  import {ref,onMounted,reactive,onUnmounted} from 'vue'
  import { ElConfigProvider } from 'element-plus'
  import zhCn from 'element-plus/es/locale/lang/zh-cn'
  import { api_operation_show,api_operation_del } from '@/api/operation'
  import { toRaw } from 'vue';
  import {formatDateColumn,getnowtime,getnowtime_previousmonth} from '@/api/dateformat.js'
  import * as XLSX from 'xlsx'
  import { eventBus, EVENT_TYPES } from '@/utils/eventBus'
  import {format_YYYYMMDDHHmm_iso} from '@/api/dateformat.js'
  import {exportToExcel_info } from '@/api/exportToExcel_info.js'

  // 状态管理
  const state = reactive({
    reagentname: '',    // 输入搜索名称
    barcodenumber: '' ,    // 条码号
    searchlater: "",  // 搜索开始时间(iso)
    searchearlier: "",    // 搜索结束时间(iso)
    page: 1,       // 当前页
    totalpages: 1,        // 总页
    pagesize:13,
    searchlater_show:getnowtime_previousmonth(),
    searchearlier_show:getnowtime()
    

  })

  let tableData=ref(null)





onMounted(() => {
    operation_show()
    eventBus.on(EVENT_TYPES.OPERATION_UPDATED, operation_show)
})

onUnmounted(() => {
  eventBus.off(EVENT_TYPES.OPERATION_UPDATED)
})
async function operation_show(){
    state.searchlater=format_YYYYMMDDHHmm_iso(state.searchlater_show)
    state.searchearlier=format_YYYYMMDDHHmm_iso(state.searchearlier_show)
    api_operation_show(state) 
    .then(data=>{
      tableData.value=data.data
      state.totalpages=data.totalpages
      state.page=data.page

 } )

}
  function barcodeprint(data){
    let printdatalist=[]
    printdatalist.push(toRaw(data))
    myapi.gotoprint(printdatalist)
  }      
  async function operation_del(id){
    api_operation_del(id).then(data=>{
      eventBus.emit(EVENT_TYPES.OPERATION_UPDATED)
      eventBus.emit(EVENT_TYPES.CLOSE_MESSAGEBOX)
    })

  }
  async  function exportToExcel() {
    state.pagesize=9000000 // 设置为最大值

    let exportData=await api_operation_show(state)
    state.pagesize=10 // 恢复默认值
    // 准备导出数据
    exportData = exportData.map(item => ({
        '时间': formatDateColumn(null, null, item.creation_time),
        '试剂名称': item.reagentname,
        '批号': item.lotname,
        '动作': item.operation_action,
        '用户': item.username,
        '条码号': item.barcodenumber
    }))
    // 创建工作簿
    const ws = XLSX.utils.json_to_sheet(exportData)
    // 设置列宽
    ws['!cols'] = [
        { wch: 30 },  // 时间列宽
        { wch: 30 },  // 试剂名称列宽
        { wch: 20 },  // 批号列宽
        { wch: 10 },  // 动作列宽
        { wch: 10 },  // 用户列宽
        { wch: 20 }   // 条码号列宽
    ]
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '操作记录')
    // 导出文件
    XLSX.writeFile(wb, `操作记录${new Date().toLocaleDateString()}.xlsx`)
  }

</script>
  <style scoped>

#background2{
  height: 90px;
}
.el-table{
  position: absolute;
  left: 200px;
  top: 100px;
  background-color:rgb(53, 73, 94);
}


  </style>