<template>
    <div id="background" :style="null">
        <el-input 
            style="left:200px;top:10px;width:250px;" 
            v-model="state.inputsearchname" 
            placeholder="搜索试剂名称来搜索批号" 
            @input="list_lot" 
        />
        <el-button 
            type="success" 
            @click="editbox_openaddbox"
            style=" position:absolute;left:1000px; top:50px;"
        >增加批号</el-button>
        <el-pagination 
            background  
            layout="prev, pager, next"  
            v-model:current-page="state.current_page" 
            :page-count="state.total_pages" 
            @change="list_lot" 
            style="position: absolute;left: 200px;top: 50px;"
        />
        <el-table
            :data="state.tableData"
            :default-sort="{ prop: 'date', order: 'descending' }"
            :style="{width:'calc(100vw - 205px)'}"
            row-class-name="rowstyle"
            header-cell-class-name="rowstyle"
        >
            <el-table-column prop="creation_time" label="时间" sortable min-width="100" :formatter="formatDateColumn" />
            <el-table-column prop="lot" label="批号" min-width="150" />
            <el-table-column prop="Expiration_date" label="有效期" min-width="150" :formatter="formatDateColumn" />
            <el-table-column prop="reagent__name" label="所属试剂名称" min-width="100" />
            <el-table-column label="操作" min-width="100">
                <template #default="scope">
                    <el-button size="small" type="primary" @click="editbox_openeditbox(scope.row)">编辑</el-button>
                    <el-button size="small" type="danger" @click="openmessagebox('delete','是否删除',api_delete_lot,scope.row.id,EVENT_TYPES.LOT_UPDATED)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <messagebox ref="messageboxRef"></messagebox>
    <lot_editbox ref="editboxRef"></lot_editbox>
</template >
<script setup>

import { ref, onMounted, computed, reactive, watch, onUnmounted } from 'vue'
import { api_list_lot,api_delete_lot } from '@/api/reagent_manger'
import { formatDateColumn } from '@/api/dateformat.js'
import messagebox from '@/components/messagebox.vue'
import lot_editbox from './lot_editbox.vue'
import { eventBus, EVENT_TYPES } from '@/utils/eventBus'

// 创建ref引用
const messageboxRef = ref(null)
const editboxRef = ref(null)

// 状态管理
const state = reactive({
    inputsearchname: '',    // 输入搜索名称
    tableData: [],         // 表格数据，初始化为空数组
    current_page: 1,       // 当前页
    total_pages: 1,        // 总页
    inputteam:{teamid:localStorage.getItem('t_teamid'),selectid:localStorage.getItem('t_selectid')}
})

function list_lot() {
    api_list_lot(state.inputsearchname, state.current_page,state.inputteam.teamid)
        .then(data => {
            state.tableData = data.data.list
            state.total_pages = data.data.total_pages
        })
        .catch(err => {
            openmessagebox('error',err,'close',null,null)
        })
}

function openmessagebox(a,b,c,d,e){
  messageboxRef.value.openmessagebox(a,b,c,d),e
}

function editbox_openaddbox() {
    editboxRef.value.openaddbox()
}

function editbox_openeditbox(editdate) {
    editboxRef.value.openeditbox(editdate)
}

// 生命周期钩子
onMounted(() => {
    // 初始化列表
    list_lot()
    // 监听批号更新事件
    eventBus.on(EVENT_TYPES.LOT_UPDATED, list_lot)
    
})

// 组件卸载时清理
onUnmounted(() => {
    eventBus.off(EVENT_TYPES.LOT_UPDATED)
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

.el-table{
    position: absolute;
    left: 200px;
    top: 100px;
    background-color: rgb(44, 62, 80);
}
:deep(.el-table .rowstyle)
{
    color: rgb(255, 255, 255);
    background-color:rgb(44, 62, 80);
}
:deep(.el-table .rowstyle:hover)
{
    color: rgb(44, 62, 80);
    background-color: rgb(255, 255, 255);
}


:deep( .el-input .el-input__wrapper),
:deep( .el-input .el-input__inner)
{
    background:transparent;
    background-color:transparent;
    --el-input-focus-border-color:white;
    color: white;
}
:deep(.el-pagination .btn-prev),
:deep(.el-pagination .btn-next) 
{
    background-color:transparent !important;
    color: white;
}
:deep(.el-pagination .el-pager li:not(.active):not(.disabled)) {
    background-color:transparent !important;
    color: white;
}
:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
    font-size: 25px;
}
</style>