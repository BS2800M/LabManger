import {createRouter,createWebHashHistory} from 'vue-router'



const signin = () => import('@/components/signin.vue');
const home = () => import('@/components/home.vue');
const reagent = () => import('@/components/reagent.vue');
const homebar = () => import('@/components/homebar.vue');   
const print = () => import('@/components/print.vue');
const signout = () => import('@/components/signout.vue');
const team = () => import('@/components/team.vue');
const user = () => import('@/components/user.vue');
const lot = () => import('@/components/lot.vue');
const inbound = () => import('@/components/inbound.vue');
const outbound = () => import('@/components/outbound.vue');
const operation = () => import('@/components/operation.vue');
const statistics = () => import('@/components/statistics.vue');
const location = () => import('@/components/location.vue');
const sensorRecord = () => import('@/components/sensorRecord.vue');


const router=createRouter({
    history:createWebHashHistory(),
    routes:[
        {
            path:'/',
            components:{main:home,bar:homebar,}
        },
        {
            path:'/signin',
            components:{main:signin}
        },
        {
            path:'/home',

            components:{main:home,bar:homebar}
        },
        {
            path:'/reagent',
            components:{main:reagent,bar:homebar}
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
            path:'/operation',
            components:{main:operation,bar:homebar}
        },
        {
            path:'/statistics',
            components:{main:statistics,bar:homebar}
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
            path:'/signout',
            components:{main:signout}
        },
        {
            path:'/location',
            components:{main:location,bar:homebar}
        },
        {
            path:'/sensorRecord',
            components:{main:sensorRecord,bar:homebar}
        },
    ]
})

export default router