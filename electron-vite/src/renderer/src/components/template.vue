<template>
    <div id="background" >
      <div id="background2">
        <el-input 
          style="left:200px;top:10px;width:250px;" 
          v-model="state.name" 
          placeholder="搜索试剂名称" 
          @input="reagent_show" 
        />
        <el-button 
          id="add" 
          type="success" 
          @click="add_drawer"
          style=" position:absolute;left:1000px; top:50px;"
        >增加模板</el-button>
        <el-pagination 
          background  
          layout="prev, pager, next"  
          v-model:current-page="state.page" 
          :page-count="state.totalpage" 
          @change="reagent_show" 
          style="position: absolute;left: 200px;top: 50px;"
        />
      </div>
        <el-table
          :data="state.tableData"
          :default-sort="{ prop: 'date', order: 'descending' }"
          :style="{width:'calc(100vw - 205px)'}"
          row-class-name="rowstyle"
          header-cell-class-name="rowstyle"
        >
          <el-table-column prop="name" label="试剂名称" min-width="150" show-overflow-tooltip/>
          <el-table-column prop="specifications" label="规格" min-width="100" show-overflow-tooltip/>
          <el-table-column prop="manufacturer" label="生产厂家" min-width="100" show-overflow-tooltip/>
          <el-table-column prop="note" label="备注" min-width="100" show-overflow-tooltip/>
          <el-table-column label="操作" min-width="100">
            <template #default="scope">
              <el-button size="small" type="primary" @click="edit_drawer(scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX,{type:'delete',message:'是否删除',action:()=>reagent_del(scope.row.id)})">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
    </div>


    <el-drawer v-model="state.drawer" direction="rtl" size="60%" >
      <template #header>
      <span >试剂模板</span>
    </template>
      <template #footer>
      <div style="flex: auto">
        <el-button  size="large" type="warning" v-show="state.updatebutton_show"   @click="reagent_update"  :disabled="state.updatebutton_disable" >修改</el-button>
        <el-button  size="large" type="success" v-show="state.addbutton_show"  @click="reagent_add"  :disabled="state.addbutton_disable">增加</el-button>
        <el-button  size="large" type="primary"  @click="state.drawer=false">关闭</el-button>
      </div>
    </template>
    <template #default>
      <div id="content1">
        <p>试剂名称</p>  
        <el-input v-model="formData.name" style="width: 300px" placeholder="输入试剂的名称"  />
        <p>试剂规格</p>  
        <el-input v-model="formData.specifications" style="width: 300px" placeholder="如：盒 箱 瓶"  />
        <p>试剂的储存环境</p>  
        <el-input v-model="formData.storageCondition" style="width: 300px" placeholder="如：常温 冷藏 冷冻"  />
        <p>生产厂家</p>  
        <el-input v-model="formData.manufacturer" style="width: 300px" placeholder="如：厂家名称"  />
        <p>备注</p>  
        <el-input v-model="formData.note" style="width: 300px" placeholder="如：备注"  />
      </div>
      <div id="content2" style="position: absolute;left: 400px;top: 120px;">
        <p>预警数量</p>  
        <el-input-number v-model="formData.warnNumber" :min="0" :max="9999" placeholder="0" @change="checkinput" />
        <p>预警天数</p>  
        <el-input-number v-model="formData.warnDays" :min="0" :max="9999" placeholder="0" @change="checkinput" />
        <p>价格</p>  
        <el-input-number v-model="formData.price" :min="0" :max="99999999" placeholder="0" @change="checkinput"/>
        <p>创建时间</p>  
        <el-input disabled v-model="formData.createTime" style="width: 300px" placeholder="系统自动生成" />
        <p>生成初始批号</p>
        <el-switch v-model="formData.generateLot" :disabled="state.editbox_disablegeneratelot" size="large" @change="checkinput" />
      </div>
    </template>
    </el-drawer>



</template>
<script setup>
import {  onMounted, reactive } from 'vue'
import { api_reagent_show,api_reagent_del,api_reagent_update,api_reagent_add } from '@/api/reagent'
import { eventBus, EVENT_TYPES } from '@/utils/eventBus'
import { format_iso_YYYYMMDDHHmm } from '@/api/dateformat'

// 状态管理
const state = reactive({
  name: '',    // 输入搜索名称
  tableData: [],         // 表格数据，初始化为空数组
  page: 1,       // 当前页
  totalpage: 1,        // 总页
  drawer:false, 
  editbox_allowedit:false,
  updatebutton_disable:true,
  addbutton_disable:true,
  addbutton_show:false,
  updatebutton_show:false,
  editbox_disablegeneratelot:false,
})

const formData = reactive({
  name: '',
  specifications: '',
  storageCondition: '',
  manufacturer:'',
  warnNumber: 0,
  price: 0,
  createTime: '',
  id: null,
  warnDays: 0,
  generateLot: false,
  active:true,
  note:null,
  createTime:null
})


async function add_drawer(){
  state.drawer=true
  state.addbutton_disable=false
  state.addbutton_show=true
  state.updatebutton_show=false
  state.editbox_disablegeneratelot=false
  formData.name=""
  formData.specifications=""
  formData.storageCondition=""
  formData.manufacturer=""
  formData.warnNumber=0
  formData.price=0
  formData.warnDays=0
  formData.generateLot=true
  formData.note=""
  formData.createTime=null
  state.drawer=true

}

async function edit_drawer(row){
  state.updatebutton_disable=false
  state.addbutton_disable=true
  state.addbutton_show=false
  state.updatebutton_show=true
  state.editbox_disablegeneratelot=true
  formData.id=row.id
  formData.name=row.name
  formData.specifications=row.specifications
  formData.storageCondition=row.storageCondition
  formData.manufacturer=row.manufacturer
  formData.warnNumber=row.warnNumber
  formData.price=row.price
  formData.warnDays=row.warnDays
  formData.generateLot=row.generateLot
  formData.note=row.note
  formData.createTime= format_iso_YYYYMMDDHHmm(row.createTime)
  state.drawer=true
}

function checkinput() {
  const validationRules = {
  // 定义必填字段数组，包含需要验证的字段名
  required: ['name']
}
// 使用some方法检查必填字段数组中是否存在无效字段
const hasEmptyField = validationRules.required.some(field => {
  const value = formData[field]
  return value == null
})
// 更新按钮禁用状态   
state.updatebutton_disable = hasEmptyField
}


async function reagent_show() {
    const data = await api_reagent_show(state)
    state.tableData = data.data
    state.totalpage = data.totalPage
}
async function reagent_del(id){
  await api_reagent_del(id)
  await reagent_show()
  eventBus.emit(EVENT_TYPES.CLOSE_MESSAGEBOX)
}

async function reagent_update() {
  await api_reagent_update(formData)
  state.drawer = false
  await reagent_show()
}
async function reagent_add() {
  await api_reagent_add(formData)
  state.drawer = false
  await reagent_show()
}

// 生命周期钩子
onMounted(async () => {
    await reagent_show()
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


</style>










