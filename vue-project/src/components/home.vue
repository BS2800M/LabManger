<template>
    <div id="background" :style="null">
      <div id="warn_reagent">
        <p  id="title1">库存状态：</p>
        <p :style="warn_style" id="title2">{{warn_status}}</p>
        <div id="line"></div>
      </div>
      <div id="setting">
        <p>选择默认打印机</p>
        <el-select-v2 class="selectprinter"  placeholder="选择打印机" v-model="select_printerid" filterable :options="allprinter" style="width: 300px"  :height="500" @change="saveprinter_conf"/>
      </div>
  </div>
  <messagebox ref="to_messagebox"></messagebox>
</template >
  

<script setup>
import {ref,onMounted} from 'vue'
import {api_list_reagentnumber} from '@/api/reagent_manger'
import messagebox from '@/components/messagebox.vue'

let warn_status=ref("未知")
let warn_style=ref()
let allprinter = ref([])
let select_printerid=ref()
let to_messagebox=ref()
onMounted(list_reagentnumber)
onMounted(readprinters)


function list_reagentnumber(){
  api_list_reagentnumber(true,1).then(data=>{
    let warn_kindnum=data.data.warn_typenum
  if (warn_kindnum==0)
  {
    warn_status.value="正常"
    warn_style.value={color:"rgb(10, 211, 10)"}
  }
  else{
    warn_status.value=""+warn_kindnum+"种试剂缺少"
    warn_style.value={color:"red"}
  }
  })
  .catch(err=>{
    to_messagebox.value.messagebox_warn(err)
                })
}

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
}


function saveprinter_conf(){
  let selectname=allprinter.value[select_printerid.value].label
  let selectid=select_printerid.value
  myapi.saveprinterconf(selectname,selectid)
}



</script>
<style scoped>
#background{
position: absolute;
top: 0px;
left:0px;
background-color:rgb(44, 62, 80);
height: 100vh;
width: 100vw;
z-index: 0;
}
#warn_reagent{
border-width: 1px; 
border-style: solid;
border-color: rgb(255, 255, 255);
background-color: rgb(44, 62, 80);
border-radius: 20px;
top:50px;
left:250px;
position: absolute;
width: 500px;
height: 300px;
}
#warn_reagent #title1{
  font-size: 20px;
  font-weight: 100;
  color: rgb(255, 255, 255);
}
#warn_reagent #title2{
  font-size: 50px;
  font-weight: 500;
  color: rgb(60, 41, 72);
  position: absolute;
  top:-45px;
  left: 100px;
}
#warn_reagent #line{
  background-color:rgba(128, 128, 128, 0.117);
  position: absolute;
  top: 90px;
  height: 2px;
  width: 500px;
}
#warn_reagent #content{
  position: relative;
  top: 50px;
  font-size: 15px;
  font-weight: 100;
  color: rgb(212, 23, 23);
}
#setting{
  position: absolute;
  width: 500px;
  height: 200px;
  top: 400px;
  left:250px;
  color: rgb(255, 255, 255);
  border-radius: 20px;
  border-color: white;
  border-style: solid;
  border-width: 1px; 
}

:deep( #setting .el-select__wrapper.is-filterable),
:deep(#setting .el-select),
:deep(#setting .el-select__placeholder)
{
  background-color: #2c3e50;
  color: white;
  --el-select-input-color:rgb(255, 255, 255);
}
:deep(#setting .el-input__wrapper),
:deep(#setting .el-input__inner)
 {
  line-height: 16px;
  background-color: rgb(44, 62, 80);
  --el-input-focus-border-color:white;
  color: white;
}

</style>