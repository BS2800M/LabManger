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
        <el-pagination 
          style=" position: absolute;left: 200px;top: 50px;"
          class="searchinput" 
          background  
          layout="prev, pager, next"  
          v-model:current-page="state.page" 
          :page-count="state.totalpage" 
          @change="team_show" 
        />
                 <div class="button-container">
           <el-button 
             id="add" 
             type="success" 
             v-if="get_permission('team_add')"
             @click="add_drawer"
           >增加小组</el-button>
           <el-button 
             id="update" 
             type="primary" 
             v-if="get_permission('team_edit')"
             @click="edit_drawer"
           >修改小组</el-button> 
           <el-button 
             id="delete" 
             type="danger" 
             v-if="get_permission('team_delete')"
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
    </div>

    <el-drawer v-model="state.drawer" direction="rtl" size="30%" >
      <template #header>
      <span >检验小组</span>
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
        <el-input v-model="formData.name" @input="checkinput" style="width: 300px" placeholder="检验小组名称"  />
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
import { eventBus, EVENT_TYPES } from '@/utils/eventBus'
import get_permission from '@/utils/permission'

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
const tableColumns = [
  { key: 'name', dataKey: 'name', title: '名字', width: 160, flexGrow: 1 },
  { key: 'phone', dataKey: 'phone', title: '电话', width: 160, flexGrow: 1 },
  { key: 'note', dataKey: 'note', title: '其他说明', width: 360, flexGrow: 1 },
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
  if(formData.id===rowData.id){
    state.selectedRowId = null
    resetFormData()
  }
  else{
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

function showDeleteTeamConfirm() {
  if (!formData.id) {
    eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX,{type:'info',title:'删除小组',message:'请选择要修改的记录'})
    return
  }
  eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX,{type:'confirm',title:'删除小组',message:'是否删除该小组',action:()=>team_del()})
}
async function team_show() {
    const data = await api_team_show(state)
    state.tableData = data.data
    state.total = data.meta.total
    state.pagesize = data.meta.pageSize
    state.totalpage = data.meta.totalPage
}

async function team_del(){
  if(formData.id){
    await api_team_del(formData.id)
    await team_show()
    eventBus.emit(EVENT_TYPES.CLOSE_MESSAGEBOX)
  }
  else{
    eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX,{type:'info',title:'删除小组',message:'请选择要修改的记录'})
  }
}

async function team_update() {
    await api_team_update(formData)
    state.drawer = false
    await team_show()
    state.selectedRowId = null
    formData.id=null
}

async function team_add() {
    await api_team_add(formData)
    state.drawer = false
    await team_show()
    state.selectedRowId = null
    formData.id = null
}

function checkinput(){
  syncSubmitDisabled()
}



// 生命周期钩子
onMounted(() => {
    team_show()
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
.button-container {
  position: absolute;
  left: 800px;
  top: 50px;
  display: flex;
  gap: 10px;
}

.team-table {
  height: 680px;
}




</style>

