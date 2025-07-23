<template>
    <div id="background" :style="null">
      <div id="setting">
        <p>选择默认打印机</p>
        <el-select-v2 class="selectprinter"  placeholder="选择打印机" v-model="select_printerid" filterable :options="allprinter" style="width: 300px"  :height="500" @change="saveprinter_conf"/>
        <p>是否开启条码打印</p>
        <el-switch v-model="allow_print" size="large" active-text="开启"inactive-text="关闭"     @change="saveprinter_conf"/>

      </div>
  </div>
</template >
  

<script setup>
import {ref,onMounted} from 'vue'

let allprinter = ref([])
let select_printerid=ref()
let allow_print=ref()




async function readprinters(){ 
  let data=await myapi.read_conf()
  let printerlist=data.printerlist
  let i
  for (i in printerlist){
    allprinter.value.push({
      label:printerlist[i].name,
      value:i
    }
    )
  }
  select_printerid.value=data.select_printerid
  allow_print.value=data.allow_print
}


function saveprinter_conf(){
  let selectname=allprinter.value[select_printerid.value].label
  let selectid=select_printerid.value
  let allowprint=allow_print.value
  myapi.saveprinterconf(selectname,selectid,allowprint)
}

onMounted(readprinters)

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

#setting{
  position: absolute;
  width: 500px;
  height:180px;
  top: 520px;
  left:250px;
  color: white;
  background-color:rgb(60, 83, 108);
  border-radius: 20px;
  border-style: solid;
  border-color: rgb(60, 83, 108);
  border-width: 2px; 
  padding: 10px;
}

.el-switch{
  --el-text-color-primary:white;
}


</style>