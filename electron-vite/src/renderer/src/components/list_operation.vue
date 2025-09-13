<template>
    <div id="background" :style="null">
        <div id="background2">
            <el-input 
                style="left:200px;top:10px;width:250px;" 
                v-model="state.reagentName" 
                placeholder="试剂名称" 
                @input="operation_show" 
                
            />
            <el-input 
                style="left:210px;top:10px;width:250px;" 
                v-model="state.barcodeNumber" 
                placeholder="条码号" 
                @input="operation_show" 
            />
            <el-config-provider :locale="zhCn">
                <el-date-picker 
                    v-model="state.starttime_show" 
                    style="left:220px;top:10px;width:150px;" 
                    type="date"
                    placeholder="选择开始日期" 
                    size="default" 
                    @change="operation_show" 
                    value-format="YYYY-MM-DD 00:00:01"
                />
            </el-config-provider>
            <el-config-provider :locale="zhCn">
                <el-date-picker 
                    v-model="state.endtime_show" 
                    style="left:230px;top:10px;width:150px;" 
                    type="date"
                    placeholder="选择结束日期" 
                    size="default" 
                    @change="operation_show" 
                    value-format="YYYY-MM-DD 23:59:59"
                />
            </el-config-provider>
            <el-pagination 
                background 
                layout="prev, pager, next"  
                v-model:current-page="state.page" 
                :page-count="state.totalpage" 
                @change="operation_show" 
                style= " position:absolute;left:200px;top:50px;"
            />
            <div class="export-button-container">
                <el-button 
                    id="export"
                    type="primary" 
                    @click="operation_exporttoexcel_list"
                >
                    导出记录(列表版)
                </el-button>
                <el-button 
                    id="export"
                    type="primary" 
                    @click="operation_exporttoexcel_info"
                >
                    导出记录(信息版)
                </el-button>
                <el-button 
                     id="barcodeprint"
                     type="primary" 
                     @click="barcodeprint()"
                 >
                     补打条码
                 </el-button>

            </div>
                         <div class="button-container">
                 <el-button 
                     v-if="get_permission('operation_edit')"
                     id="edit"
                     type="primary" 
                     @click="edit_drawer"
                 >
                     编辑记录
                 </el-button>
                 <el-button 
                     v-if="get_permission('operation_delete')"
                     id="delete"
                     type="danger" 
                     @click="eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX,{type:'delete',message:'是否删除',action:()=>operation_del()})"
                 >
                     删除记录
                 </el-button>
                 <el-button 
                     v-if="get_permission('operation_delete')"
                     id="delete"
                     type="danger" 
                     @click="batch_delete"
                 >
                     批量删除
                 </el-button>
             </div>
        </div>
              <el-table
              ref="tableRef"
              :data="state.tableData"
              :default-sort="{ prop: 'date', order: 'descending' }"
              :style="{width:'calc(100vw - 210px)'}"
              row-class-name="normal-row"
              header-cell-class-name="normal-row-header"
              highlight-current-row
              @row-click="handleRowClick"
          > 
            <el-table-column prop="id" label="操作ID" min-width="70" show-overflow-tooltip/>
            <el-table-column prop="createTime" label="时间" sortable min-width="150" :formatter="formatDateColumn" show-overflow-tooltip/>
            <el-table-column prop="reagentName" label="试剂名称" min-width="100" show-overflow-tooltip/>
            <el-table-column prop="lotName" label="批号" min-width="100" show-overflow-tooltip/>
            <el-table-column prop="action" label="动作" min-width="80" show-overflow-tooltip :formatter="format_operation_action"/>
            <el-table-column prop="barcodeNumber" label="条码号" min-width="80" show-overflow-tooltip/>
            <el-table-column prop="note" label="注释" min-width="80" show-overflow-tooltip/>
            <el-table-column prop="userName" label="用户" min-width="100" show-overflow-tooltip/>
        </el-table>
    </div>
      
    <el-drawer v-model="state.drawer" direction="rtl" size="50%" >
      <template #header>
      <span >修改操作</span>
    </template>
      <template #footer>
      <div style="flex: auto">
        <el-button  size="large" type="warning" v-show="state.updatebutton_show"   @click="operation_update"  :disabled="state.updatebutton_disable" >修改</el-button>
        <el-button  size="large" type="primary"  @click="state.drawer=false">关闭</el-button>
      </div>
    </template>
    <template #default>
        <div id="content1">
        <p>选择所属试剂</p> 
        <reagentlot_select v-model="formData.reagentlot"  @change="checkinput" /> 
        <p>动作</p>  
        <action_select v-model="formData.action" @input="checkinput" style="width: 300px" placeholder="输入动作"  />
        <p>操作时间</p>  
        <el-config-provider :locale=zhCn> 
          <el-date-picker 
            v-model="formData.createTime" 
            type="datetime"
            placeholder="选择操作时间" 
            size="default" 
            @change="checkinput"
            value-format="YYYY-MM-DD HH:mm:ss"
          />   
        </el-config-provider>
        <p>条码号</p>
        <el-input v-model="formData.barcodeNumber" @input="checkinput" style="width: 300px" placeholder="输入条码号"  />
        <p>注释</p>  
        <el-input v-model="formData.note" @input="checkinput" style="width: 300px" placeholder="输入注释"  />
      </div>
    </template>
    </el-drawer>

    <el-drawer v-model="state.batch_delete_drawer" direction="rtl" size="30%" >
      <template #header>
      <span >批量删除</span>
    </template>
      <template #footer>
      <div style="flex: auto">
        <el-button  size="large" type="warning":loading="state.batch_delete_loading"  @click="operation_batch_delete" :disabled="state.delete_startid==null || state.delete_endid==null" >{{state.batch_delete_button_text}}</el-button>
        <el-button  size="large" type="primary"  @click="state.batch_delete_drawer=false">关闭</el-button>
      </div>
    </template>
    <template #default>
        <div id="content1">
        <p>开始id</p> 
        <el-input v-model="state.delete_startid" style="width: 300px" placeholder="输入开始id"  />
        <p>结束id</p> 
        <el-input v-model="state.delete_endid" style="width: 300px" placeholder="输入结束id"  />
      </div>
    </template>
    </el-drawer>

