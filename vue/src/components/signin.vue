<template>
	<div class="page" :style="backgrounblur">
		<div class="login-box" >
			<h1 class="brand-title">LABMANGER</h1>
			<h2>登录</h2>
			<div>
				<div class="login-field">
					<input type="text" v-model="account" @input="syncSelectedByAccount">
					<label>账户</label>
				</div>
				<div class="login-field">
					<input type="password" v-model="password"  >
					<label >密码</label>
				</div>
				<div class="user-table-wrap">
					<div class="table-header-row">
						<span class="table-title">选择审核者账户</span>
						<input
							class="table-search-input"
							v-model="tableKeyword"
							type="text"
							placeholder="搜索用户名或账户"
						>
					</div>
					<div class="mini-table">
						<el-auto-resizer>
							<template #default="{ width, height }">
								<el-table-v2
									:columns="userTableColumns"
									:data="filteredUserRows"
									:width="width"
									:height="height"
									:row-height="34"
									:header-height="34"
									:row-class="({ rowData }) => getUserRowClass(rowData)"
									:row-event-handlers="{ onClick: handleUserRowClick }"
								/>
							</template>
						</el-auto-resizer>
					</div>
				</div>
				<button type="button" class="submit-btn" @click="login">审核者登录</button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router'
import { api_signin_reviewer } from '@/api/auth';	
import { api_user_showall } from '@/api/user';
import { openErrorMessageBox } from '@/utils/messagebox';
const router = useRouter()
const THEME_KEY = 'labmanger-theme'
let account=ref("")
let password=ref("")
let backgrounblur=ref({filter:""})
const userOptions = ref([])
const tableKeyword = ref('')
const selectedUserId = ref(null)
const userTableColumns = [
	{ key: 'account', dataKey: 'account', title: '账户', width: 180, flexGrow: 1 },
	{ key: 'userName', dataKey: 'userName', title: '用户名', width: 180, flexGrow: 1 },
	{ key: 'teamName', dataKey: 'teamName', title: '小组', width: 180, flexGrow: 1 },
]

const filteredUserRows = computed(() => {
	const keyword = String(tableKeyword.value || '').trim().toLowerCase()
	if (!keyword) {
		return userOptions.value
	}
	return userOptions.value.filter((item) => {
		return String(item.userName || '').toLowerCase().includes(keyword) || String(item.account || '').toLowerCase().includes(keyword)
	})
})

const handleUserRowClick = ({ rowData }) => {
	selectedUserId.value = rowData.id
	account.value = rowData.account
}

const getUserRowClass = (rowData) => {
	return selectedUserId.value === rowData.id ? 'current-row' : ''
}

const syncSelectedByAccount = () => {
	const key = account.value.trim()
	if (!key) {
		selectedUserId.value = null
		return
	}
	const matched = userOptions.value.find((item) => item.account === key)
	selectedUserId.value = matched ? matched.id : null
}

const loadUserOptions = async () => {
	try {
		const response = await api_user_showall()
		userOptions.value = (response.data || []).map((item) => ({
			id: item.id,
			account: item.account,
			userName: item.userName,
			teamName: item.teamName || '',
		}))
		syncSelectedByAccount()
	} catch {}
}

onMounted(() => {
	const savedTheme = localStorage.getItem(THEME_KEY)
	const shouldUseDark = savedTheme
		? savedTheme === 'dark'
		: window.matchMedia('(prefers-color-scheme: dark)').matches

	document.documentElement.classList.toggle('dark', shouldUseDark)
	loadUserOptions()
})


async function login(){
    const response = await api_signin_reviewer(account.value, password.value)
    const sessionId = response.data?.sessionId
    if (sessionId) {
      localStorage.setItem('reviewerSessionId', sessionId)
    }
	else{
		openErrorMessageBox({ message: '登录失败' })
		return
	}

    const userName = response.data.userName
    const role = String(response.data.role)

    localStorage.setItem('reviewerUsername', userName)
    localStorage.setItem('reviewerRole', role)
    localStorage.setItem('currentUserName', userName)

    router.push("/home")
}
</script>
  
  
  
  
  
  
  
  
  
  
  
  
<style scoped >
.page{
	position: fixed;
	inset: 0;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 24px;
	background: transparent;
	transition-property:filter;
  	transition-duration: 0.8s;
}

.login-box{
	width: min(700px, 100%);
	min-height: 680px;
	padding: 44px 46px;
	background: var(--el-bg-color);
	box-sizing: border-box;
	box-shadow: 0 18px 36px rgba(0, 0, 0, 0.28);
	border: 1px solid var(--el-border-color-light);
	border-radius: 16px;
	backdrop-filter: blur(8px);
}
.login-box .brand-title { /*标题1*/
	margin: 0 0 10px;
	padding: 0;
	text-align: center;
}

.brand-title {
  font-family: "Trebuchet MS", "Segoe UI", sans-serif;
  font-size: 42px;
  font-weight: 1000;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--el-text-color-primary);
}
.login-box h2{ /*标题2*/
	margin: 0 0 10px;
	padding: 0;
	text-align: center;
	color: var(--el-text-color-primary);
	font-size: 20px;


}
.login-box .login-field{
	position: relative;
}

.login-box .login-field  input{
	width: 100%;
	padding: 14px 0;
	color: var(--el-text-color-primary);
	margin-bottom: 30px;
	border: none;
	border-bottom: 1px solid var(--el-border-color-light);
	outline: none;
	background: transparent;
	font-size: 18px;
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
	color: var(--el-text-color-primary);
}
.submit-btn{    /*登录按钮*/
	border: none;
	color: var(--el-text-color-primary);
	font-size: 20px;
	font-weight:900	;
	background: var(--signin-button-bg);
	width: 250px;
	height: 60px;
	border-radius: 30px;
	display: block;
	margin: 24px auto 0;
	cursor: pointer;
	transition: all 0.3s ease-in-out;
}

.user-table-wrap {
	margin-top: 6px;
}

.table-header-row {
	display: flex;
	align-items: center;
	gap: 12px;
	margin-bottom: 8px;
}

.table-title {
	margin: 0;
	font-size: 15px;
	color: var(--el-text-color-primary);
	white-space: nowrap;
}

.table-search-input {
	flex: 1;
	height: 34px;
	border: 1px solid var(--el-border-color-light);
	border-radius: 8px;
	padding: 0 10px;
	font-size: 14px;
	color: var(--el-text-color-primary);
	background: var(--el-bg-color-overlay);
	outline: none;
}

.mini-table {
	height: 220px;
	border: 1px solid var(--el-border-color-light);
	border-radius: 8px;
	overflow: hidden;
	background: var(--el-bg-color-overlay);
}

.mini-table :deep(.el-table-v2__row.current-row .el-table-v2__row-cell) {
	background-color: var(--table-current-row-bg) !important;
	color: var(--table-current-row-text) !important;
}

.submit-btn:hover{    /*登录按钮*/
	transform: translateY(-2px);
	filter: brightness(1.06);
}

@media (max-width: 768px) {
	.page {
		padding: 16px;
	}

	.login-box {
		min-height: auto;
		padding: 30px 24px;
	}

	.login-box h1 {
		font-size: 30px;
	}

	.login-box h2 {
		font-size: 18px;
	}

	.submit-btn {
		width: 100%;
	}
}

</style>
  
