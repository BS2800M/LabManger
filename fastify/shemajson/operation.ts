// 操作相关的 schema 定义

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
}

const outbound_schema = {
    body: {
        type: 'object',
        properties: {
            barcodenumber: { type: 'string' },
        },
        required: ['barcodenumber']
    }
}

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
}

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
}

const operation_show_exportToExcel_schema = {
    querystring: {
        type: 'object',
        properties: {
        }
    }
}

const operation_del_schema = {
    body: {
        type: 'object',
        properties: {
            id: { type: 'number' },
        },
        required: ['id']
    }
}

export {
    inbound_schema,
    outbound_schema,
    special_outbound_schema,
    operation_show_schema,
    operation_show_exportToExcel_schema,
    operation_del_schema
} 