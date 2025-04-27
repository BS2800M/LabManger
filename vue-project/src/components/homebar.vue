<template>


<div id="Sidebar">
  <p id="title1">Lab Manger</p>
  <p id="title2">实验室管理系统 <br />欢迎{{ username }}</p>
  <div id="silde">
    <ul>
      <li><RouterLink to="/home"><button>主页<svg class="icon"><use xlink:href="#icon-shouye"></use></svg></button></RouterLink>   </li>
      <li><button>试剂<svg class="icon"> <use xlink:href="#icon-huowudui"></use></svg></button>
        <ul>
          <li><RouterLink to="/template"><button>模板</button></RouterLink></li>
          <li><RouterLink to="/lot"><button >批号</button></RouterLink></li>
          <li><RouterLink to="/inbound"><button >入库</button></RouterLink></li>
          <li><RouterLink to="/outbound"><button >出库</button></RouterLink></li>
          <li><RouterLink to="/list_operation"><button >记录</button></RouterLink></li>
          <li><RouterLink to="/warn_reagent"><button >提醒</button></RouterLink></li>
        </ul>
      </li>
      <li><button>信息  <svg class="icon"><use xlink:href="#icon-wendu"></use></svg></button>
        <ul>
          <li><RouterLink to="/team"><button>检验小组</button></RouterLink></li>
          <li><button>检验组套</button></li>
        </ul>
      </li>
      <li><RouterLink to="/loginout"><button>登出<svg class="icon"> <use xlink:href="#icon-dengchu"></use></svg></button></RouterLink>   </li>
    </ul>
  </div>
</div>
</template>
<script setup>
import { RouterLink } from 'vue-router';
import { ref } from 'vue';
const username = ref(localStorage.username)
</script>
<style scoped >

  #title1{
    position: absolute;
    color: white;
    font-size: 30px;
    font-weight: 500;
    margin: 0cm;
  }
  #title2{
    position: absolute;
    color: white;
    margin: 0;
    top: 40px;
  }
  #Sidebar{
    position: absolute;
    background-color:rgb(44, 62, 80);
    width: 200px;
    height: 100%;
    top: 0px;
    left: 0px;
    border-right-style: solid;
    border-right-color: rgb(255, 255, 255);
    border-right-width: 1px;
    z-index: 1;
  }
  #Sidebar #silde{
    position: absolute;
    top: 100px;
  }
  #Sidebar ul{
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  #Sidebar ul li button {
    font-size: 20px;
    border-style: none;
    color: white;
    width: 200px;
    text-decoration: none;
    transition: 0.2s ease-in-out;
    background-color:rgb(44, 62, 80);
    border-radius: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
  }
  #Sidebar ul li button:hover{
    color: rgb(44, 62, 80);
    background-color: white;
  }



  #Sidebar ul li ul{
    max-height: 0;
    max-width: 400px;
    overflow: hidden;
    transition: 0.5s ease-in-out;
  }
  #Sidebar ul li button:focus +ul{
    max-height: 800px;
  }
  
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill:currentColor;
  overflow: hidden;
}



</style>
  