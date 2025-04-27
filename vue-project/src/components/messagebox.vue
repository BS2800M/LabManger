<template>
<div id="fullscreenprovide" :style="blockstyle">
</div>
  <div id="messagebox" :style="messageboxstyle">
    <p id="messagebox-text">{{messagebox_text}}</p>
    <el-button size="large" type="danger" @click="message_button1function" :style="message_button1hide">{{message_button1text}}</el-button>
    <el-button size="large" type="primary" @click="message_button2function">{{message_button2text}}</el-button>
</div>
</template >

<script  setup>

import {ref,defineExpose} from 'vue'
import {api_delete_Template,api_delete_lot,api_delete_operation} from '@/api/reagent_manger.js'
import {api_delete_Team} from '@/api/test_manger.js'
import { eventBus, EVENT_TYPES } from '@/utils/eventBus'
let messagebox_text = ref('') //消息弹窗的文本
let messageboxstyle=ref(null) // 显示消息框
let blockstyle=ref() //  用来给全屏显示一个遮罩防止操作消息框以外的按钮操作
let message_button1hide=ref() //是否隐藏按钮1删除按钮
let message_button1text=ref() //更改按钮1的文本
let message_button2text=ref() //更改按钮2的文本
let message_button1function=ref() //更改按钮1的函数
let message_button2function=ref() //更改按钮2的函数
let seleteid=null


defineExpose({
  closemessagebox,
  messagebox_warn,
  messagebox_delete_Template,
  messagebox_delete_Lot,
  messagebox_waitng,
  messagebox_delete_operation,
  messagebox_delete_Team
});


function openmessagebox(messageboxtext,button1text,button2text,button1function,button2function){
  if(button1function!=undefined){//如果定义了按钮1的执行函数
  messagebox_text.value=messageboxtext
  message_button1text.value=button1text
  message_button2text.value=button2text
  message_button1function.value=button1function
  message_button2function.value=button2function
  message_button1hide.value={display:"unset"}
  blockstyle.value={display:"block"}
  messageboxstyle.value={visibility:"visible",top:"50%",opacity:"100"}
}
  else //如果没有定义按钮1函数 
{
  messagebox_text.value=messageboxtext
  message_button1text.value=button1text
  message_button2text.value=button2text
  message_button1function.value=button1function
  message_button2function.value=button2function
  message_button1hide.value={display:"none"}
  blockstyle.value={display:"block"}
  messageboxstyle.value={visibility:"visible",top:"50%",opacity:"100"}

}

}
function closemessagebox(){
  messageboxstyle.value={visibility:"hidden",top:"30%",opacity:"0"}
  blockstyle.value={display:"none"}
}

function messagebox_warn(message)
{
  openmessagebox(message,"确认","确认",undefined,closemessagebox)
}

function messagebox_delete_Template(id){
  seleteid=id
  openmessagebox("是否确认删除","删除","取消",delete_Template,closemessagebox)
}

function messagebox_delete_Lot(id){
  seleteid=id
  openmessagebox("是否确认删除","删除","取消",delete_lot,closemessagebox)
}

function messagebox_delete_operation(id){
  seleteid=id
  openmessagebox("是否确认删除此条记录","删除","取消",delete_operation,closemessagebox)
}

function messagebox_waitng(showtext){
  openmessagebox(showtext,"等待中","等待中",undefined,undefined)
}

function messagebox_delete_Team(id){
  seleteid=id
  openmessagebox("是否确认删除","删除","取消",delete_team,closemessagebox)
}




function delete_Template(){
  api_delete_Template(seleteid)
  .then(data=>{
    closemessagebox()
    eventBus.emit(EVENT_TYPES.TEMPLATE_UPDATED)
 } )
  .catch(err=>{
    messagebox_warn(err)
                })
}


function delete_lot(){
  api_delete_lot(seleteid)
  .then(data=>{
    closemessagebox()
    eventBus.emit(EVENT_TYPES.LOT_UPDATED)
 } )
  .catch(err=>{
    messagebox_warn(err)
                })
}

function delete_operation(){
  api_delete_operation(seleteid)
  .then(data=>{
    closemessagebox()
    eventBus.emit(EVENT_TYPES.OPERATION_UPDATED)
  })
  .catch(err=>{
    messagebox_warn(err)
  })
}


function delete_team(){
  api_delete_Team(seleteid)
  .then(data=>{
    closemessagebox()
    eventBus.emit(EVENT_TYPES.TEAM_UPDATED)
  })
  .catch(err=>{
    messagebox_warn(err)
  })
}

</script >

<style scoped>

#fullscreenprovide{
  position: absolute;
  z-index: 1;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  display: none;

}
#messagebox{
  position: absolute;
  z-index: 2;
  background-color: rgb(255, 255, 255);
  width: 500px;
  height:200px;
  left:50%;
  top: 30%;
  margin-left: -250px;
  margin-top: -100px;
  border-radius: 20px;
  text-align: center;
  visibility:hidden;
  opacity: 0;
  transition: all 0.3s ease-in-out;



}
#messagebox #messagebox-text{
  font-size: 20px;
  color: rgb(0, 123, 255);
  font-weight: 900;
  margin-top: 20px;
  margin-bottom: 60px;
}



</style>