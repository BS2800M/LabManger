<template>
    <div id="background" :style="null">
        <div id="background2">
            <el-input 
                style="left:200px;top:10px;width:250px;" 
                v-model="state.reagentName" 
                placeholder="试剂名称" 
                @input="operation_show" 
                
            />
            <el-input 
                style="left:210px;top:10px;width:250px;" 
                v-model="state.barcodeNumber" 
                placeholder="条码号" 
                @input="operation_show" 
            />
            <el-config-provider :locale="zhCn">
                <el-date-picker 
                    v-model="state.starttime_show" 
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
                    v-model="state.endtime_show" 
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
                :page-count="state.totalpage" 
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
            <el-table-column prop="createTime" label="时间" sortable min-width="150" :formatter="formatDateColumn" show-overflow-tooltip/>
            <el-table-column prop="reagentName" label="试剂名称" min-width="100" show-overflow-tooltip/>
            <el-table-column prop="lotName" label="批号" min-width="100" show-overflow-tooltip/>
            <el-table-column prop="action" label="动作" min-width="80" show-overflow-tooltip/>
            <el-table-column prop="barcodeNumber" label="条码号" min-width="100" show-overflow-tooltip/>
            <el-table-column prop="note" label="注释" min-width="80" show-overflow-tooltip/>
            <el-table-column prop="userName" label="用户" min-width="100" show-overflow-tooltip/>
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
  import {Workbook} from 'exceljs'
  import { eventBus, EVENT_TYPES } from '@/utils/eventBus'
  import {format_YYYYMMDDHHmm_iso} from '@/api/dateformat.js'
  import {exportToExcel_info } from '@/api/exportToExcel_info.js'

  // 状态管理
  const state = reactive({
    reagentName: '',    // 输入搜索名称
    barcodeNumber: '' ,    // 条码号
    starttime: "",  // 搜索开始时间(iso)
    endtime: "",    // 搜索结束时间(iso)
    page: 1,       // 当前页
    totalpage: 1,        // 总页
    pagesize:13,
    starttime_show:getnowtime_previousmonth(),
    endtime_show:getnowtime()
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
    state.starttime = format_YYYYMMDDHHmm_iso(state.starttime_show)
    state.endtime = format_YYYYMMDDHHmm_iso(state.endtime_show)
    const data = await api_operation_show(state)
    tableData.value = data.data
    state.totalpage = data.totalPage
    state.page = data.page
}
  function barcodeprint(data){
    let printdatalist=[]
    printdatalist.push(toRaw(data))
    myapi.gotoprint(printdatalist)
  }      
  async function operation_del(id){
    await api_operation_del(id)
    eventBus.emit(EVENT_TYPES.OPERATION_UPDATED)
    eventBus.emit(EVENT_TYPES.CLOSE_MESSAGEBOX)
  }
  async  function exportToExcel() {
    state.pagesize = 1000 // 设置为最大值

    let result = await api_operation_show(state)
    state.pagesize = 10 // 恢复默认值
    // 取出数据数组
    let exportData = result.data || []
    // 准备导出数据
    exportData = exportData.map(item => ({
      '时间': formatDateColumn(null, null, item.createTime),
      '试剂名称': item.reagentName,
      '批号': item.lotName,
      '动作': item.action,
      '用户': item.userName,
      '条码号': item.barcodeNumber,
      '注释': item.note
    }))

    // 使用 exceljs 创建工作簿和工作表
    const workbook = new Workbook()
    const worksheet = workbook.addWorksheet('操作记录')

    // 添加表头
    worksheet.columns = [
      { header: '时间', key: '时间', width: 30 },
      { header: '试剂名称', key: '试剂名称', width: 30 },
      { header: '批号', key: '批号', width: 20 },
      { header: '动作', key: '动作', width: 10 },
      { header: '用户', key: '用户', width: 10 },
      { header: '条码号', key: '条码号', width: 20 },
      { header: '注释', key: '注释', width: 40 }
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
    a.download = `操作记录${new Date().toLocaleDateString()}.xlsx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
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