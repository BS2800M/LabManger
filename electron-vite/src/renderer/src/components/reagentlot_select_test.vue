<template>
    <div>
        <el-tree-select
            v-model="selectvalue"   
            lazy
            style="width: 350px;"
            :load="load_tree"
            :props="tree.props" 
            @change="changeselect"
            filterable
            placeholder="搜索试剂名称"
        />
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const selectvalue = ref(null)
const tree = reactive({
  props: { label: 'label', children: 'children', isLeaf: 'isLeaf' }
})

function load_tree(node, resolve) {
  if (node.level === 0) {
    // 根节点用 R- 前缀
    resolve([
      { label: '1', value: 'R-1', isLeaf: false },
      { label: '2', value: 'R-2', isLeaf: false }
    ])
  } else if (node.level === 1) {
    // 子节点用 L- 前缀
    resolve([
      { label: '1', value: 'L-1', isLeaf: true },
      { label: '2', value: 'L-2', isLeaf: true }
    ])
  }
}

function changeselect(v) {
  if (!v) return
  if (v.startsWith('R-')) {
    const reagentId = Number(v.slice(2))
    // 回填你的 v-model：仅选了试剂
  } else if (v.startsWith('L-')) {
    const lotId = Number(v.slice(2))
    // 回填你的 v-model：选了批号
  }
}
</script>

