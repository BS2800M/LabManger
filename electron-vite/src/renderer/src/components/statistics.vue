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
        <el-table
          ref="tableRef"
          highlight-current-row
          @row-click="handleRowClick"
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
        <div class="drawer-content">
          <div class="chart-container">
            <statistics_chart v-model="state.statisticsData" />
          </div>
            <div class="date-picker-container">
              <el-config-provider :locale=zhCn> 
                  <el-date-picker 
                    v-model="formData.starttime" 
                    type="datetime"
                    placeholder="选择开始时间" 
                    size="default" 
                    @change="checkinput"
                    value-format="YYYY-MM-DD HH:mm:ss"
                  />   
                </el-config-provider>
                <el-config-provider :locale=zhCn> 
                  <el-date-picker 
                    v-model="formData.endtime" 
                    type="datetime"
                    placeholder="选择结束时间" 
                    size="default" 
                    @change="checkinput"
                    value-format="YYYY-MM-DD HH:mm:ss"
                  />   
                </el-config-provider>
                <el-input-number v-model="formData.intervalday" style="width: 150px; height: 33px; color: white;" :min="1" :max="365" placeholder="1" @change="checkinput" />
                <el-switch v-model="formData.onlylot" size="large" active-text="是"inactive-text="否"    />
                <el-button type="primary" @click="statistics_data" :disabled="state.statisticsbuttondisabled">查询</el-button>
            </div>
            <div class="date-picker-text">
              <span style="margin-right: 150px;">开始时间</span>
              <span style="margin-right: 150px;">结束时间</span>
              <span style="margin-right: 70px;">间隔时间(天)</span>
              <span style="margin-right: 0px;">只统计本批号</span>
            </div>
          </div>

      </template>
    </el-drawer>
</template>
<script setup>





import {   ref, onMounted, reactive } from 'vue'
import { eventBus, EVENT_TYPES } from '@/utils/eventBus'
import { api_inventory_show,api_inventory_auditall,api_inventory_statistics } from '@/api/inventory'
import {inventory_exporttoexcel_list} from '@/utils/exportexcel'
import { formatDateColumn } from '@/utils/format'
import statistics_chart from './statistics_chart.vue'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { getnowtime_previousmonth,getnowtime,format_xAxisLabels,format_YYYYMMDDHHmm_iso } from '@/utils/format'


const formData = reactive({
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
  drawer:false,
  statisticsbuttondisabled:true,
  statisticsData: { }    
})
const tableRef = ref(null)


function tableRowClassName({ row,rowindex }) { // 表格行样式
  if (row.warning==="" || row.warning===null ) {
    return 'success-row'
  }
  return 'warning-row'
}

function handleRowClick(row) { // 表格行点击事件
  if(formData.reagentId === row.reagentId && formData.lotId === row.lotId){
    formData.reagentname = ''
    formData.reagentId = null
    formData.lotId = null
    formData.lotname = ''
    tableRef.value.setCurrentRow(null)
  }else{
    formData.reagentname = row.reagentName
    formData.reagentId = row.reagentId
    formData.lotId = row.lotId
    formData.lotname = row.lotName
    tableRef.value.setCurrentRow(row)
  }
}

function statistics(){ // 库存统计
  if (formData.reagentId === null || formData.lotId === null){
    eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX,{type:'error',message:'请选择要统计的记录'})
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
    state.statisticsbuttondisabled = false
    state.drawer=true
  }
}

function checkinput() { // 检查输入
  if (formData.starttime === null || formData.endtime === null || formData.intervalday === null || formData.reagentId === null) {
    state.statisticsbuttondisabled = true
  } else {
    state.statisticsbuttondisabled = false
  }
}

async function list_reagentnumber() { // 获取试剂列表
    const data = await api_inventory_show(state)
    state.tableData = data.data
    state.totalpage = data.totalPage
}

async function statistics_data() { // 获取统计数据
    const data = await api_inventory_statistics(formData)
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
#background2{
  height: 90px;
}
.el-table{
  position: absolute;
  left: 200px;
  top: 100px;
}
.button-container {
  position: absolute;
  left: 700px;
  top: 50px;
  display: flex;
  gap: 10px;
}

.date-picker-container {
  display: flex;
  gap: 15px;
  position: relative;
  left: 40px;
  top: 20px;
  width: 800px;

}
.date-picker-text {
  display: flex;
  gap: 0px;
  position: relative;
  left: 40px;
  top: 20px;
  width: 800px;
}
</style>