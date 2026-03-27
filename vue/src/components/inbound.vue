<template>
    <div id="background" class="inbound-page">
      <section class="panel-section">
        <div class="panel-header">
          <h3>入库管理</h3>
        </div>
        <div id="background2" class="toolbar">
            <div class="toolbar-grid">
                <div class="field-row">
                    <span class="field-label">试剂</span>
                    <el-select-v2
                        class="field-control"
                        v-model="formData.reagentid"
                        filterable
                        :options="allreagentlist"
                        placeholder="选择试剂"
                        @change="checkinput"
                    />
                </div>
                <div class="field-row">
                    <span class="field-label">批号</span>
                    <el-select-v2
                        class="field-control"
                        v-model="formData.lotid"
                        filterable
                        :options="alllotlist"
                        placeholder="选择批号"
                        @change="checkinput"
                    />
                </div>
                <div class="field-row">
                    <span class="field-label">数量</span>
                    <el-input-number
                        class="field-control field-control-small"
                        v-model="formData.number"
                        :min="1"
                        :max="9999"
                        placeholder="0"
                        @change="checkinput"
                    />
                </div>
                <div class="field-row">
                    <span class="field-label">注释</span>
                    <el-input
                        class="field-control"
                        v-model="formData.note"
                        placeholder="可填写注释"
                    />
                </div>
            </div>
            <div class="toolbar-actions">
                <el-button
                    type="success"
                    :disabled="formData.disablebutton"
                    @click="ready_inbound"
                >准备入库</el-button>
            </div>
        </div>
        <div class="inbound-table">
          <el-auto-resizer>
            <template #default="{ width, height }">
              <el-table-v2
                :columns="tableColumns"
                :data="formData.tableData"
                :width="width"
                :height="height"
                :row-height="36"
                :header-height="34"
                :row-class="() => 'normal-row'"
              />
            </template>
          </el-auto-resizer>
        </div>
        <div class="page-actions">
          <button id="inbound" @click="inbound">
              <span>入库</span>
              <svg class="icon" fill="currentColor" aria-hidden="true">
                  <use xlink:href="#icon-ruku"></use>
              </svg>
          </button>
        </div>
      </section>
        <svg id="barcode"></svg>
    </div>
</template>

<script setup>
import { reactive,ref,onMounted, h} from 'vue'
import { ElButton, ElMessage } from 'element-plus'
import { api_operation_inbound } from '@/api/operation'
import { api_reagent_showall } from '@/api/reagent'
import { api_lot_showall } from '@/api/lot'
import 'element-plus/dist/index.css'
// 组件引用
// 使用reactive统一管理状态
const formData = reactive({
    number:1,//数量
    disablebutton: true, // 是否禁用按钮 默认禁用
    reagentid:null,
    lotid:null,
    tableData: [], // 表格数据  

})
const allreagentlist = ref([])
const alllotlist = ref([])
const tableColumns = [
  { key: 'reagentname', dataKey: 'reagentname', title: '试剂名字', width: 180, flexGrow: 1 },
  { key: 'lot', dataKey: 'lot', title: '批号', width: 180, flexGrow: 1 },
  { key: 'number', dataKey: 'number', title: '数量', width: 120, flexGrow: 1 },
  { key: 'note', dataKey: 'note', title: '注释', width: 180, flexGrow: 1 },
  {
    key: 'action',
    title: '操作',
    width: 120,
    cellRenderer: ({ rowData }) =>
      h(
        ElButton,
        {
          size: 'small',
          type: 'danger',
          onClick: () => delete_inbound(rowData.rowsid),
        },
        () => '删除'
      ),
  },
]

async function ready_inbound() {
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
async function inbound() {
    const data = await api_operation_inbound(formData.tableData)
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
function delete_inbound(rowsid) {
    formData.tableData = formData.tableData.filter(item => item.rowsid !== rowsid)
}









async function checkinput(){
  // 检查必填字段
  const hasEmptyField = 
    !formData.reagentid || 
    !formData.lotid || 
    !formData.number
  // 更新按钮禁用状态   
  formData.disablebutton = hasEmptyField


  if (formData.reagentid) {
    let data =  await api_lot_showall(formData.reagentid)
    alllotlist.value = data.data.map(item => ({
      value: item.id,
      label: item.name,
      name: item.name
    }))
    formData.lotid = alllotlist.value[0].value
  }
  else {
    alllotlist.value = []
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

.inbound-page {
  height: calc(100dvh - 80px);
  margin: 72px auto 0;
  padding: 8px 12px;
  max-width: 1900px;
  box-sizing: border-box;
  overflow: hidden;
}

.panel-section {
  height: 100%;
  border: 1px solid var(--el-border-color-light);
  border-radius: 10px;
  background: var(--el-bg-color-overlay);
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.panel-header h3 {
  margin: 0 0 6px 0;
  color: var(--el-text-color-primary);
  font-size: 22px;
  font-weight: 800;
}

.toolbar {
  min-height: 160px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.toolbar-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(340px, 1fr));
  gap: 12px 24px;
}

.field-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.field-label {
  width: 56px;
  color: var(--el-text-color-primary);
}

.field-control {
  width: 300px;
}

.field-control-small {
  width: 160px;
}

.toolbar-actions {
  display: flex;
  align-items: center;
}

#inbound{
  margin-top: 12px;
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
  border-radius: 15px; /* 设置圆角半径 */
}
  #inbound:hover{
  color: rgb(25, 153, 11);
  background-color: rgb(255, 255, 255);
  border-style: solid;
  border-color: rgb(25, 153, 11);
}

.inbound-table {
  margin-top: 12px;
  flex: 1;
  min-height: 0;
}

.page-actions {
  margin-top: 12px;
}

.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill:currentColor;
  overflow: hidden;
}

#barcode {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
  pointer-events: none;
}

</style>
