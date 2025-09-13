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
             @click="eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX,{type:'delete',message:'是否删除',action:()=>team_del()})"
           >删除小组</el-button>
         </div>

      </div>
        <el-table
          ref="tableRef"
          highlight-current-row
          @row-click="handleRowClick"
          :data="state.tableData"
          :default-sort="{ prop: 'date', order: 'descending' }"
          :style="{width:'calc(100vw - 205px)'}"
          row-class-name="normal-row"
          header-cell-class-name="normal-row-header"
        >
          <el-table-column prop="name" label="名字" sortable min-width="100" />
          <el-table-column prop="phone" label="电话" min-width="100" />
          <el-table-column prop="note" label="其他说明" min-width="350" />
        </el-table>
    </div>

    <el-drawer v-model="state.drawer" direction="rtl" size="30%" >
      <template #header>
      <span >检验小组</span>
    </template>
      <template #footer>
      <div style="flex: auto">
        <el-button  size="large" type="warning" v-show="state.updatebutton_show"   @click="team_update"  :disabled="state.updatebutton_disable" >修改</el-button>
        <el-button  size="large" type="success" v-show="state.addbutton_show"  @click="team_add"  :disabled="state.addbutton_disable">增加</el-button>
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
import { ref, onMounted, reactive, onUnmounted } from 'vue'
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
  drawer:false, 
  editbox_allowedit:false,
  updatebutton_disable:true,
  addbutton_disable:true,
  addbutton_show:false,
  updatebutton_show:false,
})

const formData = reactive({
  id:null,
  name: '',
  phone: '',
  note:'',
})

const tableRef=ref(null)

function handleRowClick(row, column, event) {
  if(formData.id===row.id){
  formData.id=null
  formData.name=''
    formData.phone=''
    formData.note=''
    tableRef.value.setCurrentRow(null)
  }
  else{
    formData.id=row.id
    formData.name=row.name
    formData.phone=row.phone
    formData.note=row.note
    tableRef.value.setCurrentRow(row)
  }
}


  async function add_drawer(){
  formData.id=null
  formData.name=''
  formData.phone=''
  formData.note=''
  tableRef.value.setCurrentRow(null)
  state.drawer=true
  state.updatebutton_disable=true
  state.addbutton_disable=true
  state.addbutton_show=true
  state.updatebutton_show=false
}

async function edit_drawer(){
  if(formData.id){
  state.updatebutton_disable=false
  state.addbutton_disable=true
  state.addbutton_show=false
  state.updatebutton_show=true
  state.drawer=true
  }
  else{
    eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX,{type:'error',message:'请选择要修改的记录'})
  }
}
async function team_show() {
    const data = await api_team_show(state)
    state.tableData = data.data
    state.total = data.total
    state.pagesize = data.pagesize
    state.totalpage = data.totalPage
}

async function team_del(){
  if(formData.id){
    await api_team_del(formData.id)
    await team_show()
    eventBus.emit(EVENT_TYPES.CLOSE_MESSAGEBOX)
  }
  else{
    eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX,{type:'error',message:'请选择要删除的记录'})
  }
}

async function team_update() {
    await api_team_update(formData)
    state.drawer = false
    await team_show()
}

async function team_add() {
    await api_team_add(formData)
    state.drawer = false
    await team_show()
}

function checkinput(){
  const validationRules = {
  // 定义必填字段数组，包含需要验证的字段名
  required: ['name']
}
// 使用some方法检查必填字段数组中是否存在无效字段
const hasEmptyField = validationRules.required.some(field => {
  const value = formData[field]
  return value == null || value === ''
})
// 更新按钮禁用状态   
state.updatebutton_disable = hasEmptyField
state.addbutton_disable = hasEmptyField
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




</style>