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
             @click="eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX,{type:'delete',message:'是否删除',action:()=>user_del(formData.id)})"
           >删除用户</el-button>
         </div>

        
      </div>
        <el-table
          ref="tableRef"
          highlight-current-row
          @row-click="handleRowClick"
          :data="state.tableData"
          :default-sort="{ prop: 'date', order: 'descending' }"
          :style="{width:'calc(100vw - 205px)'}"
          row-class-name="rowstyle"
          header-cell-class-name="rowstyle"
        >
          <el-table-column prop="userName" label="用户名" sortable min-width="100" />
          <el-table-column prop="role" label="角色" min-width="100" :formatter="formatRole" />
          <el-table-column prop="teamName" label="团队" min-width="100" />
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
import {onMounted, reactive,ref } from 'vue'
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
  drawer:false, 
  updatebutton_disable:true,
  addbutton_disable:true,
  addbutton_show:false,
  updatebutton_show:false,
  
})
const formData = reactive({
  id:null,
  username: '',
  role:0,
  teamid:null,
  using:true,
  password:''
})

const tableRef=ref(null)

function handleRowClick(row, column, event) {
  // 检查是否点击的是当前已选中的行
  if (formData.id === row.id) {
    // 如果点击的是当前选中的行，则取消选中
    tableRef.value.setCurrentRow(null)
    formData.id = null
    formData.username = ''
    formData.role = 0
    formData.teamid = null
    formData.using = true
    formData.password = ''
  } else {
    // 选中新行时，更新 formData 的属性
    formData.id = row.id
    formData.username = row.userName
    formData.role = row.role
    formData.teamid = row.teamId
    formData.using = row.using
    formData.password = row.password

    // 手动设置当前行高亮
    tableRef.value.setCurrentRow(row)
  }
}


async function add_drawer(){
  formData.id=null
  formData.username=''
  formData.role=0
  formData.teamid=null
  formData.using=true
  formData.password=''
  tableRef.value.setCurrentRow(null)
  state.addbutton_disable=true
  state.addbutton_show=true
  state.updatebutton_show=false
  state.drawer=true
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

function checkinput(){

  const validationRules = {
  // 定义必填字段数组，包含需要验证的字段名
  required: ['username','teamid','role']
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

async function user_show() {
    const data = await api_user_show(state)
    state.tableData = data.data
    state.total = data.total
    state.pagesize = data.pagesize
    state.totalpage = data.totalPage
}

async function user_del(){
  if(formData.id){
    await api_user_del(formData.id)
    await user_show()
    eventBus.emit(EVENT_TYPES.CLOSE_MESSAGEBOX)
  }
  else{
    eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX,{type:'error',message:'请选择要删除的记录'})
  }
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

.button-container {
  position: absolute;
  left: 800px;
  top: 50px;
  display: flex;
  gap: 10px;
}

</style>