<template>
  <messagebox ref="messageboxRef" ></messagebox>
<div id="background" :style="null">
  <p id="title">快速出库</p>
  <el-input v-model="formData.barcodenumber" style="width: 700px;height:50px;" placeholder="快速录入唯一试剂条码号" @keyup.enter="operation_outbound"/>
  <button id="outbound" @click="operation_outbound">
        <span>出库</span>
        <svg class="icon" fill="currentColor" aria-hidden="true"> <use xlink:href="#icon-chuku"></use></svg>
  </button>

    <p id="title2">特殊出库</p>
    <div id="content2">
    <span class="contenttext">试剂</span>
            <el-select-v2 
                class="searchinput"      
                v-model="formData.reagent_selectvalue" 
                filterable 
                :options="formData.allreagentlist" 
                placeholder="选择试剂" 
                @change="select_reagentchange" 
                style="width: 250px"  
                :height="300" 
            />
            <span class="contenttext">批号</span>
            <el-select-v2 
                class="searchinput" 
                v-model="formData.lot_selectvalue" 
                filterable 
                :options="formData.alllotlist" 
                placeholder="选择批号" 
                @change="select_lotchange"  
                style="width: 250px" 
                :height="400"  
                ref="refInput" 
            />
            <span class="contenttext">数量</span>
            <el-input-number 
                class="searchinput"  
                v-model="formData.number" 
                :min="1" 
                :max="9999" 
                placeholder="0" 
                @change="checkinput"  
            />
            <el-button 
                type="success"  
                :disabled="formData.editbox_disablebutton" 
                @click="ready_operation_special_outbound"
            >准备特殊出库</el-button>
          </div>
        <el-table
            :data="formData.tableData"
            :default-sort="{ prop: 'date', order: 'descending' }"
            :style="{width:'calc(100vw - 210px)'}"
            row-class-name="rowstyle"
            header-cell-class-name="rowstyle"
            height="320"
        >
        <el-table-column prop="reagentid" label="试剂id" sortable min-width="200" show-overflow-tooltip/>
        <el-table-column prop="reagentname" label="试剂名字" min-width="300" show-overflow-tooltip/>
        <el-table-column prop="lot" label="批号" min-width="200" show-overflow-tooltip/>
        <el-table-column prop="number" label="数量" min-width="100" show-overflow-tooltip/>  
        <el-table-column label="操作" min-width="100">
            <template #default="scope">
                <el-button size="small" type="danger" @click="delete_outbound(scope.row.rowsid)">删除</el-button>
            </template>
        </el-table-column>
        </el-table>


  <button id="outbound2" @click="operation_special_outbound">
        <span>出库</span>
        <svg class="icon" fill="currentColor" aria-hidden="true"> <use xlink:href="#icon-chuku"></use></svg>
  </button>
  </div>


</template>


<script setup>
import { ElMessage } from 'element-plus'
import { h } from 'vue'
import 'element-plus/dist/index.css'

import {ref,onMounted,reactive} from 'vue'
import messagebox from '@/components/messagebox.vue';
import { api_operation_outbound,api_operation_special_outbound} from '../api/operation';
import { api_reagent_showall } from '@/api/reagent'
import { api_lot_showall } from '@/api/lot'





const messageboxRef=ref() //引入messagebox
function openmessagebox(a,b,c){
  messageboxRef.value.openmessagebox(a,b,c)
}
const formData = reactive({
    barcodenumber:'',
    number:1,//出库数量
    editbox_disablebutton: true, // 是否禁用按钮 默认禁用
    reagent_selectvalue: null, // 选择试剂下拉菜单对应的绑定值
    lot_selectvalue: null, // 选择批号下拉菜单对应的绑定值
    reagentid: null, // 选择试剂下拉菜单对应的id
    lotid: null, // 选择批号下拉菜单对应的id
    allreagentlist: [], // 包含获取的试剂id、试剂名称、地点、下拉菜单的label和绑定值
    alllotlist: [], // 包含获取的批号id、批号名称、下拉菜单的label和绑定值
    tableData: [], // 表格数据  
})
const validationRules = {
    required: ['reagent_selectvalue', 'lot_selectvalue', 'number']
}
function operation_outbound(){
  api_operation_outbound(formData)
  .then(data=>{
        formData.barcodenumber=""
        const warningKeyWord=["库存不足","已经出库","条码不存在","已经出库"]
        ElMessage({
          type: warningKeyWord.some(item => data.data.msg.includes(item)) ? "warning" : "success",
          message: h('p', { style: 'line-height: 1; font-size: 25px' }, [
          h('span', null, data.data.msg)]),
        })
  })
  .catch(err=>{
    ElMessage({
        type: "error",
          message: h('p', { style: 'line-height: 1; font-size: 25px' }, [
          h('span', null, err)]),
        })

                })
}

