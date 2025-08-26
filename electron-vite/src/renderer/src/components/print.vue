<template>
  <div class="background" :style="{ height: (140*scale)+ 'px', width: (250*scale)+'px' }">
    <svg class="barcode" ></svg>
    <p class="reagentname" :style="{ fontSize: (10*scale)+'px', left: (10*scale)+'px', top: (100*scale)+'px' }">{{reagentname}}</p>
    <p class="lot" :style="{ fontSize: (10*scale)+'px', left: (10*scale)+'px', top: (110*scale)+'px' }">{{lot}}</p>
    <p class="other" :style="{ fontSize: (10*scale)+'px', left: (160*scale)+'px', top: (110*scale)+'px' }">LabManger</p>
  </div>
</template>
  
  
<script setup>
import { ref, onMounted} from 'vue'
import JsBarcode from 'jsbarcode';
let reagentname=ref("no data")
let lot=ref("no data")
let barcodeNumber='99999999'
let scale=ref(1)


async function loadstart(){
  myapi.printdata_send(async(event,args)=>{
  let myconf= await myapi.read_conf()
  scale.value = myconf.scale
  let options = {
  fontSize: 12*myconf.scale,
  format: 'CODE39',
    lineColor: '#000',
    width: 3.5*myconf.scale*0.5,
    height: 100*myconf.scale*0.9,
    fontSize:15*myconf.scale,
    displayValue:true
}



  if (myconf.allow_print==true){
    for(let i in args){
      reagentname.value=args[i].reagentName
      lot.value=args[i].lotName
      barcodeNumber=args[i].barcodeNumber
      if(barcodeNumber!==null && barcodeNumber!==""){
        JsBarcode('.barcode', barcodeNumber,options)
      }
      await delay(500)
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
}
.lot{
  position: absolute;
}
.background{
  font-size: small;
  position: absolute;
  border-style: solid;
  border-color: black;
}
.other{
  position: absolute;
}
</style>