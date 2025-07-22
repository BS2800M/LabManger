<template>
    <div id="background" :style="null">
      <div id="background2">
        <el-input 
          class="searchinput"
          style="left:200px;top:10px;width:200px;" 
          v-model="state.name" 
          placeholder="搜索检验小组" 
          @input="team_show" 
        />
        <el-button 
          id="add" 
          type="success" 
          @click="editbox_openaddbox"
          style=" position: absolute;left: 1000px;top: 50px;"
        >增加检验小组</el-button>
        <el-pagination 
          style=" position: absolute;left: 200px;top: 50px;"
          class="searchinput" 
          background  
          layout="prev, pager, next"  
          v-model:current-page="state.page" 
          :page-count="state.totalpages" 
          @change="team_show" 
        />
      </div>
        <el-table
          :data="state.tableData"
          :default-sort="{ prop: 'date', order: 'descending' }"
          :style="{width:'calc(100vw - 205px)'}"
          row-class-name="rowstyle"
          header-cell-class-name="rowstyle"
        >
          <el-table-column prop="name" label="名字" sortable min-width="100" />
          <el-table-column prop="phone" label="电话" min-width="100" />
          <el-table-column prop="note" label="其他说明" min-width="350" />
          <el-table-column label="操作" min-width="100">
            <template #default="scope">
              <el-button size="small" type="primary" @click="editbox_openeditbox(scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX,{type:'delete',message:'是否删除',action:()=>team_del(scope.row.id)})">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
    </div>
    <team_editbox ref="editboxRef"></team_editbox>
</template>
<script setup>
import { ref, onMounted, reactive, onUnmounted } from 'vue'
import team_editbox from '@/components/team_editbox.vue'
import { api_team_show,api_team_del} from '@/api/team.js'
import { eventBus, EVENT_TYPES } from '@/utils/eventBus'


const editboxRef = ref(null)
// 状态管理
const state = reactive({
  name: '',    // 输入搜索名称
  tableData: [],         // 表格数据，初始化为空数组
  total: 0,        // 总数
  pagesize: 10,    // 每页条数
  totalpages: 1,   // 总页数
  page: 1,       // 当前页
  total_pages: 1,        // 总页
})



function editbox_openaddbox() {
    editboxRef.value.openaddbox()
}

function editbox_openeditbox(editdate) {
    editboxRef.value.openeditbox(editdate)  
}

async function team_show() {
    api_team_show(state)
        .then(function(data) {
            state.tableData = data.data
            state.total = data.total
            state.pagesize = data.pagesize
            state.totalpages = data.totalpages
        })

}

async function team_del(id){
  api_team_del(id).then(data=>{
    eventBus.emit(EVENT_TYPES.TEAM_UPDATED)
    eventBus.emit(EVENT_TYPES.CLOSE_MESSAGEBOX)
    })

}

// 生命周期钩子
onMounted(() => {
    team_show()

    eventBus.on(EVENT_TYPES.TEAM_UPDATED,team_show)
})

onUnmounted(() => {
  eventBus.off(EVENT_TYPES.TEAM_UPDATED)
})
</script >
<style scoped>

.el-table{
  position: absolute;
  left: 200px;
  top: 100px;
}
#background2{
  height: 90px;
}
#add{
  position: absolute;
  left:1000px;
  top:5px
}




</style>