function show_allreagent() {
    api_reagent_showall()
        .then(data => {
            for (let i in data.data.data) {
                formData.allreagentlist.push({
                    label: data.data.data[i].name,
                    value: i,
                    id: data.data.data[i].id,
                })
            }
        })
        .catch(err => {
            messageboxRef.value.messagebox_warn(err)
        })
}

function show_alllot() {
    api_lot_showall(formData)
        .then(data => {
            formData.alllotlist = [] // 每次触发时清空数组
            for (let i in data.data.data) {
                formData.alllotlist.push({
                    label: data.data.data[i].name,
                    value: i,
                    id: data.data.data[i].id,
                })
            }
        })
        .catch(err => {
            messageboxRef.value.messagebox_warn(err)
        })
}

function checkinput() {    // 检查必填字段

const hasEmptyField = validationRules.required.some(field => {
    const value = formData[field]
    return value === null || value === undefined
})
formData.editbox_disablebutton = hasEmptyField
}
function select_reagentchange(){ //当选择的试剂发生改变时
    if (formData.reagent_selectvalue != null) {
        formData.reagentid = formData.allreagentlist[formData.reagent_selectvalue].id
        show_alllot()
        checkinput()
        formData.lot_selectvalue = null
}
}
function select_lotchange(){//当选择的批号发生改变时
    if (formData.lot_selectvalue != null) {
            formData.lotid = formData.alllotlist[formData.lot_selectvalue].id
        }
    checkinput()
}

function ready_operation_special_outbound(){
  formData.tableData.push({
    rowsid:formData.tableData.length + 1,
    reagentid:formData.reagentid,
    reagentname:formData.allreagentlist[formData.reagent_selectvalue].label,
    lotid:formData.lotid,
    lot:formData.alllotlist[formData.lot_selectvalue].label,
    number:formData.number,
  })  
}

function operation_special_outbound(){
  api_operation_special_outbound(formData.tableData)
  .then(data=>{
    formData.tableData = []
    ElMessage({
      type: data.data.msg.includes("库存不足") ? "warning" : "success",
      message: h('p', { style: 'line-height: 1; font-size: 25px' }, [
      h('span', null, data.data.msg)]),
    })
  })
  .catch(err=>{
    openmessagebox('error',err.message,null)
  })
}

function delete_outbound(rowsid) {
    formData.tableData = formData.tableData.filter(item => item.rowsid !== rowsid)
}


onMounted(() => {
    show_allreagent()
})
</script>


<style scoped>
#background{
position: absolute;
top: 0px;
left:0px;
background-color:rgb(30, 42, 54);
height: 100vh;
width:100vw;
z-index: 0;
}
#outbound {
    position: absolute;
    left:250px;
    top:190px;
    width: 200px;
    height: 50px;
    background-color: rgb(25, 153, 11);
    color: white;
    border-color: white;
    border-style: solid;
    border-width: 3px;
    transition: all 0.3s ease-in-out;
  }
  #outbound:hover{
    position: absolute;
    background-color: rgb(255, 255, 255);;
    color: rgb(25, 153, 11);
    border-color: rgb(25, 153, 11);
    border-style: solid;
    border-width: 3px;
  }
  #outbound span {
    font-weight: 700;
    font-size: 20px;
  }
  #title{
    position: absolute;
    top: 30px;
    left: 250px;
    font-size: 40px;
    font-weight: 100;
    color: white;
  }
  .el-input{
    position: absolute;
    top: 130px;
    left: 250px;
    font-weight: 100;
    font-size: large;
  }
  #response_message{
    position: absolute;
    top:300px;
    left:250px;
    font-size: larger;
    color:white;
    white-space: pre-line;
  }
  #content2{
    position: absolute;
    left:250px;
    top:300px;
  }
  #title2{
    position: absolute;
    font-size: 40px;
    font-weight: 100;
    color: white;
    left:250px;
    top:200px;
  }
  .contenttext{
    color: white;
    font-size: 20px;
  }

  .icon {
  width: 2em;
  height: 2em;
  vertical-align: -0.15em;
  fill:currentColor;
  overflow: hidden;
}
.el-table{
  position: absolute;
  left:200px;
  top:350px;
  background-color: rgb(30, 42, 54);
}
:deep(.el-table .rowstyle)
{
  color: rgb(255, 255, 255);
  background-color:rgb(30, 42, 54);
}
:deep(.el-table .rowstyle:hover)
{
  color: rgb(30, 42, 54);
  background-color: rgb(255, 255, 255);
}

#outbound2 {
    position: absolute;
    left:250px;
    top:700px;
    width: 200px;
    height: 50px;
    background-color: rgb(25, 153, 11);
    color: white;
    border-color: white;
    border-style: solid;
    border-width: 3px;
    transition: all 0.3s ease-in-out;
  }
  #outbound2:hover{
    position: absolute;
    background-color: rgb(255, 255, 255);;
    color: rgb(25, 153, 11);
    border-color: rgb(25, 153, 11);
    border-style: solid;
    border-width: 3px;
  }
  #outbound2 span {
    font-weight: 700;
    font-size: 20px;
  }


</style>
