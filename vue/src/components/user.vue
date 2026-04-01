<template>
    <div id="background" class="user-page">
      <section class="panel-section">
      <div class="panel-header">
        <h3>用户管理</h3>
      </div>
      <div id="background2" class="toolbar">
        <el-input 
          class="toolbar-input"
          v-model="state.name" 
          placeholder="搜索用户" 
          @input="user_show" 
        />
        <el-pagination 
          class="toolbar-pagination" 
          background  
          layout="prev, pager, next"  
          v-model:current-page="state.page" 
          :page-count="state.totalpage" 
          @change="user_show" 
        />
                 <div class="action-button-container">
           <el-button 
             id="add" 
             type="success" 
             @click="add_drawer"
           >增加用户</el-button>
           <el-button 
             id="update" 
             type="primary" 
             @click="edit_drawer"
           >修改用户</el-button>
           <el-button 
             id="delete" 
             type="danger" 
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
      </section>
    </div>

    <el-drawer v-model="state.drawer" direction="rtl" size="30%" @open="state.selectedRowId = null">
      <template #header>
      <span class="drawer-title">用户管理</span>
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
        <p>账号</p>
        <el-input v-model="formData.account" @input="syncSubmitDisabled" style="width: 300px" placeholder="账号" />
        <p>用户名</p>  
        <el-input v-model="formData.username"   @input="syncSubmitDisabled" style="width: 300px" placeholder="用户名"   />
        <p>检验者密码</p>  
        <el-input v-model="formData.checkerPassword" type="password" show-password @input="syncSubmitDisabled" style="width: 300px" placeholder="检验者密码" />
        <p>审核者密码</p>  
        <el-input v-model="formData.reviewerPassword" type="password" show-password @input="syncSubmitDisabled" style="width: 300px" placeholder="审核者密码" />
      </div>
      <div id="content2">
        <p>角色</p>  
        <role_select v-model="formData.role" style="width: 300px" placeholder="角色" />
        <p>团队</p>  
        <team_select v-model="formData.teamid" @change="syncSubmitDisabled" style="width: 300px" placeholder="团队" />
        <p>状态</p>
        <el-switch
          v-model="formData.status"
          :active-value="0"
          :inactive-value="1"
          active-text="启用"
          inactive-text="停用"
          @change="syncSubmitDisabled"
        />
      </div>
    </template>
    </el-drawer>

</template> 
<script setup>
import { onMounted, reactive } from 'vue'
import { api_user_show,api_user_del,api_user_add,api_user_update} from '@/api/user.js'
import role_select from '@/components/role_select.vue'
import team_select from '@/components/team_select.vue'
import { formatRole } from '@/utils/format'
import {
  syncSubmitDisabledByFields,
  toggleRowSelection,
  showDeleteConfirmBySelection,
  deleteWithSelection,
  openDrawerByMode,
  openAddDrawerFlow,
  tryOpenEditDrawerBySelection,
  resolveSelectableRowClass,
} from '@/utils/crud'

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
  account:'',
  username: '',
  role:0,
  teamid:null,
  status:0,
  checkerPassword:'',
  reviewerPassword:''
})

const REQUIRED_FIELDS = ['account', 'username', 'teamid', 'role', 'checkerPassword', 'reviewerPassword']
const tableColumns = [
  { key: 'account', dataKey: 'account', title: '账号', width: 170, flexGrow: 1 },
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
  return resolveSelectableRowClass({
    rowData,
    selectedRowId: state.selectedRowId,
    defaultClass: 'normal-row',
  })
}

function resetFormData() {
  Object.assign(formData, {
    id: null,
    account: '',
    username: '',
    role: 0,
    teamid: null,
    status: 0,
    checkerPassword: '',
    reviewerPassword: '',
  })
}

