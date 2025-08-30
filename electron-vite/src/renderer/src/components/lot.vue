<template>
    <div id="background" :style="null">
        <div id="background2">
        <el-input 
            style="left:200px;top:10px;width:250px;" 
            v-model="state.name" 
            placeholder="搜索批号" 
            @input="lot_show" 
        />
        <el-pagination 
            background  
            layout="prev, pager, next"  
            v-model:current-page="state.page" 
            :page-count="state.totalpage" 
            @change="lot_show" 
            style="position: absolute;left: 200px;top: 50px; "
        />
        <div class="button-container">
            <el-button 
                type="success" 
                @click="add_drawer"
            >增加批号</el-button>
            <el-button 
                type="primary" 
                @click="edit_drawer"
            >修改批号</el-button>
            <el-button 
                type="danger" 
                @click="eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX,{type:'delete',message:'是否删除',action:()=>lot_del(formData.id)})"
            >删除批号</el-button>
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
            <el-table-column prop="name" label="批号" min-width="150" show-overflow-tooltip/>
            <el-table-column prop="expirationDate" label="有效期" min-width="150" :formatter="formatDateColumn" show-overflow-tooltip/>
            <el-table-column prop="reagentName" label="所属试剂名称" min-width="100" show-overflow-tooltip/>
        </el-table>
    </div>

    <el-drawer v-model="state.drawer" direction="rtl" size="30%" >
      <template #header>
      <span >批号管理</span>
    </template>
      <template #footer>
      <div style="flex: auto">
        <el-button  size="large" type="warning" v-show="state.updatebutton_show"   @click="lot_update"  :disabled="state.updatebutton_disable" >修改</el-button>
        <el-button  size="large" type="success" v-show="state.addbutton_show"  @click="lot_add"  :disabled="state.addbutton_disable">增加</el-button>
        <el-button  size="large" type="primary"  @click="state.drawer=false">关闭</el-button>
      </div>
    </template>
    <template #default>
        <div id="content1">
        <p>批号数字</p>  
        <el-input v-model="formData.name" @input="checkinput" style="width: 300px" placeholder="输入批号"  />
        <p>批号有效期</p>  
        <el-config-provider :locale=zhCn> 
          <el-date-picker 
            v-model="formData.expirationdate" 
            type="date" 
            placeholder="选择日期" 
            size="default" 
            @change="checkinput"
            value-format="YYYY-MM-DD 23:59:59"
          />   
        </el-config-provider>
        <p>选择所属试剂</p>  
        <el-select-v2  v-model="formData.seletevalue" filterable :options="allreagentlist" placeholder="选择试剂" @change="checkinput"  :disabled="state.editbox_disable_selete" style="width: 240px"  />
        <p>所属试剂名字</p>  
        <el-input v-model="formData.reagentname" style="width: 300px"  disabled  />
      </div>
    </template>
    </el-drawer>




</template >
<script setup>
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import {api_lot_update,api_lot_add} from '@/api/lot'
import { ref, onMounted, reactive, onUnmounted } from 'vue'
import { api_lot_show,api_lot_del } from '@/api/lot'
import {api_reagent_showall} from '@/api/reagent'
import { eventBus, EVENT_TYPES } from '@/utils/eventBus'
import { format_YYYYMMDDHHmm_iso,formatDateColumn } from '@/utils/format'

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
  editbox_disable_selete:true
})

const formData = reactive({
  name: '',                    // 批号数字  
  expirationdate: null,      // 批号有效期
  reagentid: null,          // 所属试剂id
  seletevalue: null,         // 选择的试剂值
  id: null  ,           // 选中的批号id
  reagentname:'',
  reagentid:null
})

// 试剂列表数据
const allreagentlist = ref([])
const tableRef=ref(null)

function handleRowClick(row, column, event) {
  if(formData.id===row.id){
    tableRef.value.setCurrentRow(null)
    formData.id=null
    formData.name=''
    formData.expirationdate=null
    formData.reagentid=null
    formData.reagentname=''
    formData.seletevalue=null
  }
  else{
    formData.id=row.id
    formData.name=row.name
    formData.expirationdate=row.expirationDate
    formData.reagentid=row.reagentId
    formData.reagentname=row.reagentName
    formData.seletevalue=null
    tableRef.value.setCurrentRow(row)
  }
}




async function add_drawer(){
  tableRef.value.setCurrentRow(null)
  state.addbutton_disable=true
  state.addbutton_show=true
  state.updatebutton_show=false
  state.editbox_disable_selete=false
  formData.id=null
  formData.name=''
  formData.expirationdate=null
  formData.reagentid=null
  formData.reagentname=''
  formData.seletevalue=null,
  state.drawer=true

}

async function edit_drawer(){
  if(formData.id){
  state.updatebutton_disable=true
  state.addbutton_disable=true
  state.addbutton_show=false
  state.updatebutton_show=true
  state.editbox_disable_selete=true
  checkinput()
  state.drawer=true
  }
  else{
    eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX,{type:'error',message:'请选择要修改的记录'})
  }
}


function checkinput(){
  // 如果选择了试剂，更新formdata中的选择的试剂对应的id
  if (formData.seletevalue != null) {
    formData.reagentid = allreagentlist.value[formData.seletevalue].id
  }
  const validationRules = {
  required: ['name', 'expirationdate', 'reagentid']
}

  // 检查必填字段


  const hasEmptyField = validationRules.required.some(field => {
    const value = formData[field]
    return value == null || value === ''
  })
  state.addbutton_disable=hasEmptyField
  state.updatebutton_disable=hasEmptyField
}



 async function lot_show() {
    const data = await api_lot_show(state)
    state.tableData = data.data
    state.totalpage = data.totalPage
}
async function lot_del(){
  if(formData.id){
    await api_lot_del(formData.id)
    eventBus.emit(EVENT_TYPES.CLOSE_MESSAGEBOX)
    await lot_show()
  }
  else{
    eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX,{type:'error',message:'请选择要删除的记录'})
  }
}


async function lot_update(){
    formData.expirationdate = format_YYYYMMDDHHmm_iso(formData.expirationdate)
    await api_lot_update(formData)
    state.drawer = false
    await lot_show()
}

async function lot_add(){
    formData.expirationdate = format_YYYYMMDDHHmm_iso(formData.expirationdate)
    await api_lot_add(formData)
    state.drawer = false
    await lot_show()
}

async function list_allreagent(){
    const data = await api_reagent_showall()
    allreagentlist.value = []
    for (let i in data.data){
        allreagentlist.value.push({
            label: data.data[i].name,
            value: i,
            id: data.data[i].id,
        })
    }
}

// 生命周期钩子
onMounted(async () => {
  await list_allreagent()
  await lot_show()

})



</script>
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