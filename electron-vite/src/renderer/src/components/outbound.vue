<template>
<div id="background" :style="null">
  <div id="background2">
  <p id="title" style=" position:absolute; left:200px;top:0px;">快速出库</p>
  <el-input id="input_barcodenumber" v-model="formData.barcodenumber" style=" position:absolute;width: 700px;height:50px; left:200px;top:100px;font-size: 18px;" placeholder="快速录入唯一试剂条码号" @keyup.enter="operation_outbound"/>
  <button id="outbound" @click="operation_outbound">
        <span>出库</span>
        <svg class="icon" fill="currentColor" aria-hidden="true"> <use xlink:href="#icon-chuku"></use></svg>
  </button>
    <p id="title2" style=" position:absolute; left:200px;top:120px;">特殊出库</p>
    <span style=" position:absolute; left:200px;top:230px;"   >试剂</span>
    <div style=" position:absolute; width: 300px;left:250px;top:230px;">
        <el-select-v2  v-model="formData.reagentid" filterable :options="allreagentlist" placeholder="选择试剂" @change="checkinput"  style="width: 300px"  />
    </div>
    <span style=" position:absolute;left:200px;top:270px;" >批号</span>
    <div style=" position:absolute; width: 300px;left:250px;top:270px;">
        <el-select-v2  v-model="formData.lotid" filterable :options="alllotlist" placeholder="选择批号" @change="checkinput"  style="width: 300px"  />
    </div>

            <span  style=" position:absolute;left:620px;top:230px;" >数量</span>
            <el-input-number 
                class="searchinput"  
                v-model="formData.number" 
                :min="1" 
                :max="9999" 
                placeholder="0" 
                style="width:150px;position:absolute;left:670px;top:230px" 
                @change="checkinput"  
            />


            <span style=" position:absolute;width:150px;left:850px;top:230px; ">注释</span>
            <el-input 
            style="position:absolute;width:200px;left:900px;top:230px;"
            v-model="formData.note" 
            placeholder="可填写注释" 
            />
            <el-button 
                type="success"  
                :disabled="formData.editbox_disablebutton" 
                @click="ready_operation_special_outbound"
                style="position:absolute;left:250px;top:320px" 
            >准备特殊出库</el-button>
 
        </div>
        <el-table
            :data="formData.tableData"
            :default-sort="{ prop: 'date', order: 'descending' }"
            :style="{width:'calc(100vw - 210px)'}"
            row-class-name="normal-row"
            header-cell-class-name="normal-row-header"
            height="270"
        >

        <el-table-column prop="reagentname" label="试剂名字" min-width="300" show-overflow-tooltip/>
        <el-table-column prop="lot" label="批号" min-width="200" show-overflow-tooltip/>
        <el-table-column prop="number" label="数量" min-width="100" show-overflow-tooltip/>  
        <el-table-column prop="note" label="注释" min-width="100" show-overflow-tooltip/>
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
import {reactive,ref,onMounted} from 'vue'
import { api_operation_outbound,api_operation_special_outbound} from '../api/operation';
import { api_reagent_showall } from '@/api/reagent'
import { api_lot_showall } from '@/api/lot'

const allreagentlist = ref([])  
const alllotlist = ref([])





const formData = reactive({
    barcodenumber:'',
    number:1,//出库数量
    editbox_disablebutton: true, // 是否禁用按钮 默认禁用
    reagentid: null, // 选择试剂下拉菜单对应的id
    lotid: null, // 选择批号下拉菜单对应的id
    tableData: [], // 表格数据  

})



async function operation_outbound(){
    try {
        const data = await api_operation_outbound(formData)
        formData.barcodenumber = ""
        const msg = data.data?.message ?? ''
        const warningKeyWord = ["库存不足", "已经出库", "条码未进行入库"]
        ElMessage({
            type: warningKeyWord.some(item => msg.includes(item)) ? "warning" : "success",
            message: h('p', { style: 'line-height: 1; font-size: 25px' }, [
                h('span', null, msg)
            ]),
        })
    } catch (err) {
        ElMessage({
            type: "error",
            message: h('p', { style: 'line-height: 1; font-size: 25px' }, [
                h('span', null, err)
            ]),
        })
    }
}





 

function ready_operation_special_outbound(){
  formData.tableData.push({
        rowsid: formData.tableData.length + 1,
        reagentid: formData.reagentid,
        reagentname: allreagentlist.value.find(item => item.value === formData.reagentid)?.name,
        lotid: formData.lotid,
        lot: alllotlist.value.find(item => item.value === formData.lotid)?.name,
        number: formData.number,
        note: formData.note,
    })
}

async function operation_special_outbound(){
    const data = await api_operation_special_outbound(formData.tableData)
    formData.tableData = []
    const messages = data.data?.messages ?? []
    let message_type = "error"
    for (let i in messages) {
        if (messages[i].includes("库存不足")) {
            message_type = "error"
        } else if (messages[i].includes("库存达到警告线")) {
            message_type = "warning"
        } else if (messages[i].includes("库存更新成功")) {
            message_type = "success"
        }
        ElMessage({
            type: message_type,
            message: h('p', { style: 'line-height: 1; font-size: 25px' }, [
                h('span', null, messages[i])
            ]),
        })
    }
}

function delete_outbound(rowsid) {
    formData.tableData = formData.tableData.filter(item => item.rowsid !== rowsid)
}



async function checkinput(){
    if (formData.reagentid) {
        let data = await api_lot_showall(formData.reagentid)
        alllotlist.value = data.data.map(item => ({
            value: item.id,
            label: item.name,
            name: item.name
        }))
    }
    else {
        alllotlist.value = []
    }
    if (formData.reagentid && formData.lotid && formData.number) {
        formData.editbox_disablebutton = false
    }
    else {
        formData.editbox_disablebutton = true
    }
}

onMounted(async () => {
    let data = await api_reagent_showall()
    allreagentlist.value = data.data.map(item => ({
        value: item.id,
        label: item.name,
        name: item.name
    }))
})
</script>


<style scoped>

#background2{
  height: 380px;
}
#outbound {
    position: absolute;
    left:950px;
    top:100px;
    width: 200px;
    height: 50px;
    background-color: rgb(25, 153, 11);
    color: white;
    border-color: white;
    border-style: solid;
    border-width: 3px;
    transition: all 0.3s ease-in-out;
    border-radius: 15px; /* 设置圆角半径 */
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
  #title2{
    position: absolute;
    font-size: 40px;
    font-weight: 100;
    color: white;
    left:250px;
    top:200px;
  }

    #input_barcodenumber {
    position: absolute;
    top: 130px;
    left: 250px;
    font-weight: 100;
    font-size: large !important;
  }
  #response_message{
    position: absolute;
    top:300px;
    left:250px;
    font-size: larger;
    color:white;
    white-space: pre-line;
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
  top:400px;
}
#outbound2 {
    position: absolute;
    left:200px;
    top:680px;
    width: 200px;
    height: 50px;
    background-color: rgb(25, 153, 11);
    color: white;
    border-color: white;
    border-style: solid;
    border-width: 3px;
    transition: all 0.3s ease-in-out;
    border-radius: 15px; /* 设置圆角半径 */
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
