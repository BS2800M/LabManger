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
          @click="add_drawer"
          style=" position: absolute;left: 1000px;top: 50px;"
        >增加用户</el-button>
        <el-pagination 
         style=" position: absolute;left: 200px;top: 50px;"
          class="searchinput" 
          background  
          layout="prev, pager, next"  
          v-model:current-page="state.page" 
          :page-count="state.totalpage" 
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
          <el-table-column prop="userName" label="用户名" sortable min-width="100" />
          <el-table-column prop="role" label="角色" min-width="100" />
          <el-table-column prop="teamName" label="团队" min-width="100" />
          <el-table-column label="操作" min-width="100">
            <template #default="scope">
              <el-button size="small" type="primary" @click="edit_drawer(scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX,{type:'delete',message:'是否删除',action:()=>user_del(scope.row.id)})">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
    </div>

    <el-drawer v-model="state.drawer" direction="rtl" size="30%" >
      <template #header>
      <span >用户管理</span>
    </template>
      <template #footer>
      <div style="flex: auto">
        <el-button  size="large" type="warning" v-show="state.updatebutton_show"   @click="user_update"  :disabled="state.updatebutton_disable" >修改</el-button>
        <el-button  size="large" type="success" v-show="state.addbutton_show"  @click="user_add"  :disabled="state.addbutton_disable">增加</el-button>
        <el-button  size="large" type="primary"  @click="state.drawer=false">关闭</el-button>
      </div>
    </template>
    <template #default>
      <div id="content1">
        <p>用户名</p>  
        <el-input v-model="formData.username" style="width: 300px" placeholder="用户名"  />
        <p>密码</p>  
        <el-input v-model="formData.password" style="width: 300px" placeholder="密码" />
      </div>
      <div id="content2">
        <p>角色</p>  
        <role_select v-model="formData.role" style="width: 300px" placeholder="角色" />
        <p>团队</p>  
        <team_select v-model="formData.teamid" style="width: 300px" placeholder="团队" />
      </div>
    </template>
    </el-drawer>

</template> 
<script setup>
  import {onMounted, reactive } from 'vue'
  import { api_user_show,api_user_del,api_user_add,api_user_update} from '@/api/user.js'
import { eventBus, EVENT_TYPES } from '@/utils/eventBus'
import role_select from '@/components/role_select.vue'
import team_select from '@/components/team_select.vue'


// 状态管理
const state = reactive({
  name: '',    // 输入搜索名称
  tableData: [],         // 表格数据，初始化为空数组
  total: 0,        // 总数
  pagesize: 10,    // 每页条数
  totalpage: 1,   // 总页数
  page: 1,       // 当前页
  total_pages: 1,        // 总页
  drawer:false, 
  updatebutton_disable:true,
  addbutton_disable:true,
  addbutton_show:false,
  updatebutton_show:false,
})
const formData = reactive({
  id:null,
  username: '',
  role:'user',
  teamid:null,
  using:true,
  password:''
})


async function add_drawer(){
  state.addbutton_disable=false
  state.addbutton_show=true
  state.updatebutton_show=false
  formData.id=null
  formData.username=''
  formData.role='user'
  formData.teamid=null
  formData.using=true
  formData.password=''
  state.drawer=true
}

async function edit_drawer(row){
  state.updatebutton_disable=false
  state.addbutton_disable=true
  state.addbutton_show=false
  state.updatebutton_show=true
  formData.id=row.id
  formData.username=row.userName
  formData.role=row.role
  formData.teamid=row.teamId
  formData.password=row.password
  state.drawer=true
}



async function user_show() {
    const data = await api_user_show(state)
    state.tableData = data.data
    state.total = data.total
    state.pagesize = data.pagesize
    state.totalpage = data.totalPage
}

async function user_del(id){
    await api_user_del(id)
    await user_show()
    eventBus.emit(EVENT_TYPES.CLOSE_MESSAGEBOX)
}

async function user_update() {
    await api_user_update(formData)
    state.drawer = false
    await user_show()
}

async function user_add() {
    await api_user_add(formData)
    state.drawer = false
    await user_show()
}

// 生命周期钩子
onMounted(() => {
    user_show()
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