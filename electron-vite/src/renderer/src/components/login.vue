<template>
	<div class="page" :style="backgrounblur">
		<div class="login-box" >
			<h1>Lab Manger</h1>
			<h2>实验室管理</h2>
			<div>
				<div class="login-field">
					<input type="text" v-model="username"  >
					<label>账户</label>
				</div>
				<div class="login-field">
					<input type="password" v-model="password"  >
					<label >密码</label>
				</div>
				<button  @click="login">登录</button>
			</div>
		</div>
	</div>
</template>

<script setup>
import {ref} from 'vue';
import { useRouter } from 'vue-router'
import { api_signin } from '@/api/signinout';	
const router = useRouter()
let username=ref("")
let password=ref("")
let backgrounblur=ref({filter:""})


async function login(){
    const data = await api_signin(username.value, password.value)
    localStorage.token = data.token //储存token
    localStorage.username = data.userName //储存用户
    localStorage.teamname = data.teamName //储存用户id
    router.push("/home")
}
</script>
  
  
  
  
  
  
  
  
  
  
  
  
<style scoped >
  .page{
	position: absolute;  
	margin: auto;
	top: 0px;
	left: 0px;
	width: 100%;
	height: 100%;
	background: no-repeat center center fixed   url("../assets/loginbackground.jpg");
	background-size: cover;
	transition-property:filter;
  	transition-duration: 0.8s;
}
.login-box{
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%,-50%);
	width: 700px;
    height: 400px;
	padding:40px;
	margin: 0 auto;
	background: rgba(0,0,0,.8);
	box-sizing: border-box;
	box-shadow: 0 15px  25px rgba(0,0,0,.5);
	border-radius: 10px;
}
.login-box h1{ /*标题1*/
	margin: 0 0 10px;
	padding: 0;
	text-align: center;
	color: #ffffff;
	font-size: 35px;
}
.login-box h2{ /*标题2*/
	margin: 0 0 10px;
	padding: 0;
	text-align: center;
	color: #ffffff;
	font-size: 20px;


}
.login-box .login-field{
	position: relative;
}
.login-box .login-field  input{
	width: 100%;
	padding: 10px 0;
	font-size: 10px;
	color: #fff;
	margin-bottom: 30px;
	border: none;
	border-bottom: 1px solid #fff;
	outline: none;
	background: transparent;
	font-size: large;
}
.login-box .login-field  label{
	position: absolute;
	top: 0;
	left: 0;
	letter-spacing: 1px;
	padding: 0px 0;
	font-size: 16px;
	pointer-events: none;
	transition: .2s;
	top: -23px;
	left: 0;
	font-weight: 200;
	color: rgb(255, 255, 255);
}
.login-box button{    /*登录按钮*/
	border: none;
	color: #ffffff;
	font-size: 20px;
	font-weight:900	;
	background: #03a9f4;
	width: 250px;
	height: 60px;
	border-radius: 30px;
	position: absolute;
	margin-left: 25%;
	transition: all 0.3s ease-in-out;
}
.login-box button:hover{    /*登录按钮*/
	color: #03a9f4;
	background: #ffffff;
}

</style>
  