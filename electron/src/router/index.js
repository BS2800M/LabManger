import {createRouter,createWebHistory,createWebHashHistory} from 'vue-router'

import login from '@/components/login.vue'
import homebar from '@/components/homebar.vue'
import home from '@/components/home.vue'
import print from '@/components/print.vue'
import loginout from '../components/loginout.vue'
import team from '@/components/team.vue'
import user from '@/components/user.vue'
// import reagent_template from '@/components/reagent_template.vue'
// import lot from '@/components/lot.vue'
// import inbound from '@/components/inbound.vue'
// import outbound from '@/components/outbound.vue'
// import list_operation from '@/components/list_operation.vue'


const template = () => import('@/components/template.vue');
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