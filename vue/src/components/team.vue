<template>
    <div
      id="background"
      class="team-page"
      v-loading="pageLoading"
      element-loading-text="正在加载小组数据..."
    >
      <section class="panel-section">
      <div class="panel-header">
        <h3>小组管理</h3>
      </div>
      <div id="background2" class="toolbar">
        <el-input 
          class="toolbar-input"
          v-model="state.name" 
          placeholder="搜索检验小组" 
          @input="team_show" 
        />
        <el-pagination 
          class="toolbar-pagination" 
          background  
          layout="prev, pager, next"  
          v-model:current-page="state.page" 
          :page-count="state.totalpage" 
          @change="team_show" 
        />
                 <div class="action-button-container">
           <el-button 
             id="add" 
             type="success" 
             @click="add_drawer"
           >增加小组</el-button>
           <el-button 
             id="update" 
             type="primary" 
             @click="edit_drawer"
           >修改小组</el-button> 
           <el-button 
             id="delete" 
             type="danger" 
             @click="showDeleteTeamConfirm"
           >删除小组</el-button>
         </div>

      </div>
      <div class="team-table">
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
      <span class="drawer-title">小组管理</span>
    </template>
      <template #footer>
      <div style="flex: auto">
        <el-button  size="large" type="warning" v-show="state.drawerMode === 'edit'"   @click="team_update"  :disabled="state.submitDisabled" >修改</el-button>
        <el-button  size="large" type="success" v-show="state.drawerMode === 'add'"  @click="team_add"  :disabled="state.submitDisabled">增加</el-button>
        <el-button  size="large" type="primary"  @click="state.drawer=false">关闭</el-button>
      </div>
    </template>
    <template #default>
      <div id="content1">
        <p>检验小组名称</p>  
        <el-input v-model="formData.name" @input="syncSubmitDisabled" style="width: 300px" placeholder="检验小组名称"  />
        <p>联系电话</p>  
        <el-input v-model="formData.phone" style="width: 300px" placeholder="填写电话"  />
      </div>
      <div id="content2">
        <p>其他说明</p>  
        <el-input v-model="formData.note" style="width: 300px" placeholder="" />
      </div>
    </template>
    </el-drawer>





</template>
<script setup>
import { onMounted, reactive } from 'vue'
import { api_team_show,api_team_del,api_team_update,api_team_add} from '@/api/team.js'
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
import { usePageLoading } from '@/utils/pageLoading'

// 状态管理
const state = reactive({
  name: '',    // 输入搜索名称
  tableData: [],         // 表格数据，初始化为空数组
  total: 0,        // 总数
  pagesize: 10,    // 每页条数
  totalpage: 1,   // 总页数
  page: 1,       // 当前页
  drawer: false,
  drawerMode: 'add',
  submitDisabled: true,
  selectedRowId: null,
})

const formData = reactive({
  id:null,
  name: '',
  phone: '',
  note:'',
  status: 0,
})

const REQUIRED_FIELDS = ['name']
const { pageLoading, withPageLoading } = usePageLoading()

const tableColumns = [
  { key: 'name', dataKey: 'name', title: '名字', width: 160, flexGrow: 1 },
  { key: 'phone', dataKey: 'phone', title: '电话', width: 160, flexGrow: 1 },
  { key: 'note', dataKey: 'note', title: '其他说明', width: 360, flexGrow: 1 },
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
    name: '',
    phone: '',
    note: '',
    status: 0,
  })
}

function fillFormDataFromRow(rowData) {
  Object.assign(formData, {
    id: rowData.id,
    name: rowData.name,
    phone: rowData.phone,
    note: rowData.note,
    status: rowData.status,
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
    title: '修改小组',
    emptyMessage: '请选择要修改的记录',
    onOpen: () => openDrawer('edit'),
  })
}

function showDeleteTeamConfirm() {
  showDeleteConfirmBySelection({
    selectedRowId: state.selectedRowId,
    title: '删除小组',
    emptyMessage: '请选择要删除的记录',
    confirmMessage: '是否删除该小组',
    onConfirm: () => team_del(),
  })
}
async function team_show() {
    return withPageLoading(async () => {
      const data = await api_team_show({
        name: state.name,
        page: state.page,
        pageSize: state.pagesize,
      })
      state.tableData = data.data
      state.total = data.meta.total
      state.pagesize = data.meta.pageSize
      state.totalpage = data.meta.totalPage
    })
}

async function team_del(){
  return withPageLoading(async () => {
    await deleteWithSelection({
      selectedRowId: state.selectedRowId,
      title: '删除小组',
      emptyMessage: '请选择要删除的记录',
      deleteAction: (id) => api_team_del(id),
      onAfterDelete: async () => {
        await team_show()
        state.selectedRowId = null
        resetFormData()
      },
    })
  })
}

async function team_update() {
    return withPageLoading(async () => {
      await api_team_update(formData)
      state.drawer = false
      await team_show()
      state.selectedRowId = null
      formData.id = null
    })
}

async function team_add() {
    return withPageLoading(async () => {
      await api_team_add(formData)
      state.drawer = false
      await team_show()
      state.selectedRowId = null
      formData.id = null
    })
}

// 生命周期钩子
onMounted(() => {
    team_show()
})


</script >
<style scoped>
.team-page {
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

.team-table {
  margin-top: 8px;
  flex: 1;
  min-height: 0;
}
</style>
