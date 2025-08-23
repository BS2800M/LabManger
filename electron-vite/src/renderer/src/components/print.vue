<template>
  <div class="background">
    <svg class="barcode" ></svg>
    <p class="reagentname">{{reagentname}}</p>
    <p class="lot">{{lot}}</p>
    <p class="other">LabManger</p>
  </div>
</template>
  
  
<script setup>
import { ref, onMounted, watch } from 'vue'
import JsBarcode from 'jsbarcode';
import { my } from 'element-plus/es/locale/index.mjs';
let reagentname=ref("no data")
let lot=ref("no data")
let barcodeNumber='99999999'
let options = {
  fontSize: 12,
  format: 'CODE39',
    lineColor: '#000',
    width: 1.1,
    height: 80,
    fontSize:15,
    displayValue:true
};

async function loadstart(){
  myapi.printdata_send(async(event,args)=>{
  let myconf= await myapi.read_conf()
  if (myconf.allow_print==true){
    for(let i in args){
      reagentname.value=args[i].reagentname
      lot.value=args[i].lotname
      barcodeNumber=args[i].barcodeNumber
      JsBarcode('.barcode', barcodeNumber,options)
      await delay(1000)
      myapi.print()
        }
    }
    })
}


function delay(ms)
{
  return new Promise(resolve=>{setTimeout(resolve,ms)})
}




onMounted(() => {
  loadstart()
})
</script>
  
  
<style scoped>
.barcode{
  position: absolute;
  margin-left: auto;
  width: 100%;
}
.reagentname{
  position: absolute;
  left: 10px;
  top: 100px;
  font-size: 10px;
}
.lot{
  position: absolute;
  left: 150px;
  top: 100px;
  font-size: 10px;
}
.background{
  font-size: small;
  position: absolute;
  height: 140px;
  width: 250px;
  border-style: solid;
  border-color: black;
}
.other{
  position: absolute;
  top: 80px;
  left:10px;
  font-size: 10px;
}
</style>