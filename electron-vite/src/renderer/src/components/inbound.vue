<template>
    <div id="background" :style="null">
        <div id="background2">
            <span style="position: absolute; left:200px;top:20px;">试剂</span>
            <el-select-v2 
                class="searchinput"      
                v-model="formData.reagent_selectvalue" 
                filterable 
                :options="formData.allreagentlist" 
                placeholder="选择试剂" 
                @change="select_reagentchange" 
                style=" position:absolute; width: 300px;left:250px;top:20px;"  
                :height="500" 
            />
            <span style="position:absolute; left:580px;top:20px;">批号</span>
            <el-select-v2 
                class="searchinput" 
                v-model="formData.lot_selectvalue" 
                filterable 
                :options="formData.alllotlist" 
                placeholder="选择批号" 
                @change="select_lotchange"  
                style="position:absolute; width:300px;left:620px;top:20px;" 
                :height="500"  
                ref="refInput" 
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
                :disabled="formData.editbox_disablebutton" 
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
            <el-table-column prop="reagentid" label="试剂id" sortable min-width="200" show-overflow-tooltip/>
            <el-table-column prop="reagentname" label="试剂名字" min-width="300" show-overflow-tooltip/>
            <el-table-column prop="lot" label="批号" min-width="200" show-overflow-tooltip/>
            <el-table-column prop="number" label="数量" min-width="100" show-overflow-tooltip/>  
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
        <messagebox ref="messageboxRef"></messagebox>
        <svg id="barcode"></svg>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import messagebox from '@/components/messagebox.vue'
import { api_operation_inbound } from '@/api/operation'
import { api_reagent_showall } from '@/api/reagent'
import { api_lot_showall } from '@/api/lot'
import { ElMessage } from 'element-plus'
import 'element-plus/dist/index.css'
import { h } from 'vue'
// 组件引用
const messageboxRef = ref()
function openmessagebox(a,b,c){
  messageboxRef.value.openmessagebox(a,b,c)
}
// 使用reactive统一管理状态
const formData = reactive({
    number: 1, // 出库数量
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

// 方法定义
function list_allreagent() {
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
            openmessagebox('error',err.response.data.msg,null)
        })
}

function list_alllot() {
    api_lot_showall(formData.reagentid)
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
            openmessagebox('error',err.response.data.msg,null)
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
        api_lot_showall({reagentid:formData.reagentid})
        .then(data => {
            formData.alllotlist = []
            for (let i in data.data.data) {
                formData.alllotlist.push({
                    label: data.data.data[i].name,
                    value: i,
                    id: data.data.data[i].id,
                })
            }
        })
        .catch(err => {
            openmessagebox('error',err.response.data.msg,null)
        })
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

function ready_inbound() {
    formData.tableData.push({
        rowsid: formData.tableData.length + 1,
        reagentid: formData.reagentid,
        reagentname: formData.allreagentlist[formData.reagent_selectvalue].label,
        lotid: formData.lotid,
        lot: formData.alllotlist[formData.lot_selectvalue].label,
        number: formData.number,

    })
}

function inbound() {
    api_operation_inbound(formData.tableData)
        .then(data => {   
            formData.tableData = []
    ElMessage({
        type: data.data.msg.includes("库存不足") ? "warning" : "success",
        message: h('p', { style: 'line-height: 1; font-size: 25px' }, [
        h('span', null, data.data.msg)]),
        })
        myapi.gotoprint(data.data.list)
        })
        .catch(err => {
            openmessagebox('error',err.response.data.msg,null)
        })
}

function delete_inbound(rowsid) {
    formData.tableData = formData.tableData.filter(item => item.rowsid !== rowsid)
}
// 生命周期钩子
onMounted(() => {
    list_allreagent()
})
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