</template>


<script setup>
  import reagentlot_select from './reagentlot_select.vue'
  import action_select from './action_select.vue'
  import {ref,onMounted,reactive} from 'vue'
  import { ElConfigProvider } from 'element-plus'
  import zhCn from 'element-plus/es/locale/lang/zh-cn'
  import { api_operation_show,api_operation_del,api_operation_update } from '@/api/operation'
  import { toRaw } from 'vue';
  import {formatDateColumn,getnowtime,getnowtime_previousmonth,format_operation_action} from '@/utils/format'
  import { eventBus, EVENT_TYPES } from '@/utils/eventBus'
  import {format_YYYYMMDDHHmm_iso} from '@/utils/format'
  import {operation_exporttoexcel_info,operation_exporttoexcel_list } from '@/utils/exportexcel.js'
  import get_permission from '@/utils/permission'
  import reagentlot_select_test from './reagentlot_select_test.vue'
  // 状态管理
  const state = reactive({
    reagentName: '',    // 输入搜索名称
    barcodeNumber: '' ,    // 条码号
    starttime: "",  // 搜索开始时间(iso)
    endtime: "",    // 搜索结束时间(iso)
    page: 1,       // 当前页
    totalpage: 1,        // 总页
    pagesize:13,
    starttime_show:getnowtime_previousmonth(),
    endtime_show:getnowtime(),
    drawer:false,
    updatebutton_show:false,
    updatebutton_disable:false,
    tableData:null,
    batch_delete_drawer:false,
    delete_startid:null,
    delete_endid:null,
    batch_delete_loading:false,
    batch_delete_button_text:'批量删除'
  })

