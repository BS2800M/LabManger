<template>
    <div>
        <el-tree-select
            lazy
            v-model="status.select"
            style="width: 350px;"
            :load="load_tree"
            :props="tree.props" 
            :default-expanded-keys="expandedKeys"
            @change="changeselect"
            filterable
            placeholder="搜索试剂名称"
        />
    </div>
</template>

<script setup>
import { reactive, watch, ref, nextTick, computed } from 'vue'
import { ElTreeSelect } from 'element-plus'
import { api_reagent_showall } from '@/api/reagent'
import { api_lot_showall } from '@/api/lot'

const status = reactive({
    select: null, //选择的选项 R-id 或者L-id
})

let tree = reactive({ //定义树形图数据
    props: {
        label: 'label',
        isLeaf: 'isLeaf',
        children: 'children',
        value: 'value',
    },
    alllotlist: [],
    allreagentlist: []
})

// 计算需要展开的节点keys
const expandedKeys = computed(() => {
    return [`R-${props.modelValue.reagentid}`]
})

const props = defineProps({ //定义父子组件传输数值
    modelValue: {
        required: true
    }
})

const emit = defineEmits(['update:modelValue', 'change'])

// 主动展开节点
async function expandNode() {
    if (!props.modelValue) return
    await nextTick()
    if (props.modelValue.lotid) {
        // 如果有批号，设置待处理的批号ID
        status.select = `L-${props.modelValue.lotid}`
    } else if (props.modelValue.reagentid) {
        // 如果只有试剂，直接设置选中值
        status.select = `R-${props.modelValue.reagentid}`
    } 
    
}

async function load_tree(node, resolve) {
    if (node.level === 0) {
        tree.allreagentlist = []
        tree.alllotlist = []
        const data = await api_reagent_showall()
        for (let i in data.data) {
            tree.allreagentlist.push({
                label: data.data[i].name,
                id: data.data[i].id,
                value: `R-${data.data[i].id}`,
                isLeaf: false
            })
        }
        // 如果当前选中的是试剂，设置选中状态
        if (props.modelValue?.reagentid && !props.modelValue?.lotid) {
            await nextTick()
            status.select = `R-${props.modelValue.reagentid}`
        }
        resolve(tree.allreagentlist)
    }
    if (node.level === 1) {
        tree.alllotlist = []
        const data = await api_lot_showall({ reagentid: node.data.id })
        for (let i in data.data) {
            tree.alllotlist.push({
                label: data.data[i].name,
                id: data.data[i].id,
                value: `L-${data.data[i].id}`,
                isLeaf: true,
                reagentname: node.data.label,
                reagentid: node.data.id
            })
        }
        // 如果当前选中的是批号，设置选中状态
        if (props.modelValue?.lotid) {
            await nextTick()
            status.select = `L-${props.modelValue.lotid}`
        }
        resolve(tree.alllotlist)
    }
}

function changeselect() {
    if (!status.select) return
    // 处理试剂选择
    if (typeof status.select === 'string' && status.select.startsWith('R-')) {
        
        const id = Number(status.select.slice(2))
        const r = tree.allreagentlist.find(i => i.id === id)
        if (r) {
            emit('update:modelValue', {
                reagentid: id,
                lotid: null,
                reagentname: r.label,
                lotname: null
            })
            
            emit('change')
        }
        return
    }
//
    // 处理批号选择
    if (typeof status.select === 'string' && status.select.startsWith('L-')) {
        const id = Number(status.select.slice(2))
        const l = tree.alllotlist.find(i => i.id === id)
        if (l) {
            emit('update:modelValue', {
                reagentid: l.reagentid,
                lotid: id,
                reagentname: l.reagentname,
                lotname: l.label
            })
            emit('change')
        }

    }
}

watch(() => props.modelValue, async (newValue) => {

    const r = tree.allreagentlist.find(i=>i.id===newValue.reagentid) //检查试剂是否存在
    if(r==undefined){
        status.select=null
        return
    }
    const l = tree.alllotlist.find(i=>i.id===newValue.lotid) //检查批号是否存在 
    if(l==undefined){
        status.select=null
        return
    }
    if (newValue?.reagentid) {
        // 当有试剂ID时，主动展开节点
        await expandNode()
    } else if (newValue?.lotid) {
        // 当有批号ID时，主动展开节点
        await expandNode()
    } else {
        // 清空选择
        status.select = null
    }
}, { deep: true, immediate: true })
</script>

