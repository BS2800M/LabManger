<template>
    <div id="background" :style="null">
      <div id="background2">
        <el-input 
          class="searchinput"
          style="left:200px;top:10px;width:200px;" 
          v-model="state.name" 
          placeholder="搜索用户" 
          @input="user_show" 
        />
        <el-button 
          id="add" 
          type="success" 
          @click="editbox_openaddbox"
        >增加用户</el-button>
        <el-pagination 
         style=" position: absolute;left: 200px;top: 50px;"
          class="searchinput" 
          background  
          layout="prev, pager, next"  
          v-model:current-page="state.page" 
          :page-count="state.totalpages" 
          @change="user_show" 
        />
      </div>
        <el-table
          :data="state.tableData"
          :default-sort="{ prop: 'date', order: 'descending' }"
          :style="{width:'calc(100vw - 205px)'}"
          row-class-name="rowstyle"
          header-cell-class-name="rowstyle"
        >
          <el-table-column prop="username" label="用户名" sortable min-width="100" />
          <el-table-column prop="rolename" label="角色" min-width="100" />
          <el-table-column prop="teamname" label="团队" min-width="100" />
          <el-table-column label="操作" min-width="100">
            <template #default="scope">
              <el-button size="small" type="primary" @click="editbox_openeditbox(scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="openmessagebox('delete','是否删除',()=>user_del(scope.row.id))">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
    </div>
    <messagebox ref="messageboxRef"></messagebox>
    <user_editbox ref="editboxRef"></user_editbox>
</template>
<script setup>
import { ref, onMounted, reactive, onUnmounted } from 'vue'
import messagebox from '@/components/messagebox.vue'
import { api_user_show,api_user_del,api_user_add} from '@/api/user.js'
import { eventBus, EVENT_TYPES } from '@/utils/eventBus'
import user_editbox from '@/components/user_editbox.vue'

// 创建ref引用
const messageboxRef = ref(null)
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

function openmessagebox(a,b,c){
  messageboxRef.value.openmessagebox(a,b,c)
}

function editbox_openaddbox() {
    editboxRef.value.openaddbox()
}

function editbox_openeditbox(editdate) {
    editboxRef.value.openeditbox(editdate)  
}

async function user_show() {
    api_user_show(state)
        .then(function(data) {
            state.tableData = data.data.data
            state.total = data.data.total
            state.pagesize = data.data.pagesize
            state.totalpages = data.data.totalpages
        })
        .catch(function(err) {
          openmessagebox('error',err.response.data.msg,null)
            state.tableData = []
        })
}

async function user_del(id){
    api_user_del(id).then(data=>{
    eventBus.emit(EVENT_TYPES.USER_UPDATED)
    messageboxRef.value.closemessagebox()
    })
  .catch(function(err){
    openmessagebox('error',err.response.data.msg,null)
  })
}

// 生命周期钩子
onMounted(() => {
    user_show()
    eventBus.on(EVENT_TYPES.USER_UPDATED,user_show)
})

onUnmounted(() => {
  eventBus.off(EVENT_TYPES.USER_UPDATED)
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

#add{
  position: absolute;
  left:1000px;
  top:5px
}

</style>