// 批号相关的 schema 定义

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
}

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
}

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
}

const lot_del_schema = {
    body: {
        type: 'object',
        properties: {
            id: { type: 'number' },
        },
        required: ['id']
    }
}

const lot_showall_schema = {
    querystring: {
        type: 'object',
        properties: {
            reagentid: { type: 'number' },
        }
    }
}

export {
    lot_add_schema,
    lot_show_schema,
    lot_update_schema,
    lot_del_schema,
    lot_showall_schema
}