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
      <div style="width:800px; position: absolute; left: 50px;">
        <statistics_chart  style="width: 800px; position:absolute; top: 0px; left: -10px;"> </statistics_chart>
    </div>
    </template>
    </el-drawer>
</template>
<script setup>





import {   ref, onMounted, reactive, onUnmounted } from 'vue'
import { eventBus, EVENT_TYPES } from '@/utils/eventBus'
import { api_inventory_show,api_inventory_auditall } from '@/api/inventory'
import {inventory_exporttoexcel_list} from '@/utils/exportexcel'
import { formatDateColumn } from '@/utils/format'
import statistics_chart from './statistics_chart.vue'





// 状态管理
const state = reactive({
  inputsearchname: '',    // 输入搜索名称
  tableData: [],         // 表格数据，初始化为空数组
  page: 1,       // 当前页
  totalpage: 1,        // 总页
  pagesize:13,
  reagentname:'',
  drawer:false,
  })
const tableRef = ref(null)
const formData = reactive({
  reagentId: '',
  lotId: '',
})

function tableRowClassName({ row,rowindex }) { // 表格行样式
  if (row.warning==="" || row.warning===null ) {
    return 'success-row'
  }
  return 'warning-row'
}

function handleRowClick(row) { // 表格行点击事件
  if(formData.reagentId === row.reagentId && formData.lotId === row.lotId){
    formData.reagentId = ''
    formData.lotId = ''
    tableRef.value.setCurrentRow(null)
  }else{
    formData.reagentId = row.reagentId
    formData.lotId = row.lotId
    tableRef.value.setCurrentRow(row)
  }
}

function statistics(){ // 库存统计
  if (formData.reagentId === '' && formData.lotId === ''){
    eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX,{type:'error',message:'请选择要统计的记录'})
  }else{
    state.drawer=true
    formData.reagentId = ''
    formData.lotId = ''
  }
}

async function list_reagentnumber() { // 获取试剂列表
    const data = await api_inventory_show(state)
    state.tableData = data.data
    state.totalpage = data.totalPage
}



  async function inventory_audit(){ // 更新信息
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
.button-container {
  position: absolute;
  left: 700px;
  top: 50px;
  display: flex;
  gap: 10px;
}
</style>