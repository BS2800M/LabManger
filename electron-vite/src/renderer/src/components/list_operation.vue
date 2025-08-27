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
            <el-button 
                id="export"
                type="primary" 
                @click="operation_exporttoexcel_list"
                style="position:absolute;left:1000px;top:50px;"
            >
                导出记录(列表版)
            </el-button>
            <el-button 
                id="export"
                type="primary" 
                @click="operation_exporttoexcel_info"
                style="position:absolute;left:800px;top:50px;"
            >
                导出记录(信息版)
            </el-button>
        </div>
        <el-table
            :data="tableData"
            :default-sort="{ prop: 'date', order: 'descending' }"
            :style="{width:'calc(100vw - 210px)'}"
            row-class-name="rowstyle"
            header-cell-class-name="rowstyle"
        >
            <el-table-column prop="createTime" label="时间" sortable min-width="150" :formatter="formatDateColumn" show-overflow-tooltip/>
            <el-table-column prop="reagentName" label="试剂名称" min-width="100" show-overflow-tooltip/>
            <el-table-column prop="lotName" label="批号" min-width="100" show-overflow-tooltip/>
            <el-table-column prop="action" label="动作" min-width="80" show-overflow-tooltip/>
            <el-table-column prop="barcodeNumber" label="条码号" min-width="100" show-overflow-tooltip/>
            <el-table-column prop="note" label="注释" min-width="80" show-overflow-tooltip/>
            <el-table-column prop="userName" label="用户" min-width="100" show-overflow-tooltip/>
            <el-table-column label="操作" min-width="200">
                <template #default="scope">
                    <el-button size="small" type="primary" @click="barcodeprint(scope.row)">补打条码</el-button>
                    <el-button size="small" type="primary" v-if="get_permission('operation_edit')" @click="edit_drawer(scope.row)">编辑</el-button>
                    <el-button size="small" type="danger" v-if="get_permission('operation_delete')" @click="eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX,{type:'delete',message:'是否删除',action:()=>operation_del(scope.row.id)})">删除</el-button>

                </template>
            </el-table-column>
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
        <el-input v-model="formData.action" @input="checkinput" style="width: 300px" placeholder="输入动作"  />
        <p>操作时间</p>  
        <el-config-provider :locale=zhCn> 
          <el-date-picker 
            v-model="formData.createTime" 
            type="date" 
            placeholder="选择注释" 
            size="default" 
            @change="checkinput"
            value-format="YYYY-MM-DD 23:59:59"
          />   
        </el-config-provider>
        <p>注释</p>  
        <el-input v-model="formData.note" @input="checkinput" style="width: 300px" placeholder="输入注释"  />
      </div>
    </template>
    </el-drawer>

</template>


<script setup>
  import reagentlot_select from './reagentlot_select.vue'
  import {ref,onMounted,reactive} from 'vue'
  import { ElConfigProvider } from 'element-plus'
  import zhCn from 'element-plus/es/locale/lang/zh-cn'
  import { api_operation_show,api_operation_del,api_operation_update } from '@/api/operation'
  import { toRaw } from 'vue';
  import {formatDateColumn,getnowtime,getnowtime_previousmonth} from '@/utils/format'
  import { eventBus, EVENT_TYPES } from '@/utils/eventBus'
  import {format_YYYYMMDDHHmm_iso} from '@/utils/format'
  import {operation_exporttoexcel_info,operation_exporttoexcel_list } from '@/utils/exportexcel.js'
  import get_permission from '@/utils/permission'
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
  })



  let tableData=ref(null)

  const formData=reactive({
    id:0,
    action:'',
    createTime:'',
    reagentlot:{reagentid:null,lotid:null,reagentname:null,lotname:null},
    note:''
  })



onMounted(() => {
    operation_show()
})


async function operation_show(){
    state.starttime = format_YYYYMMDDHHmm_iso(state.starttime_show)
    state.endtime = format_YYYYMMDDHHmm_iso(state.endtime_show)
    const data = await api_operation_show(state)
    tableData.value = data.data
    state.totalpage = data.totalPage
    state.page = data.page
}
  function barcodeprint(data){
    let printdatalist=[]
    printdatalist.push(toRaw(data))
    myapi.gotoprint(printdatalist)
  }      
  function edit_drawer(data){
    formData.id=data.id
    formData.action=data.action
    formData.createTime=data.createTime
    formData.reagentlot={reagentid:data.reagentId,lotid:data.lotId,reagentname:data.reagentName,lotname:data.lotName}
    formData.note=data.note
    state.drawer=true
    state.updatebutton_show=true
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
      createTime:format_YYYYMMDDHHmm_iso(formData.createTime),
      note:formData.note,
    }
    await api_operation_update(updateData)
    operation_show()
    state.drawer=false
  }
  async function operation_del(id){
    await api_operation_del(id)
    operation_show()
  }
  


</script>
  <style scoped>

#background2{
  height: 90px;
}
.el-table{
  position: absolute;
  left: 200px;
  top: 100px;
  background-color:rgb(53, 73, 94);
}


  </style>