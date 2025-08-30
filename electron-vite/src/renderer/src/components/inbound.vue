<template>
    <div id="background" :style="null">
        <div id="background2">
            <span style=" position:absolute;width:150px;left:200px;top:20px;" >试剂</span>
            <div style=" position:absolute; width: 300px;left:250px;top:20px;">
                <reagentlot_select v-model="formData.reagentlot" @change="checkinput" />
            </div>

            <span style=" position:absolute;width:150px;left:650px;top:20px;" >注释</span>
            <el-input 
            style="position:absolute;width:200px;left:700px;top:20px;"
            v-model="formData.note" 
            placeholder="可填写注释" 
            />
            <span style=" position:absolute;width:150px;left:200px;top:60px;" >数量</span>
            <el-input-number 
                class="searchinput"  
                v-model="formData.number" 
                :min="1" 
                :max="9999" 
                placeholder="0" 
                @change="checkinput"
                style=" position:absolute;width:150px;left:250px;top:60px;" 
            />
            <el-button 
                type="success"  
                :disabled="formData.disablebutton" 
                @click="ready_inbound"
                style=" position:absolute;left:250px;top:100px;"
            >准备入库</el-button>
        </div>
        <el-table
            :data="formData.tableData"
            :default-sort="{ prop: 'date', order: 'descending' }"
            :style="{width:'calc(100vw - 210px)'}"
            row-class-name="rowstyle"
            header-cell-class-name="rowstyle"
            height="480"
        >
            <el-table-column prop="reagentname" label="试剂名字" min-width="150" show-overflow-tooltip/>
            <el-table-column prop="lot" label="批号" min-width="150" show-overflow-tooltip/>
            <el-table-column prop="number" label="数量" min-width="100" show-overflow-tooltip/>  
            <el-table-column prop="note" label="注释" min-width="100" show-overflow-tooltip/>
            <el-table-column label="操作" min-width="100" >
                <template #default="scope">
                    <el-button size="small" type="danger" @click="delete_inbound(scope.row.rowsid)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <button id="inbound" @click="inbound">
            <span>入库</span>
            <svg class="icon" fill="currentColor" aria-hidden="true">
                <use xlink:href="#icon-ruku"></use>
            </svg>
        </button>
        <svg id="barcode"></svg>
    </div>
</template>

<script setup>
import {  reactive} from 'vue'
import { api_operation_inbound } from '@/api/operation'
import reagentlot_select from './reagentlot_select.vue'
import { toRaw } from 'vue';
import { ElMessage } from 'element-plus'
import 'element-plus/dist/index.css'
import { h } from 'vue'
// 组件引用
// 使用reactive统一管理状态
const formData = reactive({
    number:1,//数量
    disablebutton: true, // 是否禁用按钮 默认禁用
    reagentlot: {reagentid:null,lotid:null,reagentname:null,lotname:null}, // 选择试剂批号下拉菜单对应的id
    tableData: [], // 表格数据  
})


async function ready_inbound() {
        formData.tableData.push({
        rowsid: formData.tableData.length + 1,
        reagentid: formData.reagentlot.reagentid,
        reagentname: formData.reagentlot.reagentname,
        lotid: formData.reagentlot.lotid,
        lot: formData.reagentlot.lotname,
        number: formData.number,
        note: formData.note,
    })
}

async function inbound() {
    let printdatalist=[]
    const data = await api_operation_inbound(formData.tableData)
    formData.tableData = []
    for (let i in data.message) {
        ElMessage({
            type: data.message[i].includes("库存不足") ? "warning" : "success",
            message: h('p', { style: 'line-height: 1; font-size: 25px' }, [
                h('span', null, data.message[i])
            ]),
        })
    }
    for (let i in data.data) {
        printdatalist.push(toRaw({
            reagentlot:{
                reagentname:data.data[i].reagentname,
                lotname:data.data[i].lotname
            },
            barcodeNumber:data.data[i].barcodeNumber
        }))
    }
    myapi.gotoprint(printdatalist)
}
function delete_inbound(rowsid) {
    formData.tableData = formData.tableData.filter(item => item.rowsid !== rowsid)
}









function checkinput(){
  // 检查必填字段
  const hasEmptyField = 
    !formData.reagentlot.reagentid || 
    !formData.reagentlot.lotid || 
    !formData.number
  
  // 更新按钮禁用状态   
  formData.disablebutton = hasEmptyField
}


</script>

<style scoped>

#background2{
height: 140px;

}
#inbound{
  position: absolute;
  top: 160px;
  left:245px;
  width: 200px;
  height: 50px;
  color: white;
  background-color: rgb(25, 153, 11);
  border-style: solid;
  border-width: 3px;
  border-color: white;
  font-family: SimHei;
  font-size: 30px;
  font-weight:700;
  transition: all 0.3s ease-in-out;
}
  #inbound:hover{
  color: rgb(25, 153, 11);
  background-color: rgb(255, 255, 255);
  border-style: solid;
  border-color: rgb(25, 153, 11);
}

.el-table{
  position: absolute;
  left: 200px;
  top: 250px;
}

.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill:currentColor;
  overflow: hidden;
}

</style>