<template>
    <div id="background" >
      <div id="background2">
        <el-input 
          style="left:200px;top:10px;width:250px;" 
          v-model="state.name" 
          placeholder="搜索试剂名称" 
          @input="reagent_show" 
        />
        <el-button 
          id="add" 
          type="success" 
          @click="editbox_openaddbox()"
          style=" position:absolute;left:1000px; top:50px;"
        >增加模板</el-button>
        <el-pagination 
          background  
          layout="prev, pager, next"  
          v-model:current-page="state.page" 
          :page-count="state.totalpages" 
          @change="reagent_show" 
          style="position: absolute;left: 200px;top: 50px;"
        />
      </div>
        <el-table
          :data="state.tableData"
          :default-sort="{ prop: 'date', order: 'descending' }"
          :style="{width:'calc(100vw - 205px)'}"
          row-class-name="rowstyle"
          header-cell-class-name="rowstyle"
        >
          <el-table-column prop="name" label="试剂名称" min-width="150" show-overflow-tooltip/>
          <el-table-column prop="specifications" label="规格" min-width="100" show-overflow-tooltip/>
          <el-table-column prop="warn_number" label="警告数量" min-width="100" show-overflow-tooltip/>
          <el-table-column prop="warn_days" label="警告天数" min-width="100" show-overflow-tooltip/>
          <el-table-column label="操作" min-width="100">
            <template #default="scope">
              <el-button size="small" type="primary" @click="editbox_openeditbox(scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="openmessagebox('delete','是否删除',()=>reagent_del(scope.row.id))">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
    </div>
    <messagebox ref="messageboxRef"  ></messagebox>
    <template_editbox ref="editboxRef"></template_editbox>
</template>
<script setup>
import { ref, onMounted, reactive, onUnmounted } from 'vue'
import messagebox from './messagebox.vue'
import template_editbox from './template_editbox.vue'
import { api_reagent_show,api_reagent_del } from '@/api/reagent'
import { eventBus, EVENT_TYPES } from '@/utils/eventBus'
// 创建ref引用
const editboxRef = ref(null)
const messageboxRef = ref(null)



// 状态管理
const state = reactive({
  name: '',    // 输入搜索名称
  tableData: [],         // 表格数据，初始化为空数组
  page: 1,       // 当前页
  totalpages: 1,        // 总页
  pagesize:13,
})


function openmessagebox(a,b,c){
  messageboxRef.value.openmessagebox(a,b,c)
}
function editbox_openaddbox() {
    editboxRef.value.openaddbox()
}

function editbox_openeditbox(editdate) {
    editboxRef.value.openeditbox(editdate)
}

async function reagent_show() {
    api_reagent_show(state)
        .then(function(data) {
            state.tableData = data.data
            console.log(data)
            state.totalpages = data.totalpages
        })
        .catch(function(err) {
          openmessagebox('error',err.response.data.msg,null)
            state.tableData = []
        })
}
async function reagent_del(id){
  api_reagent_del(id).then(data=>{
    eventBus.emit(EVENT_TYPES.TEMPLATE_UPDATED)
    messageboxRef.value.closemessagebox()
  })
  .catch(function(err){
      openmessagebox('error',err.response.data.msg,null)
  })
}
// 生命周期钩子
onMounted(() => {
    reagent_show()
    eventBus.on(EVENT_TYPES.TEMPLATE_UPDATED,reagent_show)
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


</style>