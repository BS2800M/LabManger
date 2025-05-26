<template>
    <messagebox ref="messageboxRef"></messagebox>
    <div id="background" :style="null">
        <div id="search">
            <el-input 
                style="left:200px;top:10px;width:250px;" 
                v-model="state.inputsearchname" 
                placeholder="试剂名称" 
                @input="list_operation" 
                
            />
            <el-input 
                style="left:210px;top:10px;width:250px;" 
                v-model="state.barcodenumber" 
                placeholder="条码号" 
                @input="list_operation" 
            />
            <el-config-provider :locale="zhCn">
                <el-date-picker 
                    v-model="state.search_starttime" \
                    style="left:220px;top:10px;width:150px;" 
                    type="date"
                    placeholder="选择开始日期" 
                    size="default" 
                    @change="list_operation" 
                    value-format="YYYY-MM-DD"
                />
            </el-config-provider>
            <el-config-provider :locale="zhCn">
                <el-date-picker 
                    v-model="state.search_endtime" 
                    style="left:230px;top:10px;width:150px;" 
                    type="date"
                    placeholder="选择结束日期" 
                    size="default" 
                    @change="list_operation" 
                    value-format="YYYY-MM-DD"
                />
            </el-config-provider>
            <el-pagination 
                background 
                layout="prev, pager, next"  
                v-model:current-page="state.current_page" 
                :page-count="state.total_pages" 
                @change="list_operation" 
                style= " position:absolute;left:200px;top:50px;"
            />
            <el-button 
                id="export"
                type="primary" 
                @click="exportToExcel"
                style="position:absolute;left:1000px;top:50px;"
            >
                导出记录
            </el-button>
        </div>
        <el-table
            :data="tableData"
            :default-sort="{ prop: 'date', order: 'descending' }"
            :style="{width:'calc(100vw - 210px)'}"
            row-class-name="rowstyle"
            header-cell-class-name="rowstyle"
        >
            <el-table-column prop="creation_time" label="时间" sortable min-width="120" :formatter="formatDateColumn" />
            <el-table-column prop="reagent__name" label="试剂名称" min-width="100" />
            <el-table-column prop="lot__lot" label="批号" min-width="100" />
            <el-table-column prop="operation_action" label="动作" min-width="80" />
            <el-table-column prop="barcodenumber" label="条码号" min-width="100" />
            <el-table-column prop="username" label="用户" min-width="100" />
            <el-table-column label="操作" min-width="150">
                <template #default="scope">
                    <el-button size="small" type="primary" @click="barcodeprint(scope.row)">补打条码</el-button>
                    <el-button size="small" type="danger" @click="openmessagebox('delete','是否删除',api_delete_operation,scope.row.id,EVENT_TYPES.OPERATION_UPDATED)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>


<script setup>
  import {ref,onMounted,reactive,onUnmounted} from 'vue'
  import { ElConfigProvider } from 'element-plus'
  import zhCn from 'element-plus/es/locale/lang/zh-cn'
  import messagebox from '@/components/messagebox.vue'
  import { api_list_operation,api_delete_operation } from '@/api/reagent_manger'
  import { toRaw } from 'vue';
  import {formatDateColumn,getnowtime_previousmonth,getnowtime,shift_nextday} from '@/api/dateformat.js'
  import * as XLSX from 'xlsx'
  import { eventBus, EVENT_TYPES } from '@/utils/eventBus'

  // 状态管理
  const state = reactive({
    inputsearchname: '',    // 输入搜索名称
    search_starttime: getnowtime_previousmonth(),  // 搜索开始时间
    search_endtime: getnowtime(),    // 搜索结束时间
    current_page: 1,       // 当前页
    total_pages: 1,        // 总页
    barcodenumber: '' ,    // 条码号
    inputteam:{teamid:localStorage.getItem('t_teamid'),selectid:localStorage.getItem('t_selectid')}
  })
  // 创建ref引用
  const messageboxRef = ref(null)
  let tableData=ref(null)



  function openmessagebox(a,b,c,d,e){
  messageboxRef.value.openmessagebox(a,b,c,d,e)
}

onMounted(() => {
    list_operation()
    eventBus.on(EVENT_TYPES.OPERATION_UPDATED, list_operation)
})

onUnmounted(() => {
  eventBus.off(EVENT_TYPES.OPERATION_UPDATED)
})
  function list_operation(){
    api_list_operation(state.inputsearchname,state.search_starttime,shift_nextday(state.search_endtime),state.current_page,state.barcodenumber,state.inputteam.teamid) //注意 这里的结束日期要包括这一天 所以传入结束日期是现在的时间往后推一天
    .then(data=>{
      tableData.value=data.data.list
      state.total_pages=data.data.total_pages
      state.current_page=data.data.current_page

 } )
  .catch(err=>{
    openmessagebox('error',err,'close',null,null)
                })
}
  function barcodeprint(data){
    let printdatalist=[]
    printdatalist.push(toRaw(data))
    myapi.gotoprint(printdatalist)
  }      

  async  function exportToExcel() {
    let exportData=await api_list_operation(state.inputsearchname,state.search_starttime,shift_nextday(state.search_endtime),"all",state.barcodenumber,state.inputteam.teamid)
    exportData=exportData.data.list
    // 准备导出数据
    exportData = exportData.map(item => ({
        '时间': formatDateColumn(null, null, item.creation_time),
        '试剂名称': item.reagent__name,
        '批号': item.lot__lot,
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


:deep( .el-input .el-input__wrapper),
:deep( .el-input .el-input__inner)
{
  background-color: rgb(44, 62, 80);
  --el-input-focus-border-color:white;
  color: white;
}

:deep( .el-input .el-input__wrapper),
:deep( .el-input .el-input__inner)
{
  background-color:transparent;
  --el-input-focus-border-color:white;
  color: white;
}
/* 翻页器的样式 */
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

.print{
  z-index: 10;
  position: absolute;
}
  </style>