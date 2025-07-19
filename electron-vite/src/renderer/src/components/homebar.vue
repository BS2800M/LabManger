<template>


<div id="Sidebar">
  <p id="title1">Lab Manger</p>
  <p id="title2">实验室管理系统 <br />欢迎,{{ username }}</p>
  <p id="title3">{{ teamname }}</p>
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
          <li><RouterLink to="/warn_reagent"><button >统计</button></RouterLink></li>
        </ul>
      </li>
      <li><button>管理 <svg class="icon"><use xlink:href="#icon-wendu"></use></svg></button>
        <ul>
          <li><RouterLink to="/team"><button>检验小组</button></RouterLink></li>
          <li><RouterLink to="/user"><button>用户</button></RouterLink></li>
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
const teamname = ref(localStorage.teamname)
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
  #title3{
    position: absolute;
    color: white;
    margin: 0;
    top: 80px;
  }
  #Sidebar{
    position: absolute;
    background-color:rgb(60, 83, 108);
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
    top: 150px;
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
    background-color:rgb(60, 83, 108);
    border-radius: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
  }
  #Sidebar ul li button:hover{
    color: rgb(60, 83, 108);
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
  