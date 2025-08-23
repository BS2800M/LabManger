<template>
    <div id="background" :style="null">
      <div id=dashbord>
        <p   style="font-size: 40px;font-weight: bold; position: absolute;top: -30px;left: 10px;">试剂库存</p>
        <p  :class="dashbord.warning_totalnum>0?'warn':'no_warn'" style="font-size: 20px;font-weight: 400; position: absolute;top: 50px;left: 10px; ">总种类：{{dashbord.total}}  / 警告种类：{{dashbord.warning_totalnum}}</p>
        <p  :class="dashbord.warning_numnum>0?'warn':'no_warn'" style="font-size: 20px;font-weight: 400; position: absolute;top: 80px;left: 10px; ">数量警告：{{dashbord.warning_numnum}} </p>
        <p  :class="dashbord.warning_expirnum>0?'warn':'no_warn'" style="font-size: 20px;font-weight: 400; position: absolute;top: 110px;left: 10px; ">有效期警告：{{dashbord.warning_expirnum}}</p>
      </div>
      <div id="setting">
        <p>选择默认打印机</p>
        <el-select-v2 class="selectprinter"  placeholder="选择打印机" v-model="select_printerid" filterable :options="allprinter" style="width: 300px"  :height="500" @change="saveprinter_conf"/>
        <p>是否开启条码打印</p>
        <el-switch v-model="allow_print" size="large" active-text="开启"inactive-text="关闭"     @change="saveprinter_conf"/>
      </div>
  </div>
</template >
  

<script setup>
import {ref,onMounted, reactive} from 'vue'
import { api_inventory_dashboard } from '@/api/inventory'

let allprinter = ref([])
let select_printerid=ref()
let allow_print=ref()
let dashbord=reactive({
  total:0,
  warning_totalnum:0,
  warning_numnum:0,
  warning_expirnum:0,
})



async function readprinters(){ 
    let data = await myapi.read_conf(null)
    let printerlist = data.printerlist
    let i
    for (i in printerlist){
        allprinter.value.push({
            label: printerlist[i].name,
            value: i
        })
    }
    select_printerid.value = data.select_printerid
    allow_print.value = data.allow_print
}


function saveprinter_conf(){
  let selectname=allprinter.value[select_printerid.value].label
  let selectid=select_printerid.value
  let allowprint=allow_print.value
  myapi.saveprinterconf(selectname,selectid,allowprint)
}

async function readdashbord(){
    let data = await api_inventory_dashboard()
    dashbord.total = data.data.totalNum
    dashbord.warning_totalnum = data.data.warningTotalNum
    dashbord.warning_numnum = data.data.warningNumNum
    dashbord.warning_expirnum = data.data.warningExpNum
}

onMounted(()=>{
  readprinters()
  readdashbord()
})

</script>
<style scoped>
#background{
position: absolute;
top: 0px;
left:0px;
background-color:rgb(30, 42, 54);
height: 100vh;
width: 100vw;
z-index: 0;
}
#dashbord{
  position: absolute;
  width: 350px;
  height:180px;
  top: 100px;
  left:250px;
  color: white;
  background-color:rgb(60, 83, 108);
  border-radius: 20px;
  padding: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
}
.warn{
  color:rgb(211, 139, 6);
}
.no_warn{
  color:rgb(166, 255, 0);
}
#setting{
  position: absolute;
  width: 350px;
  height:180px;
  top: 520px;
  left:250px;
  color: white;
  background-color:rgb(60, 83, 108);
  border-radius: 20px;
  padding: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);

}

.el-switch{
  --el-text-color-primary:white;
}


</style>