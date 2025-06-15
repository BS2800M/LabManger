//定义所有接口的shema
const team_add_schema = {
    body: {
        type: 'object',
        properties: {
            name: { type: 'string' },
            phone: { type: 'string' },
            note: { type: 'string' },
            using: { type: 'boolean' }
        },
        required: ['name', 'phone', 'using']
    }
};
const team_show_schema = {
    querystring: {
        type: 'object',
        properties: {
            name: { type: 'string' },
            page: { type: 'number' },
            pagesize: { type: 'number' }
        },
        required: ['name', 'page', 'pagesize']
    }
};
const team_update_schema = {
    body: {
        type: 'object',
        properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            phone: { type: 'string' },
            note: { type: 'string' },
            using: { type: 'boolean' }
        },
        required: ['id', 'name', 'phone', 'using']
    }
};
const team_del_schema = {
    body: {
        type: 'object',
        properties: {
            id: { type: 'number' }
        },
    }
};
const reagent_add_schema = {
    body: {
        type: 'object',
        properties: {
            name: { type: 'string' },
            specifications: { type: 'string' },
            warn_number: { type: 'number' },
            price: { type: 'number' },
            warn_days: { type: 'number' },
            storage_condition: { type: 'string' },
            using: { type: 'boolean' },
        },
        required: ['name', 'specifications', 'warn_number', 'price', 'warn_days', 'storage_condition', 'using']
    }
};
const reagent_show_schema = {
    querystring: {
        type: 'object',
        properties: {
            name: { type: 'string' },
            page: { type: 'number' },
            pagesize: { type: 'number' }
        },
        required: ['name', 'page', 'pagesize']
    }
};
const reagent_update_schema = {
    body: {
        type: 'object',
        properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            specifications: { type: 'string' },
            warn_number: { type: 'number' },
            price: { type: 'number' },
            storage_condition: { type: 'string' },
            warn_days: { type: 'number' },
            using: { type: 'boolean' },
        },
        required: ['id', 'name', 'specifications', 'warn_number', 'price', 'storage_condition', 'warn_days', 'using']
    }
};
const reagent_del_schema = {
    body: {
        type: 'object',
        properties: {
            id: { type: 'number' }
        },
        required: ['id']
    }
};
const reagent_showall_schema = {
    querystring: {
        type: 'object',
        properties: {}
    }
};
const lot_add_schema = {
    body: {
        type: 'object',
        properties: {
            name: { type: 'string' },
            reagentid: { type: 'number' },
            expiration_date: { type: 'string' },
            using: { type: 'boolean' },
        },
        required: ['name', 'reagentid', 'expiration_date', 'using']
    }
};
const lot_show_schema = {
    querystring: {
        type: 'object',
        properties: {
            reagentname: { type: 'string' },
            page: { type: 'number' },
            pagesize: { type: 'number' },
        },
        required: ['reagentname', 'page', 'pagesize']
    }
};
const lot_update_schema = {
    body: {
        type: 'object',
        properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            reagentid: { type: 'number' },
            expiration_date: { type: 'string' },
            using: { type: 'boolean' },
        },
        required: ['id', 'name', 'reagentid', 'expiration_date', 'using']
    }
};
const lot_del_schema = {
    body: {
        type: 'object',
        properties: {
            id: { type: 'number' },
        },
        required: ['id']
    }
};
const lot_showall_schema = {
    querystring: {
        type: 'object',
        properties: {
            reagentid: { type: 'number' },
        }
    }
};
const inbound_schema = {
    body: {
        type: 'object',
        properties: {
            inboundlist: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        reagentid: { type: 'number' },
                        lotid: { type: 'number' },
                        number: { type: 'number' },
                    },
                    required: ['reagentid', 'lotid', 'number']
                }
            },
        },
        required: ['inboundlist']
    }
};
const outbound_schema = {
    body: {
        type: 'object',
        properties: {
            barcodenumber: { type: 'string' },
        },
        required: ['barcodenumber']
    }
};
const special_outbound_schema = {
    body: {
        type: 'object',
        properties: {
            outboundlist: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        reagentid: { type: 'number' },
                        lotid: { type: 'number' },
                        number: { type: 'number' },
                    },
                    required: ['reagentid', 'lotid', 'number']
                }
            }
        },
        required: ['outboundlist']
    }
};
const operation_show_schema = {
    querystring: {
        type: 'object',
        properties: {
            reagentname: { type: 'string' },
            searchlater: { type: 'string' },
            searchearlier: { type: 'string' },
            page: { type: 'number' },
            barcodenumber: { type: 'string' },
            pagesize: { type: 'number' },
        },
        required: ['reagentname', 'searchlater', 'searchearlier', 'page', 'barcodenumber', 'pagesize']
    }
};
const operation_show_exportToExcel_schema = {
    querystring: {
        type: 'object',
        properties: {}
    }
};
const operation_del_schema = {
    body: {
        type: 'object',
        properties: {
            id: { type: 'number' },
        },
        required: ['id']
    }
};
const inventory_show_schema = {
    querystring: {
        type: 'object',
        properties: {
            page: { type: 'number' },
            pagesize: { type: 'number' },
            only_warn: { type: 'boolean' },
        },
        required: ['page', 'pagesize']
    }
};
const user_add_schema = {
    body: {
        type: 'object',
        properties: {
            username: { type: 'string' },
            password: { type: 'string' },
            permission: { type: 'string' },
            teamid: { type: 'number' },
        },
        required: ['username', 'password', 'permission', 'teamid']
    }
};
const user_del_schema = {
    body: {
        type: 'object',
        properties: {
            id: { type: 'number' },
        },
    },
    required: ['id']
};
const loginout_login_schema = {
    querystring: {
        type: 'object',
        properties: {
            username: { type: 'string' },
            password: { type: 'string' },
        },
    }
};
const loginout_logout_schema = {
    querystring: {
        type: 'object',
        properties: {
            username: { type: 'string' },
        },
    }
};
const inventory_audit_schema = {
    body: {
        type: 'object',
        properties: {
            reagentid: { type: 'number' },
            lotid: { type: 'number' },
        },
        required: ['reagentid', 'lotid']
    }
};
export { team_add_schema, team_show_schema, team_update_schema, team_del_schema, reagent_add_schema, reagent_show_schema, reagent_update_schema, reagent_del_schema, reagent_showall_schema, lot_add_schema, lot_show_schema, lot_update_schema, lot_del_schema, lot_showall_schema, inbound_schema, outbound_schema, special_outbound_schema, operation_show_schema, operation_del_schema, inventory_show_schema, user_add_schema, user_del_schema, loginout_login_schema, loginout_logout_schema, inventory_audit_schema, operation_show_exportToExcel_schema };