function fillFormDataFromRow(rowData) {
  Object.assign(formData, {
    id: rowData.id,
    account: rowData.account,
    username: rowData.userName,
    role: rowData.role,
    teamid: rowData.teamId,
    status: rowData.status,
    checkerPassword: '',
    reviewerPassword: '',
  })
}

function syncSubmitDisabled() {
  syncSubmitDisabledByFields({
    formData,
    requiredFields: REQUIRED_FIELDS,
    target: state,
    disabledKey: 'submitDisabled',
  })
}

function openDrawer(mode) {
  openDrawerByMode({
    state,
    mode,
    afterOpen: syncSubmitDisabled,
  })
}

function handleRowClick({ rowData }) {
  toggleRowSelection({
    rowData,
    isSameSelection: state.selectedRowId === rowData.id,
    setSelectedRowId: (value) => { state.selectedRowId = value },
    onSelect: fillFormDataFromRow,
    onDeselect: resetFormData,
  })
  syncSubmitDisabled()
}


async function add_drawer(){
  openAddDrawerFlow({
    setSelectedRowId: (value) => { state.selectedRowId = value },
    resetFormData,
    onOpen: () => openDrawer('add'),
  })
}

async function edit_drawer(){
  tryOpenEditDrawerBySelection({
    selectedRowId: state.selectedRowId,
    title: '修改用户',
    emptyMessage: '请选择要修改的记录',
    onOpen: () => openDrawer('edit'),
  })
}

function showDeleteUserConfirm() {
  showDeleteConfirmBySelection({
    selectedRowId: state.selectedRowId,
    title: '删除用户',
    emptyMessage: '请选择要删除的记录',
    confirmMessage: '是否删除该用户',
    onConfirm: () => user_del(),
  })
}

async function user_show() {
    const data = await api_user_show({
      name: state.name,
      page: state.page,
      pageSize: state.pagesize,
    })
    state.tableData = data.data
    state.total = data.meta.total
    state.pagesize = data.meta.pageSize
    state.totalpage = data.meta.totalPage
}

async function user_del(){
  await deleteWithSelection({
    selectedRowId: state.selectedRowId,
    title: '删除用户',
    emptyMessage: '请选择要删除的记录',
    deleteAction: (id) => api_user_del(id),
    onAfterDelete: async () => {
      await user_show()
      state.selectedRowId = null
      resetFormData()
    },
  })
}

async function user_update() {
    await api_user_update({
      id: formData.id,
      account: formData.account,
      userName: formData.username,
      checkerPassWord: formData.checkerPassword,
      reviewerPassWord: formData.reviewerPassword,
      role: formData.role,
      teamId: formData.teamid,
      status: formData.status,
    })
    state.drawer = false
    await user_show()
    state.selectedRowId = null
    formData.id=null
}

async function user_add() {
    await api_user_add({
      account: formData.account,
      userName: formData.username,
      checkerPassWord: formData.checkerPassword,
      reviewerPassWord: formData.reviewerPassword,
      role: formData.role,
      teamId: formData.teamid,
      status: formData.status,
    })
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
.user-page {
  height: calc(100dvh - 82px);
  margin: 72px auto 0;
  padding: 8px 12px;
  max-width: 1900px;
  box-sizing: border-box;
}

.panel-section {
  height: 100%;
  border: 1px solid var(--el-border-color-light);
  border-radius: 10px;
  background: var(--el-bg-color-overlay);
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.panel-header h3 {
  margin: 0 0 6px 0;
  color: var(--el-text-color-primary);
  font-size: 22px;
  font-weight: 800;
}

.drawer-title {
  font-size: 24px;
  font-weight: 800;
  color: var(--el-text-color-primary);
}

.toolbar {
  min-height: 90px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.toolbar-input {
  width: 220px;
}

.toolbar-pagination {
  margin-right: auto;
}

.action-button-container {
  display: flex;
  gap: 10px;
}

.user-table {
  margin-top: 8px;
  flex: 1;
  min-height: 0;
}

</style>
