import * as team from '../view/team.js';
import * as reagent from '../view/reagent.js';
import * as lot from '../view/lot.js';
import * as operation from '../view/operation.js';
import * as inventory from '../view/inventory.js';
import * as user from '../view/user.js';
import * as shemajson from '../shemajson/shemajson.js';
import * as loginout from '../view/loginout.js';
async function mainrouter(fastify, options) {
    fastify.register(team_router, { prefix: '/team' });
    fastify.register(reagent_router, { prefix: '/reagent' });
    fastify.register(lot_router, { prefix: '/lot' });
    fastify.register(operation_router, { prefix: '/operation' });
    fastify.register(inventory_router, { prefix: '/inventory' });
    fastify.register(user_router, { prefix: '/user' });
    fastify.register(loginout_router, { prefix: '/loginout' });
}
async function team_router(fastify, options) {
    fastify.addHook('onRequest', fastify.auth);
    fastify.post('/add/', { schema: shemajson.team_add_schema }, team.team_add);
    fastify.get('/show/', { schema: shemajson.team_show_schema }, team.team_show);
    fastify.put('/update/', { schema: shemajson.team_update_schema }, team.team_update);
    fastify.put('/del/', { schema: shemajson.team_del_schema }, team.team_del);
}
async function reagent_router(fastify, options) {
    fastify.addHook('onRequest', fastify.auth);
    fastify.post('/add/', { schema: shemajson.reagent_add_schema }, reagent.reagent_add);
    fastify.get('/show/', { schema: shemajson.reagent_show_schema }, reagent.reagent_show);
    fastify.put('/update/', { schema: shemajson.reagent_update_schema }, reagent.reagent_update);
    fastify.put('/del/', { schema: shemajson.reagent_del_schema }, reagent.reagent_del);
    fastify.get('/showall/', { schema: shemajson.reagent_showall_schema }, reagent.reagent_showall);
}
async function lot_router(fastify, options) {
    fastify.addHook('onRequest', fastify.auth);
    fastify.post('/add/', { schema: shemajson.lot_add_schema }, lot.lot_add);
    fastify.get('/show/', { schema: shemajson.lot_show_schema }, lot.lot_show);
    fastify.put('/update/', { schema: shemajson.lot_update_schema }, lot.lot_update);
    fastify.put('/del/', { schema: shemajson.lot_del_schema }, lot.lot_del);
    fastify.get('/showall/', { schema: shemajson.lot_showall_schema }, lot.lot_showall);
}
async function operation_router(fastify, options) {
    fastify.addHook('onRequest', fastify.auth);
    fastify.post('/inbound/', { schema: shemajson.inbound_schema }, operation.inbound);
    fastify.post('/outbound/', { schema: shemajson.outbound_schema }, operation.outbound);
    fastify.post('/special_outbound/', { schema: shemajson.special_outbound_schema }, operation.special_outbound);
    fastify.get('/show/', { schema: shemajson.operation_show_schema }, operation.operation_show);
    fastify.put('/del/', { schema: shemajson.operation_del_schema }, operation.operation_del);
    fastify.get('/show_exportToExcel/', { schema: shemajson.operation_show_exportToExcel_schema }, operation.operation_show_exportToExcel);
}
async function inventory_router(fastify, options) {
    fastify.addHook('onRequest', fastify.auth);
    fastify.get('/show/', { schema: shemajson.inventory_show_schema }, inventory.inventory_show);
    fastify.put('/audit/', { schema: shemajson.inventory_audit_schema }, inventory.inventory_audit);
}
async function user_router(fastify, options) {
    fastify.post('/add/', { schema: shemajson.user_add_schema }, user.user_add);
    fastify.put('/del/', { schema: shemajson.user_del_schema }, user.user_del);
}
async function loginout_router(fastify, options) {
    fastify.get('/login/', { schema: shemajson.loginout_login_schema }, loginout.login);
    fastify.get('/logout/', { schema: shemajson.loginout_logout_schema }, loginout.logout);
}
export default mainrouter;