let formData=reactive({
    id:null,
    action:'',
    createTime:'',
    reagentlot:{reagentid:null,lotid:null,reagentname:null,lotname:null},
    note:'',
    barcodeNumber:''
  })
const tableRef=ref(null)

function handleRowClick(row, column, event) {
  // 检查是否点击的是当前已选中的行
  if (formData.id === row.id) {
    // 如果点击的是当前选中的行，则取消选中
    tableRef.value.setCurrentRow(null)
    formData.id = null
    formData.action = ''
    formData.createTime = ''
    formData.reagentlot = {reagentid: null, lotid: null, reagentname: null, lotname: null}
    formData.note = ''
    formData.barcodeNumber = ''
  } else {
    // 选中新行时，更新 formData 的属性
    formData.id = row.id
    formData.action = row.action
    formData.createTime = row.createTime
    formData.reagentlot = {reagentid: row.reagentId, lotid: row.lotId, reagentname: row.reagentName, lotname: row.lotName}
    formData.note = row.note
    formData.barcodeNumber = row.barcodeNumber

    // 手动设置当前行高亮
    tableRef.value.setCurrentRow(row)
  }
}









async function operation_show(){
    state.starttime = format_YYYYMMDDHHmm_iso(state.starttime_show)
    state.endtime = format_YYYYMMDDHHmm_iso(state.endtime_show)
    const data = await api_operation_show(state)
    state.tableData = data.data
    state.totalpage = data.totalPage
    state.page = data.page
}
  function barcodeprint(){
      let printdatalist=[]
      printdatalist.push(toRaw(formData))
      myapi.gotoprint(printdatalist)
  }      
  function edit_drawer(){
    if(formData.id){
      state.drawer=true
      state.updatebutton_show=true
    }
    else{
      eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX,{type:'error',message:'请选择要修改的记录'})
    }
  }
  function batch_delete(){
    state.batch_delete_drawer=true
    state.delete_startid=null
    state.delete_endid=null
    state.batch_delete_button_text='批量删除'
  }
  async function operation_batch_delete(){ 
    try
    {
      state.batch_delete_loading=true
      const startId = parseInt(state.delete_startid)
      const endId = parseInt(state.delete_endid)
      for(let i=startId;i<=endId;i++){
          await api_operation_del(i)
          state.batch_delete_button_text='删除中('+i+'/'+endId+')'

      }
      operation_show()
      state.batch_delete_loading=false
      state.batch_delete_drawer=false

    }
    catch(error){
      state.batch_delete_loading=false
      eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX,{type:'error',message:'批量删除失败'})
    }
  }

  function checkinput(){
    const hasEmptyField=
    !formData.reagentlot.reagentid ||
    !formData.reagentlot.lotid ||
    !formData.createTime 
    state.updatebutton_disable=hasEmptyField
  }
  async function operation_update(){
    let updateData={
      id:formData.id,
      reagentid:formData.reagentlot.reagentid,
      lotid:formData.reagentlot.lotid,
      action:formData.action,
      createtime:format_YYYYMMDDHHmm_iso(formData.createTime),
      note:formData.note,
      barcodenumber:formData.barcodeNumber
    }
    await api_operation_update(updateData)
    operation_show()
    state.drawer=false
  }
  async function operation_del(){
    if(formData.id){
    await api_operation_del(formData.id)
    operation_show()
    eventBus.emit(EVENT_TYPES.CLOSE_MESSAGEBOX)
    }
    else{
      eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX,{type:'error',message:'请选择要删除的记录'})
    }
  }
  
  onMounted(() => {
    operation_show()
})


</script>
  <style scoped>

#background2{
  height: 140px;
}
.el-table{
  position: absolute;
  left: 200px;
  top: 150px;
  background-color:rgb(53, 73, 94);
}

.button-container {
  position: absolute;
  left: 700px;
  top: 50px;
  display: flex;
  gap: 10px;
}

.export-button-container {
  position: absolute;
  left: 200px;
  top: 90px;
  display: flex;
  gap: 10px;
}


  </style>