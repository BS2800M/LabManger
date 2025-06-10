import * as team from '../view/team.js';
import * as reagent from '../view/reagent.js';
import * as lot from '../view/lot.js';
import * as operation from '../view/operation.js';

async function mainrouter(fastify, options) {
    fastify.register(team_router, { prefix: '/team' });
    fastify.register(reagent_router, { prefix: '/reagent' });
    fastify.register(lot_router, { prefix: '/lot' });
    fastify.register(operation_router, { prefix: '/operation' });
    
}
async function team_router(fastify, options) {
    fastify.post('/add/', { schema: team.team_add_schema }, team.team_add);
    fastify.get('/show/', { schema: team.team_show_schema }, team.team_show);
    fastify.put('/update/', { schema: team.team_update_schema }, team.team_update);
    fastify.put('/del/', { schema: team.team_del_schema }, team.team_del);
}
async function reagent_router(fastify, options) {
    fastify.post('/add/', { schema: reagent.reagent_add_schema }, reagent.reagent_add);
    fastify.get('/show/', { schema: reagent.reagent_show_schema }, reagent.reagent_show);
    fastify.put('/update/', { schema: reagent.reagent_update_schema }, reagent.reagent_update);
    fastify.put('/del/', { schema: reagent.reagent_del_schema }, reagent.reagent_del);
    fastify.get('/showall/', { schema: reagent.reagent_showall_schema }, reagent.reagent_showall);
}
async function lot_router(fastify, options) {
    fastify.post('/add/', { schema: lot.lot_add_schema }, lot.lot_add);
    fastify.get('/show/', { schema: lot.lot_show_schema }, lot.lot_show);
    fastify.put('/update/', { schema: lot.lot_update_schema }, lot.lot_update);
    fastify.put('/del/', { schema: lot.lot_del_schema }, lot.lot_del);
    fastify.get('/showall/', { schema: lot.lot_showall_schema }, lot.lot_showall);
}
async function operation_router(fastify, options) {
    fastify.post('/inbound/', { schema: operation.inbound_schema }, operation.inbound);
    fastify.post('/outbound/', { schema: operation.outbound_schema }, operation.outbound);
    fastify.post('/special_outbound/', { schema: operation.special_outbound_schema }, operation.special_outbound);
    fastify.get('/show/', { schema: operation.operation_show_schema }, operation.operation_show);
}
export default mainrouter;
