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
        <el-pagination 
         style=" position: absolute;left: 200px;top: 50px;"
          class="searchinput" 
          background  
          layout="prev, pager, next"  
          v-model:current-page="state.page" 
          :page-count="state.totalpage" 
          @change="user_show" 
        />
                 <div class="button-container">
           <el-button 
             id="add" 
             type="success" 
             v-if="get_permission('user_add')"
             @click="add_drawer"
           >增加用户</el-button>
           <el-button 
             id="update" 
             type="primary" 
             v-if="get_permission('user_edit')"
             @click="edit_drawer"
           >修改用户</el-button>
           <el-button 
             id="delete" 
             type="danger" 
             v-if="get_permission('user_delete')"
             @click="showDeleteUserConfirm"
           >删除用户</el-button>
         </div>

        
      </div>
      <div class="user-table">
        <el-auto-resizer>
          <template #default="{ width, height }">
            <el-table-v2
              :columns="tableColumns"
              :data="state.tableData"
              :width="width"
              :height="height"
              :row-height="36"
              :header-height="34"
              :row-class="({ rowData, rowIndex }) => getRowClass(rowData, rowIndex)"
              :row-event-handlers="{ onClick: handleRowClick }"
            />
          </template>
        </el-auto-resizer>
      </div>
    </div>

    <el-drawer v-model="state.drawer" direction="rtl" size="30%" >
      <template #header>
      <span >用户管理</span>
    </template>
      <template #footer>
      <div style="flex: auto">
        <el-button  size="large" type="warning" v-show="state.drawerMode === 'edit'"   @click="user_update"  :disabled="state.submitDisabled" >修改</el-button>
        <el-button  size="large" type="success" v-show="state.drawerMode === 'add'"  @click="user_add"  :disabled="state.submitDisabled">增加</el-button>
        <el-button  size="large" type="primary"  @click="state.drawer=false">关闭</el-button>
      </div>
    </template>
    <template #default>
      <div id="content1">
        <p>用户名</p>  
        <el-input v-model="formData.username"   @input="checkinput" style="width: 300px" placeholder="用户名"   />
        <p>密码</p>  
        <el-input v-model="formData.password" style="width: 300px" placeholder="密码" />
      </div>
      <div id="content2">
        <p>角色</p>  
        <role_select v-model="formData.role" style="width: 300px" placeholder="角色" />
        <p>团队</p>  
        <team_select v-model="formData.teamid" @change="checkinput" style="width: 300px" placeholder="团队" />
      </div>
    </template>
    </el-drawer>

</template> 
<script setup>
import { onMounted, reactive } from 'vue'
import { api_user_show,api_user_del,api_user_add,api_user_update} from '@/api/user.js'
import { eventBus, EVENT_TYPES } from '@/utils/eventBus'
import role_select from '@/components/role_select.vue'
import team_select from '@/components/team_select.vue'
import { formatRole } from '@/utils/format'
import get_permission from '@/utils/permission'

// 状态管理
const state = reactive({
  name: '',    // 输入搜索名称
  tableData: [],         // 表格数据，初始化为空数组
  total: 0,        // 总数
  pagesize: 10,    // 每页条数
  totalpage: 1,   // 总页数
  page: 1,       // 当前页
  total_pages: 1,        // 总页
  drawer: false,
  drawerMode: 'add',
  submitDisabled: true,
  selectedRowId: null,
})
const formData = reactive({
  id:null,
  username: '',
  role:0,
  teamid:null,
  using:true,
  password:''
})

const REQUIRED_FIELDS = ['username', 'teamid', 'role']
const tableColumns = [
  { key: 'userName', dataKey: 'userName', title: '用户名', width: 180, flexGrow: 1 },
  {
    key: 'role',
    dataKey: 'role',
    title: '角色',
    width: 120,
    flexGrow: 1,
    cellRenderer: ({ rowData }) => formatRole(rowData, null, rowData.role),
  },
  { key: 'teamName', dataKey: 'teamName', title: '团队', width: 160, flexGrow: 1 },
]

function getRowClass(rowData) {
  if (state.selectedRowId === rowData.id) {
    return 'normal-row current-row'
  }
  return 'normal-row'
}

function resetFormData() {
  Object.assign(formData, {
    id: null,
    username: '',
    role: 0,
    teamid: null,
    using: true,
    password: '',
  })
}

function fillFormDataFromRow(rowData) {
  Object.assign(formData, {
    id: rowData.id,
    username: rowData.userName,
    role: rowData.role,
    teamid: rowData.teamId,
    using: rowData.using,
    password: rowData.password,
  })
}

function syncSubmitDisabled() {
  const hasAllRequiredFields = REQUIRED_FIELDS.every((field) => {
    const value = formData[field]
    if (typeof value === 'string') {
      return value.trim() !== ''
    }
    return value != null
  })
  state.submitDisabled = !hasAllRequiredFields
}

function openDrawer(mode) {
  state.drawerMode = mode
  state.drawer = true
  syncSubmitDisabled()
}

function handleRowClick({ rowData }) {
  if (formData.id === rowData.id) {
    state.selectedRowId = null
    resetFormData()
  } else {
    state.selectedRowId = rowData.id
    fillFormDataFromRow(rowData)
  }
  syncSubmitDisabled()
}


async function add_drawer(){
  state.selectedRowId = null
  resetFormData()
  openDrawer('add')
}

async function edit_drawer(){
  if(formData.id){
    openDrawer('edit')
  }
  else{
    eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX,{type:'error',message:'请选择要修改的记录'})
  }
}

function showDeleteUserConfirm() {
  if (!formData.id) {
    eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX,{type:'info',title:'删除用户',message:'请选择要修改的记录'})
    return
  }
  eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX,{type:'confirm',title:'删除用户',message:'是否删除该用户',action:()=>user_del()})
}

function checkinput(){
  syncSubmitDisabled()
}

async function user_show() {
    const data = await api_user_show(state)
    state.tableData = data.data
    state.total = data.meta.total
    state.pagesize = data.meta.pageSize
    state.totalpage = data.meta.totalPage
}

async function user_del(){
  if(formData.id){
    await api_user_del(formData.id)
    await user_show()
    eventBus.emit(EVENT_TYPES.CLOSE_MESSAGEBOX)
  }
  else{
    eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX,{type:'info',title:'删除用户',message:'请选择要修改的记录'})
  }
}

async function user_update() {

    await api_user_update(formData)
    state.drawer = false
    await user_show()
    state.selectedRowId = null
    formData.id=null
}

async function user_add() {
    await api_user_add(formData)
    state.drawer = false
    await user_show()
    state.selectedRowId = null
    formData.id = null
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

.button-container {
  position: absolute;
  left: 800px;
  top: 50px;
  display: flex;
  gap: 10px;
}

.user-table {
  height: 680px;
}

</style>

