// 库存相关的 schema 定义

const inventory_show_schema = {
    querystring: {
        type: 'object',
        properties: {
            page: { type: 'number' },
            pagesize: { type: 'number' },
        },
        required: ['page', 'pagesize']
    }
}

const inventory_audit_schema = {
    body: {
        type: 'object',
        properties: {
            reagentid: { type: 'number' },
            lotid: { type: 'number' },
        },
        required: ['reagentid', 'lotid']
    }
}

export {
    inventory_show_schema,
    inventory_audit_schema,
} 
