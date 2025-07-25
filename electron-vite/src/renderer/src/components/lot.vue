<template>
    <div id="background" :style="null">
        <div id="background2">
        <el-input 
            style="left:200px;top:10px;width:250px;" 
            v-model="state.reagentname" 
            placeholder="搜索试剂名称来搜索批号" 
            @input="lot_show" 
        />
        <el-button 
            type="success" 
            @click="editbox_openaddbox"
            style=" position:absolute;left:1000px; top:50px;"
        >增加批号</el-button>
        <el-pagination 
            background  
            layout="prev, pager, next"  
            v-model:current-page="state.page" 
            :page-count="state.totalpages" 
            @change="lot_show" 
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
            <el-table-column prop="name" label="批号" min-width="150" show-overflow-tooltip/>
            <el-table-column prop="expiration_date" label="有效期" min-width="150" :formatter="formatDateColumn" show-overflow-tooltip/>
            <el-table-column prop="reagentname" label="所属试剂名称" min-width="100" show-overflow-tooltip/>
            <el-table-column label="操作" min-width="100" show-overflow-tooltip>
                <template #default="scope">
                    <el-button size="small" type="primary" @click="editbox_openeditbox(scope.row)">编辑</el-button>
                    <el-button size="small" type="danger" @click="eventBus.emit(EVENT_TYPES.SHOW_MESSAGEBOX,{type:'delete',message:'是否删除',action:()=>lot_del(scope.row.id)})">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <lot_editbox ref="editboxRef"></lot_editbox>
</template >
<script setup>

import { ref, onMounted, reactive, onUnmounted } from 'vue'
import { api_lot_show,api_lot_del } from '@/api/lot'
import { formatDateColumn } from '@/api/dateformat.js'
import lot_editbox from './lot_editbox.vue'
import { eventBus, EVENT_TYPES } from '@/utils/eventBus'

// 创建ref引用
const editboxRef = ref(null)
// 状态管理
const state = reactive({
    reagentname: '',    // 输入搜索名称
    tableData: [],         // 表格数据，初始化为空数组
    page: 1,       // 当前页
    totalpages: 1,        // 总页
    pagesize:13,    // 每页显示数量
    selectedrow:null,
})

async function lot_show() {
    api_lot_show(state)
        .then(data => {
            state.tableData = data.data
            state.totalpages = data.totalpages
        })
}
async function lot_del(id){
    api_lot_del(id).then(data=>{
    eventBus.emit(EVENT_TYPES.LOT_UPDATED)
    eventBus.emit(EVENT_TYPES.CLOSE_MESSAGEBOX)
  })
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
    lot_show()
    // 监听批号更新事件
    eventBus.on(EVENT_TYPES.LOT_UPDATED,lot_show)
    
})

// 组件卸载时清理
onUnmounted(() => {
    eventBus.off(EVENT_TYPES.LOT_UPDATED)
})

</script>
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