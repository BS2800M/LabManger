// 试剂相关的 schema 定义

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
}

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
}

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
}

const reagent_del_schema = {
    body: {
        type: 'object',
        properties: {
            id: { type: 'number' }
        },
        required: ['id']
    }
}

const reagent_showall_schema = {
    querystring: {
        type: 'object',
        properties: {
        }
    }
}

export {
    reagent_add_schema,
    reagent_show_schema,
    reagent_update_schema,
    reagent_del_schema,
    reagent_showall_schema
} 