<template>
    <div id="background" :style="null">
        <div id="background2">
            <span style=" position:absolute;width:150px;left:200px;top:20px;" >试剂</span>
            <div style=" position:absolute; width: 300px;left:250px;top:20px;">
            <el-tree-select
            v-model="tree.select"
            lazy
            style="width: 350px;"
            :load="load_tree"
            :props="tree.props" 
            @change="get_id"
            filterable
            placeholder="搜索试剂名称"
        />
            </div>
            <span style=" position:absolute;width:150px;left:200px;top:60px;" >数量</span>
            <el-input-number 
                class="searchinput"  
                v-model="formData.number" 
                :min="1" 
                :max="9999" 
                placeholder="0" 
                @change="get_id"
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
            <el-table-column prop="reagentid" label="试剂id" sortable min-width="150" show-overflow-tooltip/>
            <el-table-column prop="reagentname" label="试剂名字" min-width="200" show-overflow-tooltip/>
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
        <svg id="barcode"></svg>
    </div>
</template>

<script setup>
import {  reactive,} from 'vue'
import { api_operation_inbound } from '@/api/operation'
import { api_reagent_showall} from '@/api/reagent'
import { api_lot_showall} from '@/api/lot'
import { ElMessage } from 'element-plus'
import 'element-plus/dist/index.css'
import { h } from 'vue'
// 组件引用
// 使用reactive统一管理状态
const formData = reactive({
    number: 1, // 出库数量
    editbox_disablebutton: true, // 是否禁用按钮 默认禁用
    lot_selectvalue: null, // 选择批号下拉菜单对应的绑定值
    reagentid: null, // 选择试剂下拉菜单对应的id
    lotid: null, // 选择批号下拉菜单对应的id
    reagentname:null,
    lot:null,
    tableData: [], // 表格数据
})


let tree=reactive({
    props : {
    label: 'label',
    children: 'children',
    isLeaf: 'isLeaf',
    },
    searchname:undefined,
    select:null,
    value:0,
    bufferdata:[]
})


function ready_inbound() {
        formData.tableData.push({
        rowsid: formData.tableData.length + 1,
        reagentid: formData.reagentid,
        reagentname: formData.reagentname,
        lotid: formData.lotid,
        lot: formData.lot,
        number: formData.number,
    })
}

function inbound() {
    api_operation_inbound(formData.tableData)
        .then(data => {   
            formData.tableData = []
    ElMessage({
        type: data.msg.includes("库存不足") ? "warning" : "success",
        message: h('p', { style: 'line-height: 1; font-size: 25px' }, [
        h('span', null, data.msg)]),
        })
        myapi.gotoprint(data.list)
        })

}
function delete_inbound(rowsid) {
    formData.tableData = formData.tableData.filter(item => item.rowsid !== rowsid)
}




function load_tree(node, resolve){

    if (node.level===0){
        api_reagent_showall().then(data=>{
        let reagents=[]
        for (let i in data.data){
            reagents.push({label:data.data[i].name,
                id:data.data[i].id,
                value:++tree.value,
                isLeaf:false
            })
        } 
        resolve(reagents)
    })
    }
    if (node.level===1){
        let bufferparmas={reagentid:node.data.id}
        api_lot_showall(bufferparmas).then(data=>{
            let lots=[]
            for (let i in data.data){
            lots.push({label:data.data[i].name,
                id:data.data[i].id,
                value:++tree.value,
                isLeaf:true,
                reagentname:node.data.label,
                reagentid:node.data.id
            })
        }
        resolve(lots)
        tree.bufferdata.push(...lots)


        })
    }
}

function get_id(selectedValue){
   for (let i in tree.bufferdata){
    if (tree.bufferdata[i].value===selectedValue){
        formData.lotid=tree.bufferdata[i].id
        formData.lot=tree.bufferdata[i].label
        formData.reagentid=tree.bufferdata[i].reagentid
        formData.reagentname=tree.bufferdata[i].reagentname
        }
   }
   if (tree.select!==null && formData.number!==null){
    formData.editbox_disablebutton=false
   }
   if (tree.select===null || formData.number===null){
    formData.editbox_disablebutton=true
   }
}


// 生命周期钩子

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