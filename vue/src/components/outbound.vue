<template>
<div id="background" class="outbound-page">
  <section class="panel-section">
    <div class="panel-header">
      <h3>出库管理</h3>
    </div>
    <div id="background2" class="toolbar">
      <div class="section-block">
        <p id="title" class="section-title">快速出库</p>
        <div class="quick-row">
          <el-input
            id="input_barcodenumber"
            class="barcode-input"
            v-model="formData.barcodenumber"
            placeholder="快速录入唯一试剂条码号"
            @keyup.enter="operation_outbound"
          />
          <button id="outbound" @click="operation_outbound">
            <span>出库</span>
            <svg class="icon" fill="currentColor" aria-hidden="true">
              <use xlink:href="#icon-chuku"></use>
            </svg>
          </button>
        </div>
      </div>

      <div class="section-block">
        <p id="title2" class="section-title">特殊出库</p>
        <div class="special-grid">
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
            <span class="field-label">注释</span>
            <el-input
              class="field-control"
              v-model="formData.note"
              placeholder="可填写注释"
            />
          </div>
        </div>
        <el-button
          class="prepare-special-btn"
          type="success"
          :disabled="formData.editbox_disablebutton"
          @click="ready_operation_special_outbound"
        >准备特殊出库</el-button>
      </div>
    </div>

    <div class="outbound-table">
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
      <button id="outbound2" @click="operation_special_outbound">
        <span>出库</span>
        <svg class="icon" fill="currentColor" aria-hidden="true">
          <use xlink:href="#icon-chuku"></use>
        </svg>
      </button>
    </div>
  </section>
  </div>


</template>


<script setup>
import { ElMessage } from 'element-plus'
import { h } from 'vue'
import { ElButton } from 'element-plus'
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

const tableColumns = [
  { key: 'reagentname', dataKey: 'reagentname', title: '试剂名字', width: 300, flexGrow: 1 },
  { key: 'lot', dataKey: 'lot', title: '批号', width: 220, flexGrow: 1 },
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
          onClick: () => delete_outbound(rowData.rowsid),
        },
        () => '删除'
      ),
  },
]



async function operation_outbound(){
    try {
        const data = await api_operation_outbound(formData)
        formData.barcodenumber = ""
        const msg = data.data?.message ?? ''
        const warningKeyWord = ["库存不足", "该条码已经出库", "该条码未进行入库"]
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
        formData.lotid = alllotlist.value[0].value
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

.outbound-page {
  height: calc(100dvh - 82px);
  margin: 72px auto 0;
  padding: 8px 12px;
  max-width: 1900px;
  box-sizing: border-box;
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
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  margin: 0;
  font-size: 36px;
  font-weight: 100;
  color: var(--el-text-color-primary);
}

.quick-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.barcode-input {
  max-width: 700px;
}

.special-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(360px, 1fr));
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

.prepare-special-btn {
  width: 160px;
  height: 40px;

}

#outbound {
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

#input_barcodenumber {
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

.outbound-table {
  margin-top: 12px;
  flex: 1;
  min-height: 0;
}

.page-actions {
  margin-top: 12px;
}

#outbound2 {
    margin-top: 12px;
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
