import {createRouter,createWebHistory,createWebHashHistory} from 'vue-router'



const login = () => import('@/components/login.vue');
const home = () => import('@/components/home.vue');
const template = () => import('@/components/template.vue');
const homebar = () => import('@/components/homebar.vue');   
const print = () => import('@/components/print.vue');
const loginout = () => import('@/components/loginout.vue');
const team = () => import('@/components/team.vue');
const user = () => import('@/components/user.vue');
const lot = () => import('@/components/lot.vue');
const inbound = () => import('@/components/inbound.vue');
const outbound = () => import('@/components/outbound.vue');
const list_operation = () => import('@/components/list_operation.vue');
const warn_reagent = () => import('@/components/warn_reagent.vue');

const router=createRouter({
    history:createWebHashHistory(),
    routes:[
        {
            path:'/',
            components:{main:home,bar:homebar}
        },
        {
            path:'/login',
            components:{main:login}
        },
        {
            path:'/home',

            components:{main:home,bar:homebar}
        },
        {
            path:'/template',
            components:{main:template,bar:homebar}
        },
        {
            path:'/lot',
            components:{main:lot,bar:homebar}
        },
        {
            path:'/inbound',
            components:{main:inbound,bar:homebar}
        },
        {
            path:'/outbound',
            components:{main:outbound,bar:homebar}
        },
        {
            path:'/list_operation',
            components:{main:list_operation,bar:homebar}
        },
        {
            path:'/warn_reagent',
            components:{main:warn_reagent,bar:homebar}
        },
        {
            path:'/team',
            components:{main:team,bar:homebar}
        },
        {
            path:'/user',
            components:{main:user,bar:homebar}
        },
        {
            path:'/print',
            components:{main:print}
        },
        {
            path:'/loginout',
            components:{main:loginout}
        },
    ]
})

export default router