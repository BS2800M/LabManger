import {createRouter,createWebHashHistory} from 'vue-router'



const signin = () => import('@/components/signin.vue');
const home = () => import('@/components/home.vue');
const homebar = () => import('@/components/homebar.vue');   
const team = () => import('@/components/team.vue');
const user = () => import('@/components/user.vue');
const inbound = () => import('@/components/inbound.vue');
const outbound = () => import('@/components/outbound.vue');
const operation = () => import('@/components/operation.vue');
const inventory = () => import('@/components/inventory.vue');
const reagentLot = () => import('@/components/reagentLot.vue');
const locationSensorRecord = () => import('@/components/locationSensorRecord.vue');


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
            path:'/reagent-lot',
            components:{main:reagentLot,bar:homebar}
        },
        {
            path:'/location-sensor-record',
            components:{main:locationSensorRecord,bar:homebar}
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
            path:'/inventory',
            components:{main:inventory,bar:homebar}
        },
        {
            path:'/team',
            components:{main:team,bar:homebar}
        },
        {
            path:'/user',
            components:{main:user,bar:homebar}
        },
    ]
})

export default router
