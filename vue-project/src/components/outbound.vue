<template>
  <messagebox ref="to_messagebox" ></messagebox>
  <div id="background" :style="null">
  <p id="title">快速出库</p>
  <el-input v-model="barcodenumber" style="width: 700px;height:50px;" placeholder="快速录入唯一试剂条码号" @keyup.enter="outbound"/>
  <button id="outbound" @click="outbound"   >
        <span>出库</span>
        <svg class="icon" fill="currentColor" aria-hidden="true"> <use xlink:href="#icon-chuku"></use></svg>
  </button>

    <p id="title2">特殊出库</p>
    <div id="content2">
    <span class="contenttext">试剂</span>
            <el-select-v2 
                class="searchinput"      
                v-model="formData.edit_reagent_seletevalue" 
                filterable 
                :options="formData.allreagentlist" 
                placeholder="选择试剂" 
                @change="select_reagentchange" 
                style="width: 250px"  
                :height="400" 
            />
            <span class="contenttext">批号</span>
            <el-select-v2 
                class="searchinput" 
                v-model="formData.edit_lot_seletevalue" 
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
                v-model="formData.edit_number" 
                :min="1" 
                :max="9999" 
                placeholder="0" 
                @change="checkinput"  
            />
            <el-button 
                type="success"  
                :disabled="formData.editbox_disablebutton" 
                @click="special_outbound"
            >特殊出库</el-button>
          </div>
  </div>


</template>


<script setup>
import { ElMessage } from 'element-plus'
import 'element-plus/dist/index.css'
import { h } from 'vue'
import {ref,onMounted,reactive} from 'vue'
import messagebox from '@/components/messagebox.vue';
import { api_outbound ,api_special_outbound,api_list_alltemplate, api_list_alllot} from '../api/reagent_manger';

const to_messagebox=ref() //引入messagebox
function openmessagebox(a,b,c,d,e){
  messageboxRef.value.openmessagebox(a,b,c,d,e)
}
let barcodenumber=ref()
const formData = reactive({
    edit_number: 1, // 出库数量
    editbox_disablebutton: true, // 是否禁用按钮 默认禁用
    edit_reagent_seletevalue: null, // 选择试剂下拉菜单对应的绑定值
    edit_lot_seletevalue: null, // 选择批号下拉菜单对应的绑定值
    edit_reagent_id: null, // 选择试剂下拉菜单对应的id
    edit_lot_id: null, // 选择批号下拉菜单对应的id
    allreagentlist: [], // 包含获取的试剂id、试剂名称、地点、下拉菜单的label和绑定值
    alllotlist: [], // 包含获取的批号id、批号名称、下拉菜单的label和绑定值
    tableData: [], // 表格数据
    team:{teamid:localStorage.getItem('t_teamid'),selectid:localStorage.getItem('t_selectid')}
})
const validationRules = {
    required: ['edit_reagent_seletevalue', 'edit_lot_seletevalue', 'edit_number']
}
function outbound(){
  api_outbound(barcodenumber.value)
  .then(data=>{
    if (barcodenumber.value==""){
        ElMessage({
          message: h('p', { style: 'line-height: 1; font-size: 25px' }, [
          h('span', null, "请输入试剂条码号！")]),
        })
    }
    else{
        barcodenumber.value=""
        ElMessage({
          message: h('p', { style: 'line-height: 1; font-size: 25px' }, [
          h('span', null, data.data.msg)]),
        })
    }

  })
  

  .catch(err=>{
    openmessagebox('error',err,'close',null,null)
                })
}

function list_alltemplate() {
    api_list_alltemplate(formData.team.teamid)
        .then(data => {
            for (let i in data.data.list) {
                formData.allreagentlist.push({
                    label: data.data.list[i].name,
                    value: i,
                    id: data.data.list[i].id,
                    location: data.data.list[i].location
                })
            }
        })
        .catch(err => {
            messageboxRef.value.messagebox_warn(err)
        })
}

function list_alllot() {
    api_list_alllot(formData.edit_reagent_id)
        .then(data => {
            formData.alllotlist = [] // 每次触发时清空数组
            for (let i in data.data.list) {
                formData.alllotlist.push({
                    label: data.data.list[i].lot,
                    value: i,
                    id: data.data.list[i].id,
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
    if (formData.edit_reagent_seletevalue != null) {
        formData.edit_reagent_id = formData.allreagentlist[formData.edit_reagent_seletevalue].id
        list_alllot()
        checkinput()
        formData.edit_lot_seletevalue = null
}
}
function select_lotchange(){//当选择的批号发生改变时
    if (formData.edit_lot_seletevalue != null) {
            formData.edit_lot_id = formData.alllotlist[formData.edit_lot_seletevalue].id
        }
    checkinput()
}

function special_outbound(){
  api_special_outbound(formData.edit_number,formData.edit_reagent_id,formData.edit_lot_id).then(data=>{
    ElMessage({
          message: h('p', { style: 'line-height: 1; font-size: 25px' }, [
          h('span', null, data.data.msg)]),
        })
  })
  .catch(err=>{
    to_messagebox.value.messagebox_warn(err)
                })

}


onMounted(() => {
    list_alltemplate()
})
</script>


<style scoped>
#background{
position: absolute;
top: 0px;
left:0px;
background-color:rgb(44, 62, 80);
height: 100vh;
width:100vw;
z-index: 0;
}
  #outbound{
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
    width: 200px;
    height: 50px;
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
    top:350px;
  }
  #title2{
    position: absolute;
    font-size: 40px;
    font-weight: 100;
    color: white;
    left:250px;
    top:250px;
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


</style>
