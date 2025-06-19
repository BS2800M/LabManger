import {FastifyInstance} from 'fastify'  
import * as team from '../view/team.js'
import * as reagent from '../view/reagent.js'
import * as lot from '../view/lot.js'
import * as operation from '../view/operation.js'
import * as inventory from '../view/inventory.js'
import * as user from '../view/user.js'
import * as loginout from '../view/loginout.js'
import * as shemajson from '../shemajson/index.js'

interface AuthFastifyInstance extends FastifyInstance{
    auth?:any
    check_permission?:any
}

async function mainrouter(fastify:AuthFastifyInstance,options:any){
    fastify.register(team_router,{ prefix: '/team' })
    fastify.register(reagent_router, { prefix: '/reagent' })
    fastify.register(lot_router, { prefix: '/lot' })
    fastify.register(operation_router, { prefix: '/operation' })
    fastify.register(inventory_router, { prefix: '/inventory' })
    fastify.register(user_router, { prefix: '/user' })
    fastify.register(loginout_router, { prefix: '/loginout' })
}

async function team_router(fastify:AuthFastifyInstance,options:any){
    fastify.addHook('onRequest',fastify.auth)
    fastify.post('/add/',{schema:shemajson.team_add_schema,preHandler:fastify.check_permission('team_add')},team.team_add)
    fastify.get('/show/',{schema:shemajson.team_show_schema,preHandler:fastify.check_permission('team_show')},team.team_show)
    fastify.put('/update/',{schema:shemajson.team_update_schema,preHandler:fastify.check_permission('team_update')},team.team_update)
    fastify.put('/del/',{schema:shemajson.team_del_schema,preHandler:fastify.check_permission('team_del')},team.team_del)
}

async function reagent_router(fastify:AuthFastifyInstance,options:any){
    fastify.addHook('onRequest',fastify.auth)
    fastify.post('/add/',{schema:shemajson.reagent_add_schema,preHandler:fastify.check_permission('reagent_add')},reagent.reagent_add)
    fastify.get('/show/',{schema:shemajson.reagent_show_schema,preHandler:fastify.check_permission('reagent_show')},reagent.reagent_show)
    fastify.put('/update/',{schema:shemajson.reagent_update_schema,preHandler:fastify.check_permission('reagent_update')},reagent.reagent_update)
    fastify.put('/del/',{schema:shemajson.reagent_del_schema,preHandler:fastify.check_permission('reagent_del')},reagent.reagent_del)
    fastify.get('/showall/',{schema:shemajson.reagent_showall_schema,preHandler:fastify.check_permission('reagent_showall')},reagent.reagent_showall)
}

async function lot_router(fastify:AuthFastifyInstance,options:any){
    fastify.addHook('onRequest',fastify.auth)
    fastify.post('/add/',{schema:shemajson.lot_add_schema,preHandler:fastify.check_permission('lot_add')},lot.lot_add)
    fastify.get('/show/',{schema:shemajson.lot_show_schema,preHandler:fastify.check_permission('lot_show')},lot.lot_show)
    fastify.put('/update/',{schema:shemajson.lot_update_schema,preHandler:fastify.check_permission('lot_update')},lot.lot_update)
    fastify.put('/del/',{schema:shemajson.lot_del_schema,preHandler:fastify.check_permission('lot_del')},lot.lot_del)
    fastify.get('/showall/',{schema:shemajson.lot_showall_schema,preHandler:fastify.check_permission('lot_showall')},lot.lot_showall)
}


async function operation_router(fastify:AuthFastifyInstance,options:any){
    fastify.addHook('onRequest',fastify.auth)
    fastify.post('/inbound/',{schema:shemajson.inbound_schema,preHandler:fastify.check_permission('inbound')},operation.inbound)
    fastify.post('/outbound/',{schema:shemajson.outbound_schema,preHandler:fastify.check_permission('outbound')},operation.outbound)
    fastify.post('/special_outbound/',{schema:shemajson.special_outbound_schema,preHandler:fastify.check_permission('special_outbound')},operation.special_outbound)
    fastify.get('/show/',{schema:shemajson.operation_show_schema,preHandler:fastify.check_permission('operation_show')},operation.operation_show)
    fastify.put('/del/',{schema:shemajson.operation_del_schema,preHandler:fastify.check_permission('operation_del')},operation.operation_del)
    fastify.get('/show_exportToExcel/',{schema:shemajson.operation_show_exportToExcel_schema,preHandler:fastify.check_permission('operation_show_exportToExcel')},operation.operation_show_exportToExcel)
}

async function inventory_router(fastify:AuthFastifyInstance,options:any){
    fastify.addHook('onRequest',fastify.auth)
    fastify.get('/show/',{schema:shemajson.inventory_show_schema,preHandler:fastify.check_permission('inventory_show')},inventory.inventory_show)
    fastify.put('/audit/',{schema:shemajson.inventory_audit_schema,preHandler:fastify.check_permission('inventory_audit')},inventory.inventory_audit)
}

async function user_router(fastify:AuthFastifyInstance,options:any){
    fastify.addHook('onRequest',fastify.auth)
    fastify.post('/add/',{schema:shemajson.user_add_schema,preHandler:fastify.check_permission('user_add')},user.user_add)
    fastify.put('/del/',{schema:shemajson.user_del_schema,preHandler:fastify.check_permission('user_del')},user.user_del)
    fastify.get('/show/',{schema:shemajson.user_show_schema,preHandler:fastify.check_permission('user_show')},user.user_show)
    fastify.put('/update/',{schema:shemajson.user_update_schema,preHandler:fastify.check_permission('user_update')},user.user_update)
}

async function loginout_router(fastify:FastifyInstance,options:any){
    fastify.get('/login/',{schema:shemajson.loginout_login_schema},loginout.login)
    fastify.get('/logout/',{schema:shemajson.loginout_logout_schema},loginout.logout)

}


export default mainrouter



