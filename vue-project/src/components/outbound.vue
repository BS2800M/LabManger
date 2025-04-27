<template>
  <messagebox ref="to_messagebox" ></messagebox>
  <div id="background" :style="null">
  <p id="title">快速出库</p>
  <el-input v-model="barcodenumber" style="width: 700px;height:50px;" placeholder="快速录入唯一试剂条码号" @keyup.enter="outbound"/>
  <button id="outbound" @click="outbound"   >
        <span>出库</span>
        <svg class="icon" fill="currentColor" aria-hidden="true"> <use xlink:href="#icon-chuku"></use></svg>
  </button>
  </div>

</template>


<script setup>
import { ElMessage } from 'element-plus'
import 'element-plus/dist/index.css'
import { h } from 'vue'
import {ref,onMounted} from 'vue'
import messagebox from '@/components/messagebox.vue';
import { api_outbound } from '../api/reagent_manger';
const to_messagebox=ref() //引入messagebox
let barcodenumber=ref()
let response_message=ref("")
function outbound(){
  api_outbound(barcodenumber.value)
  .then(data=>{
    if (barcodenumber.value==""){
        ElMessage({
          message: h('p', { style: 'line-height: 1; font-size: 25px' }, [
          h('span', null, "请输入试剂条码号！")]),
        })
    }
    else{
        barcodenumber.value=""
        ElMessage({
          message: h('p', { style: 'line-height: 1; font-size: 25px' }, [
          h('span', null, data.data.msg)]),
        })
    }

  })
  

  .catch(err=>{
    to_messagebox.value.messagebox_warn(err)
                })
}


</script>


<style scoped>
#background{
position: absolute;
top: 0px;
left:0px;
background-color:rgb(44, 62, 80);
height: 100vh;
width:100vw;
z-index: 0;
}
  #outbound{
    position: absolute;
    left:250px;
    top:190px;
    width: 200px;
    height: 50px;
    background-color: rgb(25, 153, 11);
    color: white;
    border-color: white;
    border-style: solid;
    border-width: 3px;
    transition: all 0.3s ease-in-out;
  }
  #outbound:hover{
    position: absolute;
    width: 200px;
    height: 50px;
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
  #title{
    position: absolute;
    top: 30px;
    left: 250px;
    font-size: 40px;
    font-weight: 100;
    color: white;
  }
  .el-input{
    position: absolute;
    top: 130px;
    left: 250px;
    font-weight: 100;
    font-size: large;
  }
  #response_message{
    position: absolute;
    top:250px;
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
</style